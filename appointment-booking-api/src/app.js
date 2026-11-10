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
// app.use("/api/auth", authRouter);
// app.use("/api/slots", slotRouter);
// app.use("/api/bookings", bookingRouter);

// Temporary 404 handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

export default app;
