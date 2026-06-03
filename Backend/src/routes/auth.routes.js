import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import authController from "../controllers/auth.controller.js";

const router = Router();



router.post("/register", validateRegisterUser, authController.register);


router.post("/login", validateLoginUser, authController.login);

export default router;

