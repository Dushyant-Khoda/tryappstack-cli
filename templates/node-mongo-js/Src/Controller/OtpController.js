// Src/Controller/OtpController.js
import { CustomErrorHandler, SuccessHandler } from "../Utils/index.js";
import OTPService from "../Services/OTPService.js";
import { Messages } from "../Constants/index.js";

/**
 * OtpController
 *
 * Integrates with:
 *  - OTPService (generateAndSave, verify, invalidate)
 *
 * Notes:
 *  - OTPService.generateAndSave returns { otpPlain, otpDoc }
 *  - Do NOT log otpPlain in production. Send otpPlain to user via SMS provider.
 *  - Replace the TODO block with your SMS/Notification adapter (Twilio, MSG91, etc.).
 */

const OtpController = {
    /* ----------------------------------------
     * Send OTP
     * body: { phone, channel }
     * ---------------------------------------- */
    async sendOTP(req, res, next) {
        try {
            const { phone } = req.body;

            // Generate and save OTP (hashed) in DB
            const { otpPlain } = await OTPService.generateAndSave(phone);

            // TODO: Send otpPlain via your SMS gateway / NotificationService.
            // Example (pseudo):
            // await NotificationService.sendSms(phone, `Your verification code is ${otpPlain}`);
            //
            // If you don't have a NotificationService, integrate Twilio/MSG91 here.

            // For safety: do not return otpPlain in production. For dev only, you may return it.
            const safeResponse = process.env.NODE_ENV === "development"
                ? { phone, debug_otp: otpPlain }
                : { phone };

            SuccessHandler(res, safeResponse, "post", Messages.OTP.SENT_PHONE);
        } catch (err) {
            next(new CustomErrorHandler(err.message || Messages.OTP.SEND_FAILED, 500));
        }
    },

    /* ----------------------------------------
     * Verify OTP
     * body: { phone, otp }
     * ---------------------------------------- */
    async verifyOTP(req, res, next) {
        try {
            const { phone, otp } = req.body;

            const result = await OTPService.verify(phone, otp);

            if (!result.ok) {
                // map reasons to user-friendly messages
                const reasonMap = {
                    no_active_otp: Messages.OTP.NO_ACTIVE_PHONE,
                    otp_locked: Messages.OTP.LOCKED,
                    otp_expired: Messages.OTP.EXPIRED,
                    invalid_otp: Messages.OTP.INVALID
                };
                const msg = reasonMap[result.reason] || Messages.OTP.VERIFY_FAILED;
                return next(new CustomErrorHandler(msg, 400));
            }

            SuccessHandler(res, { phone }, "post", Messages.OTP.VERIFIED);
        } catch (err) {
            next(new CustomErrorHandler(err.message || Messages.OTP.VERIFY_FAILED, 500));
        }
    }
};

export default OtpController;
