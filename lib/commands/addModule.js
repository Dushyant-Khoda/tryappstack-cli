const chalk = require("chalk");
const { ensureInsideProject, toPascalCase } = require("../utils/helpers");
const { generateDoc } = require("../utils/generateDoc");
const addControllerCommand = require("./addController");
const addModelCommand = require("./addModel");
const addRouterCommand = require("./addRouter");
const { CREATE, PREFIX } = require("../../lib/constants");

function addModuleCommand(name, options = {}) {
    ensureInsideProject();

    const Name = toPascalCase(name);
    const skipDoc = options.skipDoc || false;

    console.log(chalk.cyan(`\n${CREATE.CREATING_MODULE(Name)}\n`));
    console.log(chalk.gray(`  ${CREATE.CREATING_MODULE(Name + " Controller")}...`));
    addControllerCommand(name, { skipDoc: true }); // doc generated at module level

    console.log(chalk.gray(`  ${CREATE.CREATING_MODULE(Name + " Model")}...`));
    addModelCommand(name);

    console.log(chalk.gray(`  ${CREATE.CREATING_MODULE(Name + " Router")}...`));
    addRouterCommand(name, { skipDoc: true }); // doc generated at module level

    // Generate module documentation
    if (!skipDoc) {
        console.log(chalk.gray("  Generating documentation..."));
        generateDoc(name, {
            type: "module",
            createdFiles: [
                `Src/Controller/${Name}Controller.js`,
                `Src/Models/${Name}Model.js`,
                `Src/Routes/${Name}Routes.js`,
            ],
            updatedFiles: [
                "Src/Controller/index.js",
                "Src/Models/index.js",
                "Src/Routes/index.js",
                "Src/Loaders/ServerLoader.js",
            ],
        });
    }

    console.log(chalk.bold.green(`\n${CREATE.MODULE_DONE(Name)}\n`));
    console.log(chalk.cyan(`  ${CREATE.SECTION_CREATED}:`));
    console.log(chalk.white(`    • Src/Controller/${Name}Controller.js`));
    console.log(chalk.white(`    • Src/Models/${Name}Model.js`));
    console.log(chalk.white(`    • Src/Routes/${Name}Routes.js`));
    console.log(chalk.cyan(`\n  ${CREATE.SECTION_UPDATED}:`));
    console.log(chalk.white("    • Src/Controller/index.js"));
    console.log(chalk.white("    • Src/Models/index.js"));
    console.log(chalk.white("    • Src/Routes/index.js"));
    console.log(chalk.white("    • Src/Loaders/ServerLoader.js"));

    if (!skipDoc) {
        console.log(chalk.cyan(`\n  ${CREATE.SECTION_DOCS}:`));
        console.log(chalk.white(`    • docs/modules/${Name}.md`));
    }

    console.log("\n");
}

module.exports = addModuleCommand;
