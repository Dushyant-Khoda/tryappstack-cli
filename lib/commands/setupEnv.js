const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { ensureInsideProject } = require("../utils/helpers");
const { ENV, PREFIX } = require("../../lib/constants");

async function setupEnvCommand() {
    ensureInsideProject();

    const envPath = path.resolve(process.cwd(), "config.env");

    if (!fs.existsSync(envPath)) {
        console.log(chalk.red(`\n${PREFIX.ERROR}${ENV.CONFIG_NOT_FOUND}\n`));
        process.exit(1);
    }

    console.log("\n");
    console.log(chalk.bold.cyan(ENV.SETUP_TITLE));
    console.log(chalk.gray(ENV.SETUP_HINT + "\n"));

    const promptText = (text) => chalk.cyan(text);

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "PORT",
            message: promptText("PORT:"),
            default: "3000",
        },
        {
            type: "input",
            name: "DB_URL",
            message: promptText("DB_URL (MongoDB connection string):"),
            default: "your_mongodb_url_here",
        },
        {
            type: "input",
            name: "JWT_SECRET",
            message: promptText("JWT_SECRET:"),
            default: "your_jwt_secret_here",
        },
        {
            type: "input",
            name: "JWT_EXPIRE",
            message: promptText("JWT_EXPIRE:"),
            default: "2d",
        },
        {
            type: "input",
            name: "COOKIE_EXPIRE",
            message: promptText("COOKIE_EXPIRE (in minutes):"),
            default: "60",
        },
        {
            type: "list",
            name: "LOG_STORAGE_STRATEGY",
            message: promptText("LOG_STORAGE_STRATEGY:"),
            choices: [
                {
                    name: "Month wise (e.g., JAN-2026/info.log)",
                    value: "month",
                },
                {
                    name: "Date wise (e.g., JAN-2026/01/info.log)",
                    value: "date",
                },
            ],
            default: "month",
        },
        {
            type: "input",
            name: "FRONTEND_URL",
            message: promptText("FRONTEND_URL:"),
            default: "http://localhost:3000",
        },
        {
            type: "input",
            name: "AWS_CLIENT_ID",
            message: promptText("AWS_CLIENT_ID:"),
            default: "your_aws_client_id_here",
        },
        {
            type: "input",
            name: "AWS_CLIENT_SECRET",
            message: promptText("AWS_CLIENT_SECRET:"),
            default: "your_aws_client_secret_here",
        },
        {
            type: "input",
            name: "AWS_REGION",
            message: promptText("AWS_REGION:"),
            default: "ap-south-1",
        },
        {
            type: "input",
            name: "AWS_BUCKET_NAME",
            message: promptText("AWS_BUCKET_NAME:"),
            default: "your_aws_bucket_name_here",
        },
        {
            type: "input",
            name: "SMTP_MAIL",
            message: promptText("SMTP_MAIL:"),
            default: "your_smtp_email@example.com",
        },
        {
            type: "input",
            name: "SMTP_SERVICE",
            message: promptText("SMTP_SERVICE:"),
            default: "gmail",
        },
        {
            type: "input",
            name: "SMTP_HOST",
            message: promptText("SMTP_HOST:"),
            default: "smtp.gmail.com",
        },
        {
            type: "input",
            name: "SMTP_PORT",
            message: promptText("SMTP_PORT:"),
            default: "587",
        },
        {
            type: "input",
            name: "SMTP_PASS",
            message: promptText("SMTP_PASS:"),
            default: "your_smtp_password_here",
        },
        {
            type: "list",
            name: "IS_S3",
            message: promptText("IS_S3 (use S3 for uploads?):"),
            choices: ["false", "true"],
            default: "false",
        },
        {
            type: "input",
            name: "CLOUDINARY_NAME",
            message: promptText("CLOUDINARY_NAME (Cloudinary):"),
            default: "your_cloudinary_CLOUDINARY_name",
        },
        {
            type: "input",
            name: "CLOUDINARY_API_KEY",
            message: promptText("CLOUDINARY_API_KEY (Cloudinary):"),
            default: "your_cloudinary_api_key",
        },
        {
            type: "input",
            name: "CLOUDINARY_API_SECRET",
            message: promptText("CLOUDINARY_API_SECRET (Cloudinary):"),
            default: "your_cloudinary_api_secret",
        },
    ]);

    // Build the env file content
    const envContent = `PORT=${answers.PORT}
DB_URL=${answers.DB_URL}
DEBUG_MODE=true
LOG_STORAGE_STRATEGY=${answers.LOG_STORAGE_STRATEGY}
JWT_SECRET=${answers.JWT_SECRET}
JWT_EXPIRE=${answers.JWT_EXPIRE}
COOKIE_EXPIRE=${answers.COOKIE_EXPIRE}

AWS_CLIENT_ID="${answers.AWS_CLIENT_ID}"
AWS_CLIENT_SECRET="${answers.AWS_CLIENT_SECRET}"
AWS_REGION="${answers.AWS_REGION}"
AWS_BUCKET_NAME="${answers.AWS_BUCKET_NAME}"

FRONTEND_URL="${answers.FRONTEND_URL}"

SMTP_MAIL=${answers.SMTP_MAIL}
SMTP_SERVICE=${answers.SMTP_SERVICE}
SMTP_HOST=${answers.SMTP_HOST}
SMTP_PORT=${answers.SMTP_PORT}
SMTP_PASS=${answers.SMTP_PASS}

IS_S3=${answers.IS_S3}

# Cloudinary Configuration
CLOUDINARY_NAME=${answers.CLOUDINARY_NAME}
CLOUDINARY_API_KEY=${answers.CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${answers.CLOUDINARY_API_SECRET}
`;

    fs.writeFileSync(envPath, envContent, "utf-8");
    console.log(chalk.bold.green(`\n${ENV.ENV_UPDATED}\n`));
}

module.exports = setupEnvCommand;
