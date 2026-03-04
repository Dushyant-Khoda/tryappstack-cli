import { CustomErrorHandler } from "../Utils/index.js";

/**
 * ValidateRequest(schema, location)
 *
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {"body"|"query"|"params"} location - where to validate (default: body)
 *
 * Usage:
 *   router.post("/create", ValidateRequest(mySchema, "body"), Controller.create)
 *   router.get("/list", ValidateRequest(mySchema, "query"), Controller.list)
 */
export default function ValidateRequest(schema, location = "body") {
    return (req, res, next) => {
        try {
            const target =
                location === "query" ? req.query : location === "params" ? req.params : req.body;

            const options = {
                abortEarly: false, // collect all errors
                allowUnknown: true, // allow extra fields
                stripUnknown: false, // keep unknown fields, optional
            };

            const { error, value } = schema.validate(target, options);

            if (error) {
                // Format error message list
                const message = error.details.map((d) => d.message.replace(/"/g, "")).join(", ");
                return next(new CustomErrorHandler(message, 400));
            }

            // Replace validated data (optional but recommended)
            if (location === "query") req.query = value;
            else if (location === "params") req.params = value;
            else req.body = value;

            return next();
        } catch (err) {
            return next(new CustomErrorHandler(err.message || "Validation failed", 500));
        }
    };
}
