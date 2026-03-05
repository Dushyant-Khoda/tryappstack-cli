/**
 * Centralized response messages for all API routes.
 *
 * Every message that users see from the API is defined here. Controllers and
 * services use these constants instead of writing messages directly in the code.
 * This helps keep the wording consistent across the whole application.
 */

const Messages = {
    // ── Auth ─────────────────────────────────────────────────────
    AUTH: {
        REGISTER_SUCCESS: "User registered successfully",
        LOGIN_SUCCESS: "Logged in successfully",
        LOGOUT_SUCCESS: "Logged out successfully",
        USER_EXISTS: "User with this email already exists",
        USER_NOT_FOUND: "User not found",
        INVALID_CREDENTIALS: "Invalid credentials",
        REGISTER_FAILED: "Registration failed",
        LOGIN_FAILED: "Login failed",
        LOGOUT_FAILED: "Logout failed",
    },

    // ── OTP ──────────────────────────────────────────────────────
    OTP: {
        SENT_EMAIL: "OTP has been sent to your email",
        SENT_PHONE: "OTP sent successfully",
        VERIFIED: "OTP verified successfully",
        SEND_FAILED: "Failed to send OTP",
        VERIFY_FAILED: "OTP verification failed",
        NO_ACTIVE: "No active OTP found. Please request a new OTP.",
        LOCKED: "Too many invalid attempts. OTP is locked. Request a new OTP.",
        EXPIRED: "OTP expired. Please request a new OTP.",
        INVALID: "Invalid OTP provided.",
        NO_ACTIVE_PHONE: "No active OTP found for this phone. Please request a new OTP.",
    },

    // ── Password Reset ───────────────────────────────────────────
    PASSWORD: {
        RESET_SUCCESS: "Password reset successfully",
        RESET_FAILED: "Password reset failed",
        INVALID_TOKEN: "Invalid or expired reset token",
    },

    // ── Validation ───────────────────────────────────────────────
    VALIDATION: {
        FAILED: "Validation failed",
    },

    // ── Generic ──────────────────────────────────────────────────
    GENERIC: {
        FETCH_SUCCESS: "Record fetched successfully",
        CREATE_SUCCESS: "Record created successfully",
        UPDATE_SUCCESS: "Record updated successfully",
        DELETE_SUCCESS: "Record removed successfully",
        SERVER_ERROR: "Internal server error",
        NOT_FOUND: "Resource not found",
        UNAUTHORIZED: "Authentication required",
        FORBIDDEN: "You do not have permission to perform this action",
    },
};

export default Messages;
