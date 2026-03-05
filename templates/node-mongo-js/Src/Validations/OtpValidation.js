// Src/Validations/OtpValidation.js
import Joi from "joi";

/**
 * OTP Validation Schemas
 *
 * - sendOtpSchema: expects phone (string), optional channel (sms/email)
 * - verifyOtpSchema: expects phone and otp
 */

export const sendOtpSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^\+?\d{7,15}$/)
        .required()
        .messages({
            "string.empty": "Phone number is required",
            "string.pattern.base": "Phone number format is invalid"
        }),
    channel: Joi.string().valid("sms", "email").default("sms")
});

export const verifyOtpSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^\+?\d{7,15}$/)
        .required()
        .messages({
            "string.empty": "Phone number is required",
            "string.pattern.base": "Phone number format is invalid"
        }),
    otp: Joi.string().min(4).max(8).required().messages({
        "string.empty": "OTP is required",
        "string.min": "OTP is too short"
    })
});
