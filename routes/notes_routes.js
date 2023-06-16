import express from "express";
const notesRouter = express.Router();
import userAuth from "../middlewares/user_auth_middleware.js";
import { createNote, deleteNote, getUserNotes, updateNote } from "../controllers/notes_controller.js";

notesRouter.get(`/:user_id`, userAuth, getUserNotes);
notesRouter.post("/", userAuth, createNote);
notesRouter.delete("/:note_id", userAuth, deleteNote);
notesRouter.put("/:note_id", userAuth, updateNote);

export default notesRouter;
