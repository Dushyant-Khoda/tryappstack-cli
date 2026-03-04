const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { ensureInsideProject } = require("../utils/helpers");

async function addVarEnvCommand(varName) {
    ensureInsideProject();

    const envPath = path.resolve(process.cwd(), "config.env");
    const configIndexPath = path.resolve(process.cwd(), "Config/index.js");

    if (!fs.existsSync(envPath)) {
        console.log(chalk.red("\n❌ config.env not found.\n"));
        process.exit(1);
    }

    if (!fs.existsSync(configIndexPath)) {
        console.log(chalk.red("\n❌ Config/index.js not found.\n"));
        process.exit(1);
    }

    // Convert to UPPER_SNAKE_CASE
    const envKey = varName.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();

    // Check if already exists in config.env
    const envContent = fs.readFileSync(envPath, "utf-8");
    if (envContent.includes(`${envKey}=`)) {
        console.log(chalk.yellow(`\n⚠  ${envKey} already exists in config.env.\n`));
        process.exit(0);
    }

    // Ask for the value
    const { value } = await inquirer.prompt([
        {
            type: "input",
            name: "value",
            message: chalk.green(`Value for ${envKey}:`),
            default: "",
        },
    ]);

    // 1. Append to config.env
    const envLine = `${envKey}=${value}\n`;
    fs.writeFileSync(envPath, envContent.trimEnd() + "\n" + envLine, "utf-8");
    console.log(chalk.green(`  ✔ Added ${envKey} to config.env`));

    // 2. Add to Config/index.js exports
    let configContent = fs.readFileSync(configIndexPath, "utf-8");

    if (configContent.includes(envKey)) {
        console.log(chalk.yellow(`  ⚠  ${envKey} already exists in Config/index.js`));
    } else {
        // Find the closing "} = process.env;" and add the key before it
        configContent = configContent.replace(
            /} = process\.env;/,
            `  ${envKey},\n} = process.env;`
        );
        fs.writeFileSync(configIndexPath, configContent, "utf-8");
        console.log(chalk.green(`  ✔ Added ${envKey} export to Config/index.js`));
    }

    console.log(chalk.bold.green(`\n✅ Environment variable ${envKey} added successfully!\n`));
}

module.exports = addVarEnvCommand;
