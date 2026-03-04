const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const ora = require("ora");
const { execSync } = require("child_process");

const PSEUDO_DOTFILES = ["_gitignore", "_babelrc"];
const ENV_FILENAME = "config.env";

/**
 * Create a new project from a template directory.
 * @param {string} templatePath - Absolute path to the template folder
 * @param {Object} options - Project options
 * @param {string} options.projectName - Project folder and package name
 * @param {string} options.description - Package description
 * @param {string} options.author - Author name
 * @param {string} options.port - Server port
 * @param {string} options.dbUrl - MongoDB connection URL
 * @param {string} options.logStorageStrategy - 'month' or 'date' for log files
 * @param {string} options.packageManager - 'npm' or 'yarn'
 * @param {string} options.targetDir - Absolute path where project will be created
 */
async function createProject(templatePath, options) {
    const {
        projectName,
        description,
        author,
        port,
        dbUrl,
        logStorageStrategy,
        packageManager,
        targetDir,
    } = options;

    if (fs.existsSync(targetDir)) {
        throw new Error(
            `Directory "${projectName}" already exists. Please choose a different name.`
        );
    }

    // 1. Copy template to target directory
    const spinnerCopy = ora({
        text: chalk.cyan("Copying project files..."),
        spinner: "dots",
    }).start();
    try {
        await fs.copy(templatePath, targetDir);
        for (const file of PSEUDO_DOTFILES) {
            const srcPath = path.join(targetDir, file);
            if (fs.existsSync(srcPath)) {
                fs.renameSync(srcPath, path.join(targetDir, file.replace("_", ".")));
            }
        }
        spinnerCopy.succeed(chalk.green("Project files copied successfully!"));
    } catch (err) {
        spinnerCopy.fail(chalk.red("Failed to copy template files."));
        throw err;
    }

    // 2. Update package.json
    const spinnerPkg = ora({
        text: chalk.cyan("Configuring package.json..."),
        spinner: "dots",
    }).start();
    try {
        const pkgPath = path.join(targetDir, "package.json");
        const pkg = await fs.readJson(pkgPath);
        pkg.name = projectName;
        pkg.description = description || "A production-ready Node.js application";
        pkg.author = author || "";
        pkg.version = "1.0.1";
        await fs.writeJson(pkgPath, pkg, { spaces: 2 });
        spinnerPkg.succeed(chalk.green("package.json configured!"));
    } catch (err) {
        spinnerPkg.fail(chalk.red("Failed to configure package.json."));
        throw err;
    }

    // 3. Set up environment file (config.env or .env from .env.example if present)
    const envExamplePath = path.join(targetDir, ".env.example");
    const envDestPath = path.join(targetDir, ENV_FILENAME);
    const spinnerEnv = ora({
        text: chalk.cyan("Setting up environment variables..."),
        spinner: "dots",
    }).start();
    try {
        let envContent;
        if (fs.existsSync(envExamplePath)) {
            envContent = await fs.readFile(envExamplePath, "utf-8");
        } else if (fs.existsSync(envDestPath)) {
            envContent = await fs.readFile(envDestPath, "utf-8");
        } else {
            spinnerEnv.warn(chalk.yellow("No env file found in template, skipping."));
        }
        if (envContent) {
            envContent = envContent.replace(/PORT=.*/, `PORT=${port}`);
            envContent = envContent.replace(/DB_URL=.*/, `DB_URL=${dbUrl}`);
            if (typeof logStorageStrategy === "string" && logStorageStrategy.length > 0) {
                if (envContent.match(/LOG_STORAGE_STRATEGY=.*/)) {
                    envContent = envContent.replace(
                        /LOG_STORAGE_STRATEGY=.*/,
                        `LOG_STORAGE_STRATEGY=${logStorageStrategy}`
                    );
                } else {
                    envContent = `${envContent.trim()}\nLOG_STORAGE_STRATEGY=${logStorageStrategy}\n`;
                }
            }
            await fs.writeFile(envDestPath, envContent);
            spinnerEnv.succeed(chalk.green("Environment variables configured!"));
        }
    } catch (err) {
        spinnerEnv.fail(chalk.red("Failed to set up environment variables."));
        throw err;
    }

    // 4. Initialize git and create initial commit
    const spinnerGit = ora({
        text: chalk.cyan("Setting up git repository..."),
        spinner: "dots",
    }).start();
    try {
        // Check if git is available
        execSync("git --version", { stdio: "ignore" });

        execSync("git init", { cwd: targetDir, stdio: "ignore" });
        execSync("git add .", { cwd: targetDir, stdio: "ignore" });
        execSync('git commit -m "Initial project setup using TryAppStack"', {
            cwd: targetDir,
            stdio: "ignore",
        });
        spinnerGit.succeed(chalk.green("Git repository initialized with initial commit."));
    } catch (err) {
        spinnerGit.warn(
            chalk.yellow("Git not available or failed to initialize. Skipping git setup.")
        );
    }

    // 5. Install dependencies
    const installCmd = packageManager === "yarn" ? "yarn" : "npm install";
    const spinnerInstall = ora({
        text: chalk.cyan(
            `Installing dependencies with ${packageManager}... (this may take a moment)`
        ),
        spinner: "dots",
    }).start();
    try {
        execSync(installCmd, { cwd: targetDir, stdio: "ignore" });
        spinnerInstall.succeed(chalk.green("Dependencies installed successfully!"));
    } catch (err) {
        spinnerInstall.fail(chalk.red(`Failed to install dependencies with ${packageManager}.`));
        console.log(chalk.yellow(`  You can install manually: cd ${projectName} && ${installCmd}`));
    }

    return { projectName, packageManager };
}

module.exports = { createProject };
