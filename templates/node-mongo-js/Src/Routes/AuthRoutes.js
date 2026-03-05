import express from "express";
import { AuthController } from "../Controller/index.js";
import { AuthenticationMiddleware } from "../Middleware/index.js";
import ValidateRequest from "../Middleware/ValidateRequest.js";
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyOtpSchema,
    resetPasswordSchema
} from "../Validations/AuthValidation.js";

const router = express.Router();

router.post("/register", ValidateRequest(registerSchema, "body"), AuthController.registerWorker);
router.post("/login", ValidateRequest(loginSchema, "body"), AuthController.loginWorker);
router.post("/forgot-password", ValidateRequest(forgotPasswordSchema, "body"), AuthController.forgotPasswordWorker);
router.post("/verify-otp", ValidateRequest(verifyOtpSchema, "body"), AuthController.verifyOtpWorker);
router.post("/reset-password", ValidateRequest(resetPasswordSchema, "body"), AuthController.resetPasswordWorker);
router.post("/logout", AuthenticationMiddleware, AuthController.logoutWorker);

export default router;
