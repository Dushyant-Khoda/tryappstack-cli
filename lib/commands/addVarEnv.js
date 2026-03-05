const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { ensureInsideProject } = require("../utils/helpers");
const { ENV, PREFIX } = require("../../lib/constants");

async function addVarEnvCommand(varName) {
    ensureInsideProject();

    const envPath = path.resolve(process.cwd(), "config.env");
    const configIndexPath = path.resolve(process.cwd(), "Config/index.js");

    if (!fs.existsSync(envPath)) {
        console.log(chalk.red(`\n${PREFIX.ERROR}${ENV.CONFIG_NOT_FOUND}\n`));
        process.exit(1);
    }

    if (!fs.existsSync(configIndexPath)) {
        console.log(chalk.red(`\n${PREFIX.ERROR}${ENV.CONFIG_INDEX_NOT_FOUND}\n`));
        process.exit(1);
    }

    // Convert to UPPER_SNAKE_CASE
    const envKey = varName.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();

    // Check if already exists in config.env
    const envContent = fs.readFileSync(envPath, "utf-8");
    if (envContent.includes(`${envKey}=`)) {
        console.log(chalk.yellow(`\n${PREFIX.WARN}${ENV.VAR_ALREADY_EXISTS(envKey)}\n`));
        process.exit(0);
    }

    // Ask for the value
    const { value } = await inquirer.prompt([
        {
            type: "input",
            name: "value",
            message: chalk.cyan(`Value for ${envKey}:`),
            default: "",
        },
    ]);

    // 1. Append to config.env
    const envLine = `${envKey}=${value}\n`;
    fs.writeFileSync(envPath, envContent.trimEnd() + "\n" + envLine, "utf-8");
    console.log(chalk.green(`${PREFIX.SUCCESS}${ENV.VAR_ADDED_ENV(envKey)}`));

    // 2. Add to Config/index.js exports
    let configContent = fs.readFileSync(configIndexPath, "utf-8");

    if (configContent.includes(envKey)) {
        console.log(chalk.yellow(`${PREFIX.WARN}${ENV.VAR_ALREADY_IN_CONFIG(envKey)}`));
    } else {
        // Find the closing "} = process.env;" and add the key before it
        configContent = configContent.replace(
            /} = process\.env;/,
            `  ${envKey},\n} = process.env;`
        );
        fs.writeFileSync(configIndexPath, configContent, "utf-8");
        console.log(chalk.green(`${PREFIX.SUCCESS}${ENV.VAR_ADDED_CONFIG(envKey)}`));
    }

    console.log(chalk.bold.green(`\n${ENV.VAR_DONE(envKey)}\n`));
}

module.exports = addVarEnvCommand;
