import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * @route   GET /health
 * @desc    Liveness check – confirms the server process is running
 */
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

/**
 * @route   GET /health/ready
 * @desc    Readiness check – confirms the server can serve traffic (DB connected)
 */
router.get("/ready", (req, res) => {
    const dbState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const isReady = dbState === 1;

    res.status(isReady ? 200 : 503).json({
        success: isReady,
        status: isReady ? "ready" : "unavailable",
        database: isReady ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
    });
});

export default router;
