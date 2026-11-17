import { createBooking as createBookingService,
    getUserBookings as getUserBookingsService,
    getProviderBookings as getProviderBookingsService,
    cancelBooking as cancelBookingService,
 } from "../service/booking.service.js";

import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { slotId } = req.body;

  if (!slotId) {
    throw new ApiError(400, "Slot ID is required");
  }

  const booking = await createBookingService({
    userId: req.user._id,
    slotId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, booking, "Appointment booked successfully")
    );
});

export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await getUserBookingsService(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        bookings,
        "Your bookings fetched successfully"
      )
    );
});

export const getProviderBookings = asyncHandler(async (req, res) => {
  const bookings = await getProviderBookingsService(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        bookings,
        "Provider bookings fetched successfully"
      )
    );
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await cancelBookingService({
    bookingId: req.params.id,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, booking, "Booking cancelled successfully")
    );
});