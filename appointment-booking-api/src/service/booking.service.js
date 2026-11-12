import mongoose from "mongoose";

import {Booking} from "../model/booking.model.js";
import {Slot} from "../model/slot.model.js";
import {ApiError} from "../utils/ApiError.js";

export const createBooking = async ({ userId, slotId }) => {
  // Validate slot ID
  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    throw new ApiError(400, "Invalid slot ID");
  }

  // Find the requested slot
  const slot = await Slot.findById(slotId);

  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  // Slot must be in the future
  if (slot.startTime <= new Date()) {
    throw new ApiError(400, "Cannot book a past or started slot");
  }

  // Check whether the user already has an active booking
  const existingUserBooking = await Booking.findOne({
    user: userId,
    status: "confirmed",
  });

  if (existingUserBooking) {
    throw new ApiError(409, "You already have an active booking");
  }

  // Create booking
  try {
    const booking = await Booking.create({
      user: userId,
      slot: slotId,
      status: "confirmed",
    });

    return booking;
  } catch (error) {
    // Handle duplicate booking caused by unique indexes
    if (error.code === 11000) {
      throw new ApiError(
        409,
        "This slot is already booked or you already have an active booking"
      );
    }

    throw error;
  }
};

export const getUserBookings = async (userId) => {
  const bookings = await Booking.find({ user: userId })
    .populate({
      path: "slot",
      populate: {
        path: "provider",
        select: "name email",
      },
    })
    .sort({ createdAt: -1 });

  return bookings;
};

export const getProviderBookings = async (providerId) => {
  // Find all slots created by this provider.
  const slots = await Slot.find({ provider: providerId }).select("_id");

  const slotIds = slots.map((slot) => slot._id);

  // Find bookings associated with those slots.
  const bookings = await Booking.find({
    slot: { $in: slotIds },
  })
    .populate("user", "name email")
    .populate("slot", "startTime endTime")
    .sort({ createdAt: -1 });

  return bookings;
};