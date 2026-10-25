import {Expense} from "../model/expense.model.js";

const createExpense = async (expenseData) => {
  return await Expense.create(expenseData);
};

const getAllExpenses = async (filters = {}) => {
  const query = {};

  if (filters.category) {
    query.category = {
      $regex: `^${filters.category}$`,
      $options: "i",
    };
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};

    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date.$lt = endDate;
    }
  }

  return await Expense.find(query).sort({ date: -1 });
};


const getExpenseById = async (id) => {
  return await Expense.findById(id);
};

const updateExpense = async (id, updates) => {
  return await Expense.findByIdAndUpdate(
    id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteExpense = async (id) => {
  return await Expense.findByIdAndDelete(id);
};


const getMonthlyExpenseSummary = async () => {
  return await Expense.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        totalExpenses: { $sum: "$amount" },
        expenseCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": -1,
        "_id.month": -1,
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalExpenses: 1,
        expenseCount: 1,
      },
    },
  ]);
};

const getCategoryExpenseSummary = async () => {
  return await Expense.aggregate([
    {
      $group: {
        _id: "$category",
        totalExpenses: { $sum: "$amount" },
        expenseCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalExpenses: -1 },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalExpenses: 1,
        expenseCount: 1,
      },
    },
  ]);
};


const checkMonthlyBudget = async ({ monthlyBudget, year, month }) => {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  const result = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$amount" },
      },
    },
  ]);

  const totalSpent = result[0]?.totalSpent ?? 0;
  const remaining = monthlyBudget - totalSpent;

  return {
    year,
    month,
    monthlyBudget,
    totalSpent,
    remaining: Math.max(remaining, 0),
    exceeded: totalSpent > monthlyBudget,
    message:
      totalSpent > monthlyBudget
        ? "Monthly budget exceeded"
        : "Monthly budget is within limit",
  };
};


export {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlyExpenseSummary,
  getCategoryExpenseSummary,
  checkMonthlyBudget
};
