import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import morgan from "./MorganConfig";
import Database from "./Database";
import Log from "../Utils/Logger";
import { UserRoutes, AuthRoutes, OtpRoutes, HealthRoutes } from "../Routes";
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } from "../../Config";

const ServerLoader = {
    async config(app) {
        Database.init();

        // ── Security headers ────────────────────────────────────
        app.use(helmet());

        // ── Rate limiting ───────────────────────────────────────
        const limiter = rateLimit({
            windowMs: parseInt(RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // default 15 min
            max: parseInt(RATE_LIMIT_MAX, 10) || 100, // default 100 requests per window
            standardHeaders: true,
            legacyHeaders: false,
            message: {
                success: false,
                message: "Too many requests, please try again later.",
            },
        });
        app.use(limiter);

        // ── CORS ────────────────────────────────────────────────
        app.use(
            cors({
                credentials: true,
            })
        );

        // ── Body parsers ────────────────────────────────────────
        app.use(express.json({ limit: "50mb" }));
        app.use(express.urlencoded({ limit: "50mb", extended: true }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());

        // ── Input sanitization ──────────────────────────────────
        app.use(mongoSanitize()); // Prevent NoSQL injection
        app.use(xss()); // Sanitize user input against XSS

        // ── Logging ─────────────────────────────────────────────
        morgan.init(app);

        // ── Routes ──────────────────────────────────────────────
        app.use("/health", HealthRoutes);
        app.use("/api/v1.0/user", UserRoutes);
        app.use("/api/v1.0/auth", AuthRoutes);
        app.use("/api/v1.0/otp", OtpRoutes);
    },
};

export default ServerLoader;
