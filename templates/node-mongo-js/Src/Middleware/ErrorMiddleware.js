import { DEBUG_MODE } from "../../Config";
import { ValidationError } from "joi";
import consola from "consola";
import { CustomErrorHandler, Log } from "../Utils";

const ErrorMiddleware = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal Server Error";

    // ── Persist error to log file ───────────────────────────
    Log.error("ErrorMiddleware", {
        method: req.method,
        url: req.originalUrl,
        statusCode: error.statusCode,
        message: error.message,
        stack: DEBUG_MODE ? error.stack : undefined,
    });

    // Wrong Mongodb ID Error
    if (error.name === "CastError") {
        const message = `Resource not found Invalid: ${error.path}`;
        error = new CustomErrorHandler(message, 400);
    }

    // Mongoose duplicate error
    if (error.code === 11000) {
        const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
        error = new CustomErrorHandler(message, 400);
    }

    //Wrong JWT Token
    if (error.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, try again`;
        error = new CustomErrorHandler(message, 400);
    }

    // JWT Expire Token
    if (error.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, try again`;
        error = new CustomErrorHandler(message, 400);
    }
    // Joi Error
    if (error instanceof ValidationError) {
        error.statusCode = 422;
        error = new CustomErrorHandler(error.message, error.statusCode);
    }
    res.status(error.statusCode).json({
        success: false,
        result: [],
        message: DEBUG_MODE ? error.message : "😞 Internal Server Error",
    });
};

export default ErrorMiddleware;
