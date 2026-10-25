import { Router } from "express";

import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlyExpenseSummary,
  getCategoryExpenseSummary,
  checkMonthlyBudget
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

// Monthly Summary
router.get("/summary/monthly", getMonthlyExpenseSummary);

// Category wise Summary
router.get("/summary/category", getCategoryExpenseSummary);

router.post("/budget-check", checkMonthlyBudget);

export default router;
