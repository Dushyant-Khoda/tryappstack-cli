import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_EXPIRE, JWT_SECRET } from "../../Config";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true }, // Full name
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        phone: { type: String, required: true, trim: true, match: /^[0-9]{10}$/ },
        password: { type: String, select: false, required: true },
        role: {
            type: String,
            enum: ["super_admin", "team_member"],
            required: true,
            index: true,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,

        // Soft delete
        isActive: { type: Boolean, default: true, index: true },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Generating Password Reset Token
UserSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hashing and adding resetPasswordToken to UserSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    //* this will valid only for 15 min
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
    });
};

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
