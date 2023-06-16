import { googlePassport } from "../config/passport.js";
import dotenv from "dotenv";
import { sqlQuery } from "../queries/query.js";
import db from "../db.js";
dotenv.config();
const { GOOGLE_SUCCESS_URL, GOOGLE_FAIL_URL, CLIENT_URL, JWT_SECRET } = process.env;
import jwt from "jsonwebtoken";
export const googleAuthFail = (req, res) => {
  return res.status(401).json({ message: "Google Fail" });
};

export const googleAuthSuccess = (req, res) => {
  try {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      console.log(req.user);
    } else {
      console.log("No user");
    }
    let { query, values } = sqlQuery(`SELECT * FROM users WHERE googleId = ?`, { googleId: req.params.googleId });
    db.query(query, values, async (error, result) => {
      if (error) return res.status(400).json({ error });
      if (result.length === 0) return res.status(400).json({ error: "Wrong Credentials" });

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

export const getGoogleAuth = googlePassport.authenticate("google", { scope: ["profile"] });

export const redirectGoogleAuth = googlePassport.authenticate("google", {
  failureRedirect: `${CLIENT_URL}/${GOOGLE_FAIL_URL}`,
  successRedirect: `${CLIENT_URL}/${GOOGLE_SUCCESS_URL}`,
});
