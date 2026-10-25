import {
  createExpense as createExpenseService,
  getAllExpenses as getAllExpensesService,
  getExpenseById as getExpenseByIdService,
  updateExpense as updateExpenseService,
  deleteExpense as deleteExpenseService,
  getMonthlyExpenseSummary as getMonthlyExpenseSummaryService,
  getCategoryExpenseSummary as getCategoryExpenseSummaryService,
  checkMonthlyBudget as checkMonthlyBudgetService,
} from "../service/expense.service.js";

import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, date } = req.body;

  if (amount === undefined || amount === null || amount === "") {
    throw new ApiError(400, "Expense amount is required");
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new ApiError(400, "Expense amount must be a number greater than zero");
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    throw new ApiError(400, "Expense category is required");
  }

  if (date !== undefined && Number.isNaN(Date.parse(date))) {
    throw new ApiError(400, "Invalid expense date");
  }

  const expense = await createExpenseService({
    amount,
    category: category.trim(),
    ...(date !== undefined && { date }),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, expense, "Expense created successfully"));
});


export const getAllExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate } = req.query;

  if (startDate && Number.isNaN(Date.parse(startDate))) {
    throw new ApiError(400, "Invalid start date");
  }

  if (endDate && Number.isNaN(Date.parse(endDate))) {
    throw new ApiError(400, "Invalid end date");
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    throw new ApiError(400, "Start date cannot be after end date");
  }

  const expenses = await getAllExpensesService({
    category,
    startDate,
    endDate,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, expenses, "Expenses fetched successfully"));
});


export const getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid expense ID");
  }

  const expense = await getExpenseByIdService(id);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, expense, "Expense fetched successfully"));
});

export const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, category, date } = req.body;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid expense ID");
  }

  const updates = {};

  if (amount !== undefined) {
    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new ApiError(400, "Expense amount must be a number greater than zero");
    }

    updates.amount = amount;
  }

  if (category !== undefined) {
    if (typeof category !== "string" || !category.trim()) {
      throw new ApiError(400, "Expense category cannot be empty");
    }

    updates.category = category.trim();
  }

  if (date !== undefined) {
    if (Number.isNaN(Date.parse(date))) {
      throw new ApiError(400, "Invalid expense date");
    }

    updates.date = date;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "Provide at least one field to update");
  }

  const expense = await updateExpenseService(id, updates);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, expense, "Expense updated successfully"));
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid expense ID");
  }

  const expense = await deleteExpenseService(id);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, expense, "Expense deleted successfully"));
});


export const getMonthlyExpenseSummary = asyncHandler(
  async (req, res) => {
    const summary = await getMonthlyExpenseSummaryService();

    return res.status(200).json(
      new ApiResponse(
        200,
        summary,
        "Monthly expense summary fetched successfully"
      )
    );
  }
);

export const getCategoryExpenseSummary = asyncHandler(
  async (req, res) => {
    const summary = await getCategoryExpenseSummaryService();

    return res.status(200).json(
      new ApiResponse(
        200,
        summary,
        "Category expense summary fetched successfully"
      )
    );
  }
);


export const checkMonthlyBudget = asyncHandler(async (req, res) => {
  const { monthlyBudget, year, month } = req.body;

  if (
    typeof monthlyBudget !== "number" ||
    !Number.isFinite(monthlyBudget) ||
    monthlyBudget <= 0
  ) {
    throw new ApiError(
      400,
      "Monthly budget must be a number greater than zero"
    );
  }

  const now = new Date();
  const selectedYear = year ?? now.getFullYear();
  const selectedMonth = month ?? now.getMonth() + 1;

  if (
    !Number.isInteger(selectedYear) ||
    selectedYear < 1 ||
    selectedYear > 9999
  ) {
    throw new ApiError(400, "Invalid year");
  }

  if (
    !Number.isInteger(selectedMonth) ||
    selectedMonth < 1 ||
    selectedMonth > 12
  ) {
    throw new ApiError(400, "Month must be between 1 and 12");
  }

  const result = await checkMonthlyBudgetService({
    monthlyBudget,
    year: selectedYear,
    month: selectedMonth,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Budget check completed"));
});
