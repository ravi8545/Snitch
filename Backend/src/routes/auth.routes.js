import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import authController from "../controllers/auth.controller.js";
import passport from "passport";
import {config} from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";


const router = Router();



router.post("/register", validateRegisterUser, authController.register);


router.post("/login", validateLoginUser, authController.login);


// Google OAuth routes
// api/auth/google
router.get("/google", 
    passport.authenticate("google", { scope: ["profile", "email"] }));


router.get("/google/callback", 
    passport.authenticate("google",{session: false, failureRedirect: config.Node_ENV === "development" ? "http://localhost:5173/login" : "/login"}),
    authController.googleCallback
);

router.get("/me", authenticateUser, authController.getMe);


export default router;

