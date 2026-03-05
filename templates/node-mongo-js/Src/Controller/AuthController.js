// Src/Controller/AuthController.js
import { CustomErrorHandler, SendToken, SuccessHandler } from "../Utils/index.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserModel } from "../Models/index.js";
import { EmailService } from "../Services/index.js";
import { Messages } from "../Constants/index.js";
import OTPService from "../Services/OTPService.js";

const AuthController = {
    /**
     * Registers a new user in the system.
     */
    async registerWorker(req, res, next) {
        const { name, email, password } = req.body;

        try {
            // Check if a user with the given email already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return next(
                    new CustomErrorHandler(Messages.AUTH.USER_EXISTS, 409)
                );
            }

            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create and save the new user record
            const user = new UserModel({
                name,
                email,
                password: hashedPassword
            });
            await user.save();

            SendToken(user, 201, res, Messages.AUTH.REGISTER_SUCCESS);
        } catch (err) {
            next(new CustomErrorHandler(err.message || Messages.AUTH.REGISTER_FAILED, 500));
        }
    },

    /**
     * Logs in a user with email and password.
     */
    async loginWorker(req, res, next) {
        const { email, password } = req.body;

        try {
            // Check if the user exists
            const user = await UserModel.findOne({
                email,
                isActive: true
            }).select("+password");

            if (!user) {
                return next(new CustomErrorHandler(Messages.AUTH.USER_NOT_FOUND, 404));
            }

            // Validate password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return next(new CustomErrorHandler(Messages.AUTH.INVALID_CREDENTIALS, 401));
            }

            SendToken(user, 200, res, Messages.AUTH.LOGIN_SUCCESS);
        } catch (err) {
            next(new CustomErrorHandler(err.message || Messages.AUTH.LOGIN_FAILED, 500));
        }
    },

    /**
     * Handles forgot password requests using OTP.
     * Sends OTP to user's email for password reset.
     */
    async forgotPasswordWorker(req, res, next) {
        const { email } = req.body;

        try {
            // Check if the user exists
            const user = await UserModel.findOne({ email: email.toLowerCase(), isActive: true });
            if (!user) {
                return next(new CustomErrorHandler(Messages.AUTH.USER_NOT_FOUND, 404));
            }

            // Generate and save OTP
            const { otpPlain } = await OTPService.generateAndSave(email);

            // Send OTP via email
            const emailMessage = `Your OTP for password reset is: ${otpPlain}\n\nThis OTP is valid for 5 minutes.\n\nIf you did not request this, please ignore this email.`;

            await EmailService({
                to: email,
                subject: "Password Reset OTP",
                message: emailMessage
            });

            // Respond with a success message (don't send OTP in production response)
            const response = process.env.NODE_ENV === "development"
                ? { email, debug_otp: otpPlain }
                : { email };

            SuccessHandler(res, response, "post", Messages.OTP.SENT_EMAIL);
        } catch (err) {
            next(new CustomErrorHandler(err.message || Messages.OTP.SEND_FAILED, 500));
        }
    },

    /**
     * Verifies OTP for password reset.
     */
    async verifyOtpWorker(req, res, next) {
        const { email, otp } = req.body;

        try {
            // Check if the user exists
            const user = await UserModel.findOne({ email: email.toLowerCase(), isActive: true });
            if (!user) {
                return next(new CustomErrorHandler(Messages.AUTH.USER_NOT_FOUND, 404));
            }

            // Verify OTP
            const result = await OTPService.verify(email, otp);

            if (!result.ok) {
                const reasonMap = {
                    no_active_otp: Messages.OTP.NO_ACTIVE,
                    otp_locked: Messages.OTP.LOCKED,
                    otp_expired: Messages.OTP.EXPIRED,
                    invalid_otp: Messages.OTP.INVALID
                };
                const msg = reasonMap[result.reason] || Messages.OTP.VERIFY_FAILED;
                return next(new CustomErrorHandler(msg, 400));
            }

            // Generate a temporary token for password reset (valid for 15 minutes)
            const resetToken = user.getResetPasswordToken();
            await user.save({ validateBeforeSave: false });

            SuccessHandler(
                res,
                { reset_token: resetToken },
                "post",
                Messages.OTP.VERIFIED
            );
        } catch (err) {
            next(new CustomErrorHandler(err.message || Messages.OTP.VERIFY_FAILED, 500));
        }
    },

    /**
     * Resets the user's password based on the provided token and new password.
     * Validates the token and ensures it has not expired within the 15-minute window.
     */
    async resetPasswordWorker(req, res, next) {
        const { reset_token, new_password } = req.body;

        const hashedResetToken = crypto.createHash("sha256")
            .update(reset_token)
            .digest("hex");

        try {
            // Find the user by reset_password_token and ensure the token hasn't expired
            const user = await UserModel.findOne({
                resetPasswordToken: hashedResetToken,
                resetPasswordExpire: { $gt: Date.now() }
            });

            if (!user) {
                return next(
                    new CustomErrorHandler(Messages.PASSWORD.INVALID_TOKEN, 400)
                );
            }

            // Hash the new password
            user.password = await bcrypt.hash(new_password, 10);

            // Clear the reset token and expiry fields
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            SuccessHandler(res, { email: user.email }, "post", Messages.PASSWORD.RESET_SUCCESS);
        } catch (err) {
            next(new CustomErrorHandler(err.message || Messages.PASSWORD.RESET_FAILED, 500));
        }
    },

    /**
     * Logs out the user (clears token cookie).
     */
    async logoutWorker(req, res, next) {
        try {
            res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true
            });

            SuccessHandler(res, {}, "post", Messages.AUTH.LOGOUT_SUCCESS);
        } catch (err) {
            next(new CustomErrorHandler(err.message || Messages.AUTH.LOGOUT_FAILED, 500));
        }
    }
};

export default AuthController;
