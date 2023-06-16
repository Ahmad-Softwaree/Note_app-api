import catchRequires from "../utils/catchRequires.js";
import bcrypt from "bcrypt";
import db from "../db.js";
import { checkDuplicateUserByEmail } from "../queries/duplicate.js";
import { sqlQuery } from "../queries/query.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;

export const register = async (req, res) => {
  let errors = catchRequires(req.body);
  if (errors.length > 0) return res.status(400).json(errors);
  let salt = await bcrypt.genSalt(16);
  try {
    await checkDuplicateUserByEmail(req.body.email);
    if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, salt);
    let { query, values } = sqlQuery(`INSERT INTO users (name,email,password,image) VALUES (?,?,?,?)`, req.body);

    db.query(query, values, (error, result) => {
      if (error) return res.status(400).json({ error });
      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  let errors = catchRequires(req.body);
  if (errors.length > 0) return res.status(400).json(errors);
  try {
    let { query, values } = sqlQuery(`SELECT * FROM users WHERE email = ?`, req.body);
    db.query(query, values, async (error, result) => {
      if (error) return res.status(400).json({ error });
      if (result.length === 0) return res.status(400).json({ error: "Wrong Credentials" });
      let match = await bcrypt.compare(req.body.password, result[0].password);
      if (!match) return res.status(400).json({ error: "Wrong Credentials" });
      jwt.sign({ id: result[0].id }, JWT_SECRET, { expiresIn: "30d" }, (error, token) => {
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({
          user: result[0],
          token,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserAuth = async (req, res) => {
  let { user } = req;
  try {
    let { query, values } = sqlQuery(`SELECT * FROM users WHERE id = ?`, { user });
    db.query(query, values, async (error, result) => {
      if (error) return res.status(400).json({ error });
      if (result.length === 0) return res.status(400).json({ error: "user not found" });
      return res.status(200).json(result[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    let errors = catchRequires(req.body);
    if (errors.length > 0) return res.status(400).json(errors);
    const { query, values } = sqlQuery(`UPDATE users SET name = ?, image = ? WHERE id = ?`, { ...req.body, id: req.user });
    db.query(query, values, (error, result) => {
      if (error) return res.status(400).json({ error });
      var { query, values } = sqlQuery(`SELECT * FROM users WHERE id = ?`, { id: req.user });
      db.query(query, values, (secondErr, secondRes) => {
        if (secondErr) return res.status({ error: secondErr });
        return res.status(200).json(secondRes[0]);
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
