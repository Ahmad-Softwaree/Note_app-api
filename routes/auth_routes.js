import express from "express";
import { getUserAuth, login, register, updateUser } from "../controllers/auth_controller.js";
import userAuth from "../middlewares/user_auth_middleware.js";
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/auth_token", userAuth, getUserAuth);
authRouter.put("/", userAuth, updateUser);
export default authRouter;
