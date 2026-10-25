import {Expense} from "../model/expense.model.js";
import{ ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

// Create a new expense
const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, date } = req.body;

  if (amount === undefined || !category?.trim()) {
    throw new ApiError(400, "Amount and category are required");
  }

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new ApiError(400, "Amount must be a number greater than zero");
  }

  if (date !== undefined && Number.isNaN(Date.parse(date))) {
    throw new ApiError(400, "Please provide a valid date");
  }

  const expense = await Expense.create({
    amount,
    category,
    ...(date !== undefined && { date }),
  });

  return res.status(201).json(
    new ApiResponse(201, expense, "Expense created successfully")
  );
});

// Get all expenses
const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });

  return res.status(200).json(
    new ApiResponse(200, expenses, "Expenses fetched successfully")
  );
});

// Get a single expense by ID
const getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new ApiError(400, "Invalid expense ID");
  }

  const expense = await Expense.findById(id);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return res.status(200).json(
    new ApiResponse(200, expense, "Expense fetched successfully")
  );
});

// Update an existing expense
const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, category, date } = req.body;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new ApiError(400, "Invalid expense ID");
  }

  if (amount === undefined && category === undefined && date === undefined) {
    throw new ApiError(400, "Provide at least one field to update");
  }

  const updates = {};

  if (amount !== undefined) {
    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new ApiError(400, "Amount must be a number greater than zero");
    }

    updates.amount = amount;
  }

  if (category !== undefined) {
    if (typeof category !== "string" || !category.trim()) {
      throw new ApiError(400, "Category must be a non-empty string");
    }

    updates.category = category.trim();
  }

  if (date !== undefined) {
    if (Number.isNaN(Date.parse(date))) {
      throw new ApiError(400, "Please provide a valid date");
    }

    updates.date = date;
  }

  const expense = await Expense.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return res.status(200).json(
    new ApiResponse(200, expense, "Expense updated successfully")
  );
});

// Delete an expense
const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new ApiError(400, "Invalid expense ID");
  }

  const expense = await Expense.findByIdAndDelete(id);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return res.status(200).json(
    new ApiResponse(200, expense, "Expense deleted successfully")
  );
});

export {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
