import { createBooking as createBookingService } from "../service/booking.service.js";

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