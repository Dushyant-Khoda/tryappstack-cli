import mongoose from "mongoose";

const { Schema } = mongoose;

const OtpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true
        },
        phone: {
            type: String,
            trim: true,
            index: true
        },

        otp: {
            type: String, // stored hashed (recommended)
            required: true,
            select: false
        },

        expireAt: {
            type: Date,
            required: true,
            index: true
        },

        // rate limiting fields
        attemptCount: { type: Number, default: 0 },
        lastAttemptAt: { type: Date, default: null },

        // Used to lock OTP after too many attempts
        isLocked: { type: Boolean, default: false },

        // meta
        meta: { type: Schema.Types.Mixed, default: {} },

        // Soft delete
        isActive: { type: Boolean, default: true, index: true },
        deletedAt: { type: Date, default: null }
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
    }
);

/* ----------------------------------
   Indexes
---------------------------------- */
OtpSchema.index({ email: 1, expireAt: 1 });
OtpSchema.index({ phone: 1, expireAt: 1 });

/* ----------------------------------
   Instance Methods
---------------------------------- */
OtpSchema.methods.setInactive = function () {
    this.isActive = false;
    this.deletedAt = new Date();
    return this.save();
};

const OtpModel = mongoose.model("Otp", OtpSchema);
export default OtpModel;
