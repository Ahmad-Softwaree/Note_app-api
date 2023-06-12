import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth_routes.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use("/api/auth", authRouter);

app.listen(process.env.NODE_PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
