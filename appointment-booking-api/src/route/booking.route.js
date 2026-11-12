import { Router } from "express";

import { createBooking } from "../controller/booking.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = Router();

// Only authenticated users can book appointments.
router.post(
  "/",
  verifyJWT,
  authorizeRoles("user"),
  createBooking
);

export default router;