import { CustomErrorHandler } from "../Utils";

const AuthorizationMiddleware = (...roles) => {
    return (req, res, next) => {
        // Support both old user_type and new role field
        const userRole = req.user.role || req.user.user_type;

        if (!userRole) {
            return next(new CustomErrorHandler("User role not found", 403));
        }

        if (!roles.includes(userRole)) {
            return next(
                new CustomErrorHandler(
                    `Role ${userRole} is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};

export default AuthorizationMiddleware;
