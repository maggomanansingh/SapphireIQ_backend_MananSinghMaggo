
import express from "express";

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form bodies
app.use(express.urlencoded({ extended: true }));

// Health-check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API is running",
  });
});

// Expense routes will be registered here.
import expenseRouter from "./route/expense.route.js";
app.use("/api/expenses", expenseRouter);




// Handle unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error middleware will be registered here.

export default app;
