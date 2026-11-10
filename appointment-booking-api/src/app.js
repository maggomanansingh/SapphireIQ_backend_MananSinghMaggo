import express from "express";
import {ApiResponse} from "./utils/ApiResponse.js";

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

// import slotRouter from "./route/slot.route.js";
// app.use("/api/slots", slotRouter);

// import bookingRouter from "./route/booking.route.js";
// app.use("/api/bookings", bookingRouter);

// Temporary 404 handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

export default app;
