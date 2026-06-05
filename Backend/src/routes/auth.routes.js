import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import authController from "../controllers/auth.controller.js";
import passport from "passport";



const router = Router();



router.post("/register", validateRegisterUser, authController.register);


router.post("/login", validateLoginUser, authController.login);


// Google OAuth routes
// api/auth/google
router.get("/google", 
    passport.authenticate("google", { scope: ["profile", "email"] }));


router.get("/google/callback", 
    passport.authenticate("google",{session: false, failureRedirect: "/login"}),
    authController.googleCallback);


export default router;

