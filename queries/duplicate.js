import db from "../db.js";
export const checkDuplicateUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";
    const values = [email];
    db.query(query, values, (error, results) => {
      if (error) reject(new Error(error.message));
      if (results.length > 0) reject(new Error("User Exist"));
      resolve();
    });
  });
};
