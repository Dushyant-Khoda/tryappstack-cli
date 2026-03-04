const morgan = require("morgan");
const chalk = require("chalk");

const MorganConfig = {
    async init(app) {
        morgan.token("method", (req, res) => {
            return chalk.blue(req.method);
        });

        // Custom token to colorize status
        morgan.token("status", (req, res) => {
            const status = res.statusCode;
            if (status >= 500) {
                return chalk.red(status);
            } else if (status >= 400) {
                return chalk.yellow(status);
            } else if (status >= 300) {
                return chalk.cyan(status);
            } else {
                return chalk.green(status);
            }
        });

        // Custom token to colorize URL
        morgan.token("url", (req, res) => {
            return chalk.magenta(req.url);
        });

        // Custom token to colorize content length
        morgan.token("res-content-length", (req, res) => {
            return chalk.yellow(res.get("Content-Length") || 0);
        });

        // Custom format string using the tokens
        const morganFormat = ":method :url :status :res-content-length - :response-time ms";

        // Use morgan middleware with custom format
        app.use(morgan(morganFormat));

        app.use((req, res, next) => {
            console.log(chalk.yellow("Endpoint: ") + chalk.blueBright(req.originalUrl));
            if (req.method != "GET") {
                console.log(req.body); // this is what you want
            }
            next();
        });
    },
};
export default MorganConfig;
