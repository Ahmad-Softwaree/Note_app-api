import express from "express";
import userAuth from "../middlewares/user_auth_middleware.js";
import multer from "multer";
import { uploadImage } from "../controllers/supabase_controller.js";

const uploader = multer({ storage: multer.memoryStorage() });

const supabaseRouter = express.Router();

supabaseRouter.post("/upload", userAuth, uploader.single("image"), uploadImage);

export default supabaseRouter;
