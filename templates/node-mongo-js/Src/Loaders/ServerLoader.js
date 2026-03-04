import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "./MorganConfig";
import Database from "./Database";
import Log from "../Utils/Logger";
import { UserRoutes } from "../Routes";

const ServerLoader = {
    async config(app) {
        Database.init();
        app.use(express.json({ limit: "50mb" })); // Adjust the limit as per your needs
        app.use(express.urlencoded({ limit: "50mb", extended: true }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(
            cors({
                credentials: true,
            })
        );
        morgan.init(app);

        app.use("/api/v1.0/user", UserRoutes);
    },
};

export default ServerLoader;
