import mongoose from "mongoose";
import { DB_URL } from "../../Config";
import consola from "consola";

const DatabaseLoader = {
    async init() {
        mongoose
            .connect(DB_URL)
            .then(() => {
                consola.success("Database Connected Successfully");
                console.log("\n\n");
            })
            .catch((err) => {
                consola.error("Database Error", err);
            });
    },
};

export default DatabaseLoader;
