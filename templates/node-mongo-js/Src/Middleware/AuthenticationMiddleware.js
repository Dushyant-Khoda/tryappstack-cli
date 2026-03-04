import { JWT_SECRET } from "../../Config";
import { UserModel } from "../Models";
import jwt from "jsonwebtoken";
import { CustomErrorHandler } from "../Utils";

const AuthenticationMiddleware = async (req, res, next) => {
    try {
        let authToken = req.headers.authorization || req.cookies.token;

        if (!authToken) {
            return next(new CustomErrorHandler("Please Login to access this resources", 401));
        }
        let token = authToken;
        if (req.headers.authorization) {
            token = authToken.split(" ")[1];
        }
        if (token === "undefined") {
            return next(new CustomErrorHandler("Please Login to access this resources", 401));
        }
        const decodeData = jwt.verify(token, JWT_SECRET);

        let userRecord = await UserModel.findById(decodeData.id);
        if (userRecord.is_active == false) {
            return next(
                new CustomErrorHandler("User is not allowed to access this resources", 400)
            );
        } else {
            req.user = userRecord;
            next();
        }
    } catch (error) {
        return next(new CustomErrorHandler(error, 401));
    }
};

export default AuthenticationMiddleware;
