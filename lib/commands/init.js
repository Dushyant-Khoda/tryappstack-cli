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

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "stack",
            message: "Select a stack architecture:",
            choices: [
                { name: "Node.js + MongoDB + Express", value: "node-mongo-js" },
                {
                    name: "Node.js + PostgreSQL + Express (Coming Soon)",
                    value: "node-pg-js",
                    disabled: "Coming Soon",
                },
                {
                    name: "Node.js + MySQL + Express (Coming Soon)",
                    value: "node-mysql-js",
                    disabled: "Coming Soon",
                },
            ],
            default: "node-mongo-js",
        },
        {
            type: "input",
            name: "projectName",
            message: "Project name (folder will be created):",
            default: "my-tas-app",
            validate: (input) => {
                if (/^[a-z0-9-_]+$/.test(input)) return true;
                return "Project name may only include lowercase letters, numbers, dashes, and underscores.";
            },
        },
        {
            type: "input",
            name: "description",
            message: "Project description:",
            default: "A TryAppStack generated project",
        },
        {
            type: "input",
            name: "author",
            message: "Author name:",
            default: "",
        },
        {
            type: "input",
            name: "port",
            message: "Application Port:",
            default: "3000",
        },
        {
            type: "input",
            name: "dbUrl",
            message: "Database URL (e.g., MongoDB Connection String):",
            default: "mongodb://localhost:27017/myapp",
        },
        {
            type: "list",
            name: "logStorageStrategy",
            message: "Log storage strategy (month-wise or date-wise):",
            choices: ["month", "date"],
            default: "month",
        },
        {
            type: "list",
            name: "packageManager",
            message: "Select package manager to install dependencies:",
            choices: ["npm", "yarn"],
            default: "npm",
        },
    ]);

    if (answers.stack !== "node-mongo-js") {
        console.log(chalk.yellow(`\n${INIT.COMING_SOON}\n`));
        process.exit(0);
    }

    const templatePath = path.resolve(__dirname, "../../templates", answers.stack);

    try {
        console.log("\n");
        const { projectName, packageManager } = await createProject(templatePath, {
            ...answers,
            targetDir: path.resolve(process.cwd(), answers.projectName),
        });
        printSuccessMessage(projectName, packageManager);
    } catch (err) {
        console.error(chalk.red(`\n${PREFIX.ERROR}${err.message}\n`));
        process.exit(1);
    }
}

function printSuccessMessage(projectName, packageManager) {
    const startCmd = packageManager === "yarn" ? "yarn start" : "npm start";

    console.log("\n");
    console.log(chalk.bold.green(INIT.PROJECT_CREATED));

    // ── What to do next ────────────────────────────────────
    console.log("\n");
    console.log(chalk.bold.cyan(`  ${INIT.SECTION_NEXT_STEPS}:\n`));

    console.log(chalk.white(`  1. Go to your project`));
    console.log(chalk.gray(`     ${INIT.STEP_CD(projectName)}\n`));

    console.log(chalk.white(`  2. Set up environment variables`));
    console.log(chalk.gray(`     ${INIT.STEP_ENV}`));
    console.log(chalk.gray(`     (${INIT.STEP_ENV_ALT})\n`));

    console.log(chalk.white(`  3. Start the server`));
    console.log(chalk.gray(`     ${INIT.STEP_START(startCmd)}\n`));

    console.log(chalk.white(`  4. Test it works`));
    console.log(chalk.gray(`     ${INIT.STEP_TEST}`));

    // ── What's included ────────────────────────────────────
    console.log("\n");
    console.log(chalk.bold.cyan(`  ${INIT.SECTION_INCLUDED}:\n`));
    console.log(chalk.gray(`     ${INIT.INCLUDED_AUTH}`));
    console.log(chalk.gray(`     ${INIT.INCLUDED_OTP}`));
    console.log(chalk.gray(`     ${INIT.INCLUDED_UPLOAD}`));
    console.log(chalk.gray(`     ${INIT.INCLUDED_EMAIL}`));
    console.log(chalk.gray(`     ${INIT.INCLUDED_SECURITY}`));
    console.log(chalk.gray(`     ${INIT.INCLUDED_TOOLING}`));

    // ── Read the docs ──────────────────────────────────────
    console.log("\n");
    console.log(chalk.bold.cyan(`  ${INIT.SECTION_DOCS}:\n`));
    console.log(chalk.white(`     ${INIT.DOC_SETUP}`));
    console.log(chalk.white(`     ${INIT.DOC_AUTH}`));
    console.log(chalk.white(`     ${INIT.DOC_SERVICES}`));
    console.log(chalk.white(`     ${INIT.DOC_CLI}`));
    console.log(chalk.white(`     ${INIT.DOC_DOCKER}`));

    // ── CLI quick reference ────────────────────────────────
    console.log("\n");
    console.log(chalk.bold.cyan(`  ${INIT.SECTION_COMMANDS}:\n`));
    console.log(chalk.gray(`     ${INIT.CMD_MODULE}`));
    console.log(chalk.gray(`     ${INIT.CMD_ROUTER}`));
    console.log(chalk.gray(`     ${INIT.CMD_ENV}`));
    console.log(chalk.gray(`     ${INIT.CMD_VAR}`));
    console.log(chalk.dim(`\n     ${INIT.SKIP_DOC_HINT}`));
    console.log("\n");
}

module.exports = initCommand;
