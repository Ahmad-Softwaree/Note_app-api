import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth_routes.js";
import cors from "cors";
import notesRouter from "./routes/notes_routes.js";
import supabaseRouter from "./routes/supabase_routes.js";
import passportRouter from "./routes/passport_routes.js";
import { googlePassport } from "./config/passport.js";
import session from "express-session";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
dotenv.config();
const { CLIENT_URL, GOOGLE_URL, SESSION_SECRET, JWT_SECRET } = process.env;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [CLIENT_URL, GOOGLE_URL],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(cookieParser(SESSION_SECRET));

app.use(googlePassport.initialize());
app.use(googlePassport.session());

googlePassport.serializeUser((id, done) => {
  done(null, id);
});

googlePassport.deserializeUser((id, done) => {
  console.log(`deserialize`, id);
  done(null, id);
});

app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);
app.use("/api/supabase", supabaseRouter);
app.use("/api/passport", passportRouter);

app.listen(process.env.NODE_PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
