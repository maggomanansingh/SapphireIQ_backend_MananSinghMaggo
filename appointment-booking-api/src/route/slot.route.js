
import { Router } from "express";

import {
  createSlot,
  getAvailableSlots,
} from "../controller/slot.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Slots
 *   description: Appointment slot management
 */

/**
 * @swagger
 * /api/slots:
 *   post:
 *     summary: Create a new appointment slot
 *     description: Only providers can create appointment slots. Each slot must be 30 minutes long and in the future.
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startTime
 *               - endTime
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-12-20T10:00:00.000Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-12-20T10:30:00.000Z"
 *     responses:
 *       201:
 *         description: Slot created successfully
 *       400:
 *         description: Invalid slot details
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only providers can create slots
 *       409:
 *         description: Slot overlaps with an existing slot
 */
router.post("/", verifyJWT, authorizeRoles("provider"), createSlot);

/**
 * @swagger
 * /api/slots/available:
 *   get:
 *     summary: Get available appointment slots
 *     description: Returns future slots for a provider on a specific date, excluding slots with confirmed bookings.
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the provider
 *         example: "673a12345678901234567890"
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format (UTC)
 *         example: "2026-12-20"
 *     responses:
 *       200:
 *         description: Available slots retrieved successfully
 *       400:
 *         description: Invalid or missing query parameters
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only users can view availability
 */
router.get(
  "/available",
  verifyJWT,
  authorizeRoles("user"),
  getAvailableSlots
);

export default router;
