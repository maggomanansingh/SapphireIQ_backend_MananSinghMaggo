import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createNoteValidator,
  updateNoteValidator,
  getNotesValidator,
} from "../validators/note.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post(
  "/",
  createNoteValidator,
  validate,
  createNote
);

router.get("/",getNotesValidator,validate, getNotes);

router.get("/:id", getNoteById);

router.put(
  "/:id",
  updateNoteValidator,
  validate,
  updateNote
);

router.delete("/:id", deleteNote);

export default router;