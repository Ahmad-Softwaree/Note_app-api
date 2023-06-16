import { Strategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { sqlQuery } from "../queries/query.js";
import db from "../db.js";
import passport from "passport";
dotenv.config();
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, SERVER_URL } = process.env;

export const googlePassport = passport.use(
  new Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/${GOOGLE_CALLBACK_URL}`,
    },
    function (accessToken, refreshToken, profile, cb) {
      const { query, values } = sqlQuery(`SELECT * FROM users WHERE googleId = ?`, { googleId: profile.id });
      db.query(query, values, (error, result) => {
        if (error) cb(error);
        if (result.length > 0) {
          return cb(error, result[0].id);
        } else {
          var { query, values } = sqlQuery(`INSERT INTO users (googleId,name,image) VALUES (?,?,?)`, {
            googleId: profile.id,
            name: profile.displayName,
            image: profile.photos[0].value,
          });
          db.query(query, values, (error, result) => {
            return cb(error, result[0].id);
          });
        }
      });
    }
  )
);
