import express from "express";
import { getUserAuth, loginRouter, registerRouter } from "../controllers/auth_controller.js";
import userAuth from "../middlewares/user_auth_middleware.js";
const authRouter = express.Router();

authRouter.post("/register", registerRouter);
authRouter.post("/login", loginRouter);
authRouter.get("/auth_token", userAuth, getUserAuth);
export default authRouter;
