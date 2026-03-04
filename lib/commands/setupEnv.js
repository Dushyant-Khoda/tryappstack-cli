const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { ensureInsideProject } = require("../utils/helpers");

async function setupEnvCommand() {
    ensureInsideProject();

    const envPath = path.resolve(process.cwd(), "config.env");

    if (!fs.existsSync(envPath)) {
        console.log(chalk.red("\n❌ config.env not found in current directory.\n"));
        process.exit(1);
    }

    console.log(chalk.cyan("\n🔧 Setup Environment Variables\n"));
    console.log(chalk.gray("  Press Enter to keep the current/default value.\n"));

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "PORT",
            message: chalk.green("PORT:"),
            default: "3000",
        },
        {
            type: "input",
            name: "DB_URL",
            message: chalk.green("DB_URL (MongoDB connection string):"),
            default: "your_mongodb_url_here",
        },
        {
            type: "input",
            name: "JWT_SECRET",
            message: chalk.green("JWT_SECRET:"),
            default: "your_jwt_secret_here",
        },
        {
            type: "input",
            name: "JWT_EXPIRE",
            message: chalk.green("JWT_EXPIRE:"),
            default: "2d",
        },
        {
            type: "input",
            name: "COOKIE_EXPIRE",
            message: chalk.green("COOKIE_EXPIRE (in minutes):"),
            default: "60",
        },
        {
            type: "list",
            name: "LOG_STORAGE_STRATEGY",
            message: chalk.green("LOG_STORAGE_STRATEGY (logs month wise or date wise?):"),
            choices: [
                {
                    name: "month (Src/Uploads/Logs/JAN-2026/info.log)",
                    value: "month",
                },
                {
                    name: "date  (Src/Uploads/Logs/JAN-2026/01/info.log)",
                    value: "date",
                },
            ],
            default: "month",
        },
        {
            type: "input",
            name: "FRONTEND_URL",
            message: chalk.green("FRONTEND_URL:"),
            default: "http://localhost:3000",
        },
        {
            type: "input",
            name: "AWS_CLIENT_ID",
            message: chalk.green("AWS_CLIENT_ID:"),
            default: "your_aws_client_id_here",
        },
        {
            type: "input",
            name: "AWS_CLIENT_SECRET",
            message: chalk.green("AWS_CLIENT_SECRET:"),
            default: "your_aws_client_secret_here",
        },
        {
            type: "input",
            name: "AWS_REGION",
            message: chalk.green("AWS_REGION:"),
            default: "ap-south-1",
        },
        {
            type: "input",
            name: "AWS_BUCKET_NAME",
            message: chalk.green("AWS_BUCKET_NAME:"),
            default: "your_aws_bucket_name_here",
        },
        {
            type: "input",
            name: "SMTP_MAIL",
            message: chalk.green("SMTP_MAIL:"),
            default: "your_smtp_email@example.com",
        },
        {
            type: "input",
            name: "SMTP_SERVICE",
            message: chalk.green("SMTP_SERVICE:"),
            default: "gmail",
        },
        {
            type: "input",
            name: "SMTP_HOST",
            message: chalk.green("SMTP_HOST:"),
            default: "smtp.gmail.com",
        },
        {
            type: "input",
            name: "SMTP_PORT",
            message: chalk.green("SMTP_PORT:"),
            default: "587",
        },
        {
            type: "input",
            name: "SMTP_PASS",
            message: chalk.green("SMTP_PASS:"),
            default: "your_smtp_password_here",
        },
        {
            type: "list",
            name: "IS_S3",
            message: chalk.green("IS_S3 (use S3 for uploads?):"),
            choices: ["false", "true"],
            default: "false",
        },
        {
            type: "input",
            name: "CLOUD_NAME",
            message: chalk.green("CLOUD_NAME (Cloudinary):"),
            default: "your_cloudinary_cloud_name",
        },
        {
            type: "input",
            name: "CLOUD_API_KEY",
            message: chalk.green("CLOUD_API_KEY (Cloudinary):"),
            default: "your_cloudinary_api_key",
        },
        {
            type: "input",
            name: "CLOUD_API_SECRET",
            message: chalk.green("CLOUD_API_SECRET (Cloudinary):"),
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
CLOUD_NAME=${answers.CLOUD_NAME}
CLOUD_API_KEY=${answers.CLOUD_API_KEY}
CLOUD_API_SECRET=${answers.CLOUD_API_SECRET}
`;

    fs.writeFileSync(envPath, envContent, "utf-8");
    console.log(chalk.bold.green("\n✅ config.env updated successfully!\n"));
}

module.exports = setupEnvCommand;
