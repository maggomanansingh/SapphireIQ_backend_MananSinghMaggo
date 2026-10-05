import { body, query } from "express-validator";

export const createNoteValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 5000 })
    .withMessage("Content cannot exceed 5000 characters"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),
];

export const updateNoteValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ max: 5000 })
    .withMessage("Content cannot exceed 5000 characters"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),
    
  body().custom((value) => {
    const hasField =
      value.title !== undefined ||
      value.content !== undefined ||
      value.completed !== undefined;

    if (!hasField) {
      throw new Error("At least one field is required for update");
    }

    return true;
  }),
];

export const getNotesValidator = [
  query("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be true or false"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sort")
    .optional()
    .isIn([
      "createdAt",
      "-createdAt",
      "title",
      "-title",
      "completed",
      "-completed",
    ])
    .withMessage("Invalid sort option"),
];