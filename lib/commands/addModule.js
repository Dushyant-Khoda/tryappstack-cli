const chalk = require("chalk");
const { ensureInsideProject, toPascalCase } = require("../utils/helpers");
const addControllerCommand = require("./addController");
const addModelCommand = require("./addModel");
const addRouterCommand = require("./addRouter");

function addModuleCommand(name) {
    ensureInsideProject();

    const Name = toPascalCase(name);

    console.log(chalk.cyan(`\n🚀 Creating full module: ${Name}\n`));
    console.log(chalk.gray("  Creating Controller..."));
    addControllerCommand(name);

    console.log(chalk.gray("  Creating Model..."));
    addModelCommand(name);

    console.log(chalk.gray("  Creating Router..."));
    addRouterCommand(name);

    console.log(chalk.bold.green(`\n🎉 Module "${Name}" created successfully!\n`));
    console.log(chalk.cyan("  Files created:"));
    console.log(chalk.white(`    • Src/Controller/${Name}Controller.js`));
    console.log(chalk.white(`    • Src/Models/${Name}Model.js`));
    console.log(chalk.white(`    • Src/Routes/${Name}Routes.js`));
    console.log(chalk.cyan("\n  Files updated:"));
    console.log(chalk.white("    • Src/Controller/index.js"));
    console.log(chalk.white("    • Src/Models/index.js"));
    console.log(chalk.white("    • Src/Routes/index.js"));
    console.log(chalk.white("    • Src/Loaders/ServerLoader.js"));
    console.log("\n");
}

module.exports = addModuleCommand;
