import express from "express";
import { OtpController } from "../Controller/index.js";
import ValidateRequest from "../Middleware/ValidateRequest.js";
import { sendOtpSchema, verifyOtpSchema } from "../Validations/OtpValidation.js";

const router = express.Router();

router.post("/send", ValidateRequest(sendOtpSchema, "body"), OtpController.sendOTP);
router.post("/verify", ValidateRequest(verifyOtpSchema, "body"), OtpController.verifyOTP);

export default router;
