const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { getStacks, getTemplatePath, isStackAvailable } = require("../core/templateManager");
const { createProject } = require("../core/projectCreator");

const COMING_SOON_MESSAGE = "This stack is coming soon. Stay tuned for future releases.";

async function initCommand() {
    const stacks = getStacks();

    const stackChoices = stacks.map((s) => {
        const name = s.comingSoon ? `${s.name}  — Coming Soon` : s.name;
        return { name, value: s.id, short: s.name };
    });

    const { stackId } = await inquirer.prompt([
        {
            type: "list",
            name: "stackId",
            message: "Select your project stack:",
            choices: stackChoices,
            pageSize: 10,
        },
    ]);

    if (!isStackAvailable(stackId)) {
        console.log("\n");
        console.log(chalk.yellow(COMING_SOON_MESSAGE));
        console.log("\n");
        return;
    }

    const templatePath = getTemplatePath(stackId);
    if (!templatePath) {
        console.log(chalk.red("\n❌ Template not found.\n"));
        return;
    }

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: chalk.green("📁 Project name:"),
            default: "my-node-app",
            validate: (input) => {
                if (/^[a-zA-Z0-9_.-]+$/.test(input)) return true;
                return "Project name can only contain letters, numbers, dashes, underscores, and dots.";
            },
        },
        {
            type: "input",
            name: "description",
            message: chalk.green("📝 Description:"),
            default: "A production-ready Node.js application",
        },
        {
            type: "input",
            name: "author",
            message: chalk.green("👤 Author:"),
            default: "",
        },
        {
            type: "input",
            name: "port",
            message: chalk.green("🔌 Port:"),
            default: "3000",
            validate: (input) => {
                const port = parseInt(input, 10);
                if (port > 0 && port < 65536) return true;
                return "Please enter a valid port number (1-65535).";
            },
        },
        {
            type: "input",
            name: "dbUrl",
            message: chalk.green("🗄️  MongoDB URL:"),
            default: "your_mongodb_url_here",
        },
        {
            type: "list",
            name: "logStorageStrategy",
            message: chalk.green("🧾 Log storage strategy:"),
            choices: [
                {
                    name: "Month wise (Src/Uploads/Logs/JAN-2026/info.log)",
                    value: "month",
                },
                {
                    name: "Date wise  (Src/Uploads/Logs/JAN-2026/01/info.log)",
                    value: "date",
                },
            ],
            default: "month",
        },
        {
            type: "list",
            name: "packageManager",
            message: chalk.green("📦 Package manager:"),
            choices: ["yarn", "npm"],
            default: "yarn",
        },
    ]);

    const targetDir = path.resolve(process.cwd(), answers.projectName);

    try {
        const { projectName, packageManager } = await createProject(templatePath, {
            projectName: answers.projectName,
            description: answers.description,
            author: answers.author,
            port: answers.port,
            dbUrl: answers.dbUrl,
            logStorageStrategy: answers.logStorageStrategy,
            packageManager: answers.packageManager,
            targetDir,
        });

        printSuccessMessage(projectName, packageManager);
    } catch (err) {
        console.log(chalk.red(`\n❌ ${err.message}\n`));
        process.exit(1);
    }
}

function printSuccessMessage(projectName, packageManager) {
    console.log("\n");
    console.log(chalk.bold.green("✅ Project created successfully!"));
    console.log("\n");
    console.log(chalk.cyan("  To get started:"));
    console.log("\n");
    console.log(chalk.white(`    cd ${projectName}`));
    console.log(chalk.white(`    ${packageManager === "yarn" ? "yarn start" : "npm start"}`));
    console.log("\n");
    console.log(chalk.cyan("  Project structure:"));
    console.log(chalk.gray("    ├── Config/          → Environment config loader"));
    console.log(chalk.gray("    ├── Src/"));
    console.log(chalk.gray("    │   ├── Controller/  → Route handlers"));
    console.log(chalk.gray("    │   ├── Loaders/     → DB, Server, Swagger, Morgan setup"));
    console.log(chalk.gray("    │   ├── Middleware/   → Auth, Error, Upload, Validation"));
    console.log(chalk.gray("    │   ├── Models/      → Mongoose schemas"));
    console.log(chalk.gray("    │   ├── Routes/      → Express routes"));
    console.log(chalk.gray("    │   ├── Services/    → Email, S3, Cloudinary, OTP, etc."));
    console.log(chalk.gray("    │   ├── Templates/   → Email/HTML templates"));
    console.log(chalk.gray("    │   ├── Uploads/     → File upload directory"));
    console.log(chalk.gray("    │   └── Utils/       → Error handler, Logger, Helpers"));
    console.log(chalk.gray("    ├── config.env       → Environment variables"));
    console.log(chalk.gray("    └── main.js          → Application entry point"));
    console.log("\n");
    console.log(chalk.yellow("  ⚠️  Copy .env.example to config.env and add your credentials."));
    console.log("\n");
    console.log(chalk.cyan("  Available commands (run inside your project):"));
    console.log(chalk.white("    npx tas add-module <Name>"));
    console.log(chalk.white("    npx tas add-controller <Name>"));
    console.log(chalk.white("    npx tas add-model <Name>"));
    console.log(chalk.white("    npx tas add-router <Name>"));
    console.log(chalk.white("    npx tas add-middleware <Name>"));
    console.log(chalk.white("    npx tas add-service <Name>"));
    console.log(chalk.white("    npx tas add-utils <Name>"));
    console.log(chalk.white("    npx tas setup-env"));
    console.log(chalk.white("    npx tas add-var-env <VAR_NAME>"));
    console.log("\n");
}

module.exports = initCommand;
