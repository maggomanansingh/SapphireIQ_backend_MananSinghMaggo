import { Router } from "express";

import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controller/expense.controller.js";

const router = Router();

// Create a new expense
router.post("/", createExpense);

// Get all expenses
router.get("/", getAllExpenses);

// Get a single expense by ID
router.get("/:id", getExpenseById);

// Update an expense
router.patch("/:id", updateExpense);

// Delete an expense
router.delete("/:id", deleteExpense);

export default router;
