#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");
const pkg = require("../package.json");

const program = new Command();

// CLI branding
function showBanner() {
    console.log("\n");
    console.log(
        chalk.cyan(
            figlet.textSync("TryAppStack CLI", { horizontalLayout: "default", font: "Standard" })
        )
    );
    console.log(chalk.gray("Bootstrap production-ready applications instantly."));
    console.log(chalk.dim(`v${pkg.version}`));
    console.log("\n");
}

showBanner();

program
    .name("tas")
    .description(
        "TryAppStack CLI — Bootstrap production-ready applications using modern boilerplates"
    )
    .version(pkg.version);

program
    .command("init")
    .alias("i")
    .description("Scaffold a new project from a stack template")
    .action(async () => {
        const initCommand = require("../lib/commands/init");
        await initCommand();
    });

program
    .command("setup-env")
    .alias("env")
    .description("Interactively set up all environment variables in config.env")
    .action(async () => {
        const setupEnvCommand = require("../lib/commands/setupEnv");
        await setupEnvCommand();
    });

program
    .command("add-var-env <varName>")
    .alias("addenv")
    .description("Add a new environment variable to config.env and Config/index.js")
    .action(async (varName) => {
        const addVarEnvCommand = require("../lib/commands/addVarEnv");
        await addVarEnvCommand(varName);
    });

program
    .command("add-controller <name>")
    .alias("c")
    .description("Create a new controller with CRUD methods")
    .option("--skip-doc, --sd", "Skip generating documentation")
    .action((name, opts) => {
        const addControllerCommand = require("../lib/commands/addController");
        addControllerCommand(name, { skipDoc: opts.skipDoc || false });
    });

program
    .command("add-model <name>")
    .alias("m")
    .description("Create a new Mongoose model with schema")
    .action((name) => {
        const addModelCommand = require("../lib/commands/addModel");
        addModelCommand(name);
    });

program
    .command("add-router <name>")
    .alias("r")
    .description("Create a new Express router with CRUD routes")
    .option("--skip-doc, --sd", "Skip generating documentation")
    .action((name, opts) => {
        const addRouterCommand = require("../lib/commands/addRouter");
        addRouterCommand(name, { skipDoc: opts.skipDoc || false });
    });

program
    .command("add-module <name>")
    .alias("mod")
    .description("Create controller + model + router as a full module")
    .option("--skip-doc, --sd", "Skip generating documentation")
    .action((name, opts) => {
        const addModuleCommand = require("../lib/commands/addModule");
        addModuleCommand(name, { skipDoc: opts.skipDoc || false });
    });

program
    .command("add-middleware <name>")
    .alias("mid")
    .description("Create a new middleware")
    .action((name) => {
        const addMiddlewareCommand = require("../lib/commands/addMiddleware");
        addMiddlewareCommand(name);
    });

program
    .command("add-service <name>")
    .alias("s")
    .description("Create a new service")
    .action((name) => {
        const addServiceCommand = require("../lib/commands/addService");
        addServiceCommand(name);
    });

program
    .command("add-templates <name>")
    .alias("tpl")
    .description("Create a new HTML template")
    .action((name) => {
        const addTemplatesCommand = require("../lib/commands/addTemplates");
        addTemplatesCommand(name);
    });

program
    .command("add-utils <name>")
    .alias("u")
    .description("Create a new utility module")
    .action((name) => {
        const addUtilsCommand = require("../lib/commands/addUtils");
        addUtilsCommand(name);
    });

if (process.argv.length <= 2) {
    program.help();
}

program.parse(process.argv);
