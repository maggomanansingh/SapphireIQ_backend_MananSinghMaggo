import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },

    category: {
      type: String,
      required: [true, "Expense category is required"],
      trim: true,
    },

    date: {
      type: Date,
      required: [true, "Expense date is required"],
    },

    description: {
      type: String,
      trim: true,
    },
},{timestamps:true})

export const Expense  = mongoose.model("Expense",expenseSchema)