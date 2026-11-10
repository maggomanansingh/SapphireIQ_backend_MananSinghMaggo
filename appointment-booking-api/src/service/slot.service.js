import {Slot} from "../model/slot.model.js";
import {ApiError} from "../utils/ApiError.js";

const SLOT_DURATION = 30 * 60 * 1000; // 30 minutes

export const createSlot = async ({ providerId, startTime, endTime }) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Validate date values
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new ApiError(400, "Invalid slot date or time");
  }

  // Slot must start in the future
  if (start <= new Date()) {
    throw new ApiError(400, "Slot must be scheduled in the future");
  }

  // Validate slot duration
  if (end.getTime() - start.getTime() !== SLOT_DURATION) {
    throw new ApiError(400, "Slot duration must be exactly 30 minutes");
  }

  // Check for overlapping slots belonging to the same provider
  const overlappingSlot = await Slot.findOne({
    provider: providerId,
    startTime: { $lt: end },
    endTime: { $gt: start },
  });

  if (overlappingSlot) {
    throw new ApiError(409, "This slot overlaps with an existing slot");
  }

  const slot = await Slot.create({
    provider: providerId,
    startTime: start,
    endTime: end,
  });

  return slot;
};