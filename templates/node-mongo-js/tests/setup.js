import express from "express";
import { ServerLoader } from "../Src/Loaders";
import { ErrorMiddleware } from "../Src/Middleware";

/**
 * Create a fresh Express app instance for testing.
 * This avoids starting the HTTP server or connecting to a real database.
 */
const createTestApp = () => {
    const app = express();

    // Apply the same middleware & route configuration as ServerLoader,
    // but skip the Database.init() call by configuring manually.
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));

    return app;
};

export { createTestApp };
