import { Router } from "express";

import {
    createSlot,
    getAvailableSlots
 } from "../controller/slot.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = Router();

// Only authenticated providers can create slots.
router.post(
  "/",
  verifyJWT,
  authorizeRoles("provider"),
  createSlot
);

// Authenticated users can view available slots.
router.get(
  "/available",
  verifyJWT,
  authorizeRoles("user"),
  getAvailableSlots
);

export default router;