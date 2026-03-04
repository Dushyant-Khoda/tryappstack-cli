import { COOKIE_EXPIRE } from "../../Config";

const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();
    const option = {
        expires: new Date(Date.now() + Number(COOKIE_EXPIRE) * 24 * 24 * 60 * 1000),
        httpOnly: true,
    };
    // Exclude the password field from the user object
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(statusCode)
        .cookie("token", token, option)
        .json({
            success: true,
            data: { user: userWithoutPassword, access_token: token },
            message,
        });
};

export default sendToken;
