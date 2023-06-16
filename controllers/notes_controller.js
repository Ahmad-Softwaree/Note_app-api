import db from "../db.js";
import { sqlQuery } from "../queries/query.js";
import catchRequires from "../utils/catchRequires.js";

export const getUserNotes = async (req, res) => {
  try {
    const { query, values } = sqlQuery(`SELECT * FROM notes WHERE user_id=?`, { user_id: req.user });
    db.query(query, values, async (error, result) => {
      if (error) return res.status(400).json({ error });
      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createNote = async (req, res) => {
  let errors = catchRequires({ title: req.body.title, description: req.body.description });
  if (errors.length > 0) return res.status(400).json(errors);
  try {
    let { query, values } = sqlQuery(`INSERT INTO notes (user_id,title,description) VALUES (?,?,?)`, {
      user_id: req.user,
      ...req.body,
    });
    db.query(query, values, (error, result) => {
      if (error) return res.status(400).json({ error });
      var { query, values } = sqlQuery(`SELECT * FROM notes WHERE id = ?`, { id: result.insertId });
      db.query(query, values, (secondErr, secondRes) => {
        if (secondErr) return res.status(400).json({ error });
        return res.status(200).json(secondRes[0]);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  let errors = catchRequires({ title: req.body.title, description: req.body.description });
  if (errors.length > 0) return res.status(400).json(errors);
  try {
    let { query, values } = sqlQuery(`UPDATE notes SET user_id = ?, title = ?, description = ? WHERE id = ?`, {
      user_id: req.user,
      ...req.body,
      id: req.params.note_id,
    });
    db.query(query, values, (error, result) => {
      if (error) return res.status(400).json({ error });
      var { query, values } = sqlQuery(`SELECT * FROM notes WHERE id = ?`, { id: req.params.note_id });
      db.query(query, values, (secondErr, secondRes) => {
        if (secondErr) return res.status(400).json({ error: secondErr });
        return res.status(200).json(secondRes[0]);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { query, values } = sqlQuery(`DELETE FROM notes WHERE id = ?`, { id: req.params.note_id });
    db.query(query, values, (error, result) => {
      if (error) return res.status(400).json({ error });
      return res.status(200).json(req.params.note_id);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
