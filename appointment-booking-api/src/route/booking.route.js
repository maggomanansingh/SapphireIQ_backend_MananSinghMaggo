import { Router } from "express";

import { createBooking,
    getUserBookings,
    getProviderBookings,
    cancelBooking
 } from "../controller/booking.controller.js";

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

// Users can view their own booking history.
router.get(
  "/my-bookings",
  verifyJWT,
  authorizeRoles("user"),
  getUserBookings
);

// Providers can view bookings for their own slots.
router.get(
  "/",
  verifyJWT,
  authorizeRoles("provider"),
  getProviderBookings
);

router.patch(
  "/:id/cancel",
  verifyJWT,
  authorizeRoles("user"),
  cancelBooking
);

export default router;