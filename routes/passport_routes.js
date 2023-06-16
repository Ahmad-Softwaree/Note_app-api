import express from "express";
import { getGoogleAuth, googleAuthFail, googleAuthSuccess, redirectGoogleAuth } from "../controllers/passport_controller.js";
import { googlePassport } from "../config/passport.js";
const passportRouter = express.Router();

passportRouter.get("/auth/google", getGoogleAuth);

passportRouter.get("/auth/google/callback", redirectGoogleAuth);

passportRouter.get("/auth/google/login/fail", googleAuthFail);
passportRouter.get("/auth/google/login/success", googlePassport.authenticate("google"), googleAuthSuccess);

export default passportRouter;
