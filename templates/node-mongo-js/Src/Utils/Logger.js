import fs from "fs";
import path from "path";
import moment from "moment";
import consola from "consola";
import { LOG_STORAGE_STRATEGY } from "../../Config";

// Root directory for all logs
const logRootDirectory = path.join(__dirname, "../Uploads/Logs");

if (!fs.existsSync(logRootDirectory)) {
    fs.mkdirSync(logRootDirectory, { recursive: true });
}

// Normalise strategy: "month" or "date" (default month)
const normalisedStrategy = (LOG_STORAGE_STRATEGY || "month").toString().toLowerCase();

const loggerConfig = (loggerFor, record, fileName) => {
    const data = `================================

 * ${loggerFor} ${JSON.stringify(record, null, 4)}

`;

    const now = moment();
    const monthFolder = now.format("MMM-YYYY").toUpperCase(); // e.g. JAN-2026

    let targetDir = path.join(logRootDirectory, monthFolder);

    // If strategy is date-wise, create an extra folder for the day
    if (normalisedStrategy === "date") {
        const dayFolder = now.format("DD"); // 01, 02, ...
        targetDir = path.join(targetDir, dayFolder);
    }

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const safeFileName = String(fileName).toLowerCase();
    const filepath = path.join(targetDir, `${safeFileName}.log`);

    fs.appendFile(filepath, data, (err) => {
        if (err) {
            consola.warn("Failed to write log file", err);
        }
    });
};

const Log = {
    info(logFor, message) {
        consola.log("\n\n");
        consola.info(logFor, message);
        loggerConfig(logFor, message, "info");
    },
    success(logFor, message) {
        consola.log("\n\n");
        consola.success(logFor, message);
        loggerConfig(logFor, message, "success");
    },
    error(logFor, message) {
        consola.log("\n\n");
        consola.error(logFor, message);
        loggerConfig(logFor, message, "error");
    },
};

export default Log;
