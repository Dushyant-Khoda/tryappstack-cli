// Src/Services/OTPService.js
import crypto from "crypto";
import OtpModel from "../Models/OtpModel.js";
// import { OTP_EXPIRE_MINUTES = 5, OTP_MAX_ATTEMPTS = 5 } from "../../Config";

/**
 * OTP Service
 *
 * Responsibilities:
 * - generate OTP (numeric), hash it, save to OtpModel with expiry
 * - verify OTP (compare hash), increment attempts, lock after limit
 *
 * Notes:
 * - stores hashed OTP in DB (sha256)
 * - expire_at uses OTP_EXPIRE_MINUTES (default 5)
 */

const DEFAULT_EXPIRE_MINUTES = 5;
const MAX_ATTEMPTS = 5;

function generateNumericOTP(digits = 6) {
    const min = 10 ** (digits - 1);
    const max = 10 ** digits - 1;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function hashOtp(otp) {
    return crypto.createHash("sha256").update(otp).digest("hex");
}

const OTPService = {
    /**
     * generateAndSave(email, options)
     * - generates OTP, stores hashed value, returns plain otp to caller (caller must send email)
     */
    async generateAndSave(email, { digits = 6, expireMinutes = DEFAULT_EXPIRE_MINUTES } = {}) {
        if (!email) throw new Error("Email is required");

        const otpPlain = generateNumericOTP(digits);
        const otpHash = hashOtp(otpPlain);
        const expireAt = new Date(Date.now() + expireMinutes * 60 * 1000);

        // Soft-delete older OTPs for same email (mark inactive)
        await OtpModel.updateMany(
            { email: email.toLowerCase(), isActive: true },
            { $set: { isActive: false, is_active: false, deleted_at: new Date() } }
        );

        const otpDoc = await OtpModel.create({
            email: email.toLowerCase(),
            otp: otpHash,
            expire_at: expireAt,
            attempt_count: 0,
            is_locked: false,
            isActive: true,
            is_active: true,
            meta: { digits },
        });

        return { otpPlain, otpDoc }; // caller should send otpPlain to user via email
    },

    /**
     * verify(email, otpPlain)
     * - verifies OTP; returns object { ok: boolean, reason?, otpDoc? }
     * - increments attempt_count; locks if attempts exceed MAX
     */
    async verify(email, otpPlain) {
        if (!email || !otpPlain) return { ok: false, reason: "email_and_otp_required" };

        const otpRecord = await OtpModel.findOne({
            email: email.toLowerCase(),
            isActive: true,
        }).select("+otp +attempt_count +is_locked +expire_at");

        if (!otpRecord) return { ok: false, reason: "no_active_otp" };

        if (otpRecord.is_locked) return { ok: false, reason: "otp_locked" };

        if (otpRecord.expire_at && new Date() > otpRecord.expire_at) {
            // expire and mark inactive
            otpRecord.isActive = false;
            otpRecord.is_active = false;
            otpRecord.deleted_at = new Date();
            await otpRecord.save();
            return { ok: false, reason: "otp_expired" };
        }

        const incomingHash = hashOtp(String(otpPlain).trim());
        const matched = incomingHash === otpRecord.otp;

        if (matched) {
            // successful verification -> mark inactive
            otpRecord.isActive = false;
            otpRecord.is_active = false;
            otpRecord.deleted_at = new Date();
            await otpRecord.save();
            return { ok: true, otpDoc: otpRecord };
        }

        // failed attempt
        otpRecord.attempt_count = (otpRecord.attempt_count || 0) + 1;
        otpRecord.last_attempt_at = new Date();

        if (otpRecord.attempt_count >= MAX_ATTEMPTS) {
            otpRecord.is_locked = true;
        }

        await otpRecord.save();

        const reason = otpRecord.is_locked ? "otp_locked" : "invalid_otp";
        return { ok: false, reason };
    },

    /**
     * invalidate(email)
     * - manually invalidate all active OTPs for email
     */
    async invalidate(email) {
        if (!email) return false;
        await OtpModel.updateMany(
            { email: email.toLowerCase(), isActive: true },
            { $set: { isActive: false, is_active: false, deleted_at: new Date() } }
        );
        return true;
    },
};

export default OTPService;
