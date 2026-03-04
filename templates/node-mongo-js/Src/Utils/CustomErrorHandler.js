import consola from "consola";

class CustomErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    // Static method to handle resource already exists error
    static resourceAlreadyExists(message = "Record already exists") {
        consola.error(message);
        return new CustomErrorHandler(message, 409);
    }

    // Static method to handle resource not found error
    static resourceNotFound(message = "Record not found") {
        consola.error(message);
        return new CustomErrorHandler(message, 404);
    }

    // Static method to handle wrong credentials error
    static invalidCredentials(message = "Invalid username or password") {
        consola.error(message);
        return new CustomErrorHandler(message, 401);
    }

    // Static method to handle unauthorized access error
    static unauthorizedAccess(message = "Unauthorized access") {
        consola.error(message);
        return new CustomErrorHandler(message, 401);
    }

    // Static method to handle internal server error
    static internalServerError(message = "Internal server error") {
        consola.error(message);
        return new CustomErrorHandler(message, 500);
    }

    // Static method to handle forbidden access error
    static forbiddenAccess(message = "Forbidden access") {
        consola.error(message);
        return new CustomErrorHandler(message, 403);
    }

    // Static method to handle bad request error
    static badRequest(message = "Bad request") {
        consola.error(message);
        return new CustomErrorHandler(message, 400);
    }

    // Static method to handle conflict error
    static conflict(message = "Conflict") {
        consola.error(message);
        return new CustomErrorHandler(message, 409);
    }

    // Static method to handle service unavailable error
    static serviceUnavailable(message = "Service unavailable") {
        consola.error(message);
        return new CustomErrorHandler(message, 503);
    }
}

export default CustomErrorHandler;
