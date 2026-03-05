import request from "supertest";
import express from "express";
import HealthRoutes from "../Src/Routes/HealthRoutes";

/**
 * Health endpoint tests.
 * These tests exercise the /health liveness route without requiring a database.
 */
describe("GET /health", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use("/health", HealthRoutes);
    });

    it("should return 200 with status ok", async () => {
        const res = await request(app).get("/health");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("status", "ok");
        expect(res.body).toHaveProperty("uptime");
        expect(res.body).toHaveProperty("timestamp");
        expect(res.body).toHaveProperty("environment");
    });

    it("should return a valid ISO timestamp", async () => {
        const res = await request(app).get("/health");

        const timestamp = new Date(res.body.timestamp);
        expect(timestamp.toISOString()).toBe(res.body.timestamp);
    });

    it("should return uptime as a number", async () => {
        const res = await request(app).get("/health");

        expect(typeof res.body.uptime).toBe("number");
        expect(res.body.uptime).toBeGreaterThan(0);
    });
});
