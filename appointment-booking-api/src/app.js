import express from "express";
import {ApiResponse} from "./utils/ApiResponse.js";
import {errorMiddleware} from "./middleware/error.middleware.js";
import {ApiError} from "./utils/ApiError.js";
const app = express();

// Global middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Health check
app.get("/api/health", (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { status: "OK" }, "Server is running"));
});

// API routes will be registered here:
import authRouter from "./route/auth.route.js";
app.use("/api/auth", authRouter);

import slotRouter from "./route/slot.route.js";
app.use("/api/slots", slotRouter);

import bookingRouter from "./route/booking.route.js";
app.use("/api/bookings", bookingRouter);

// Handle undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorMiddleware);

export default app;
