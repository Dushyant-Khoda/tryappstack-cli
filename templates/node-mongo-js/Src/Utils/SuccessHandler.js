const CONSTANT = {
    GET_SUCCESS: "Record Fetched Successfully",
    POST_SUCCESS: "Record Added Successfully",
    PUT_SUCCESS: "Record modified Successfully",
    DELETE_SUCCESS: "Record Removed Successfully",
    LOGIN_SUCCESS: "Login Successfully",
    REGISTER_SUCCESS: "Record Registered Successfully",
};

let SuccessHandler = (res, data, method, message) => {
    switch (method.toLowerCase()) {
        case "get":
            return res.status(200).json({
                success: true,
                data,
                message: message ? message : CONSTANT.GET_SUCCESS,
            });

        case "post":
            return res.status(201).json({
                success: true,
                data,
                message: message ? message : CONSTANT.POST_SUCCESS,
            });

        case "put":
            return res.status(200).json({
                success: true,
                data,
                message: message ? message : CONSTANT.PUT_SUCCESS,
            });

        case "delete":
            return res.status(200).json({
                success: true,
                data,
                message: message ? message : CONSTANT.DELETE_SUCCESS,
            });

        case "login":
            return res.status(200).json({
                success: true,
                data,
                message: message ? message : CONSTANT.LOGIN_SUCCESS,
            });

        case "register":
            return res.status(HttpStatus.CREATED).json({
                success: true,
                data,
                message: message ? message : CONSTANT.REGISTER_SUCCESS,
            });

        default:
            return res.status(200).json({
                success: true,
                data,
                message: message ? message : "API Working Perfectly",
            });
    }
};

export default SuccessHandler;
