import express from "express";
import consola from "consola";
import http from "http";
import { PORT } from "./Config";
import { ServerLoader as server } from "./Src/Loaders";
// import { SocketService } from "./Src/Services";
import { ErrorMiddleware } from "./Src/Middleware";

const app = express();
const appServer = http.createServer(app);
server.config(app);

// * Initialize Socket Service to handle real-time communication between clients and server.
// SocketService.init(appServer);

// * Apply error handling middleware to catch and respond to errors.
app.use(ErrorMiddleware);

// * Handle uncaught exceptions to prevent the server from crashing.
process.on("uncaughtException", (error) => {
    consola.error(`Shutting down the server due to uncaught exception:${error.message}`);
    process.exit(1);
});

const initServer = appServer.listen(PORT, () => {
    console.log("\n\n");
    consola.success("Express Server Connected Successfully at", PORT);
});

// * unhandled promise rejection: it occur when we are put incorrect mongodb string in short it accept all mongodb connection errors
// * when we are handling this error we dont need to put catch block in database connection file

process.on("unhandledRejection", (error) => {
    consola.error(
        `Shutting down the server due to unhandled promise rejection  : ${error.message}`
    );
    initServer.close(() => {
        process.exit(1);
    });
});

process.emitWarning = (warning, ...args) => {
    if (warning && typeof warning.includes === "function") {
        if (warning.includes("AWS SDK for JavaScript (v2) will enter maintenance mode")) {
            return;
        }
    }
    console.warn(warning, ...args);
};
``;
