
import { Router } from "express";

import {
  createBooking,
  getUserBookings,
  getProviderBookings,
  cancelBooking,
} from "../controller/booking.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Appointment booking and cancellation management
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Book an available appointment slot
 *     description: Only users can book slots. Each slot and each user can have only one confirmed booking at a time.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slotId
 *             properties:
 *               slotId:
 *                 type: string
 *                 example: "673a12345678901234567890"
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Invalid slot ID or slot cannot be booked
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only users can book appointments
 *       404:
 *         description: Slot not found
 *       409:
 *         description: Slot already booked or user already has an active booking
 */
router.post("/", verifyJWT, authorizeRoles("user"), createBooking);

/**
 * @swagger
 * /api/bookings/my-bookings:
 *   get:
 *     summary: Get the logged-in user's booking history
 *     description: Returns confirmed and cancelled bookings belonging to the authenticated user.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User bookings retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only users can access this endpoint
 */
router.get(
  "/my-bookings",
  verifyJWT,
  authorizeRoles("user"),
  getUserBookings
);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get bookings for the provider
 *     description: Returns bookings associated with slots created by the authenticated provider.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Provider bookings retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only providers can access this endpoint
 */
router.get(
  "/",
  verifyJWT,
  authorizeRoles("provider"),
  getProviderBookings
);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment booking
 *     description: Only the user who owns a confirmed booking can cancel it. The cancelled slot becomes available again.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *         example: "673a12345678901234567890"
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Invalid booking ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only users can cancel bookings
 *       404:
 *         description: Booking not found or does not belong to the user
 *       409:
 *         description: Booking is already cancelled
 */
router.patch(
  "/:id/cancel",
  verifyJWT,
  authorizeRoles("user"),
  cancelBooking
);

export default router;
