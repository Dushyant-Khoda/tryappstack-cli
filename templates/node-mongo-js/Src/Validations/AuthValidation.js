// Src/Validations/AuthValidation.js
import Joi from "joi";

/**
 * Auth Validation Schemas
 *
 * Extracted from AuthController for consistency with OtpValidation.
 */

export const registerSchema = Joi.object({
    name: Joi.string().required().trim().messages({
        "string.empty": "Name is required"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email format is invalid"
    }),
    password: Joi.string().required().min(8).messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters"
    })
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email format is invalid"
    }),
    password: Joi.string().required().min(8).messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters"
    })
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email format is invalid"
    })
});

export const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email format is invalid"
    }),
    otp: Joi.string().required().messages({
        "string.empty": "OTP is required"
    })
});

export const resetPasswordSchema = Joi.object({
    reset_token: Joi.string().required().messages({
        "string.empty": "Reset token is required"
    }),
    new_password: Joi.string().min(8).required().messages({
        "string.empty": "New password is required",
        "string.min": "Password must be at least 8 characters"
    }),
    confirm_password: Joi.string().valid(Joi.ref("new_password")).required().messages({
        "any.only": "Passwords do not match",
        "string.empty": "Confirm password is required"
    })
});
