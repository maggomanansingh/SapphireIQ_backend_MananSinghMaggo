import {
    createSlot as createSlotService,
    getAvailableSlots as getAvailableSlotsService,
 } from "../service/slot.service.js";

import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const createSlot = asyncHandler(async (req, res) => {
  const { startTime, endTime } = req.body;

  if (!startTime || !endTime) {
    throw new ApiError(400, "Start time and end time are required");
  }

  const slot = await createSlotService({
    providerId: req.user._id,
    startTime,
    endTime,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, slot, "Slot created successfully"));
});

export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { providerId, date } = req.query;

  if (!providerId || !date) {
    throw new ApiError(400, "Provider ID and date are required");
  }

  const slots = await getAvailableSlotsService({
    providerId,
    date,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        slots,
        "Available slots fetched successfully"
      )
    );
});