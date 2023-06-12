import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "aghlqtyo2018#",
  database: "note_db",
  port: process.env.MY_SQL_PORT || 3306,
});

db.connect((err) => {
  if (err) console.error(err);
  else console.log("MySql database connected");
});

export default db;
