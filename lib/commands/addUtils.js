const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { ensureInsideProject, addExportToIndex, toPascalCase } = require("../utils/helpers");

function addUtilsCommand(name) {
    ensureInsideProject();

    const Name = toPascalCase(name);
    const fileName = `${Name}`;
    const filePath = path.resolve(process.cwd(), `Src/Utils/${fileName}.js`);
    const indexPath = path.resolve(process.cwd(), "Src/Utils/index.js");

    if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`\n⚠  ${fileName}.js already exists.\n`));
        process.exit(0);
    }

    const template = `/**
 * ${Name} Utility
 * Add your utility functions here.
 */

const ${Name} = {
  // Add your utility methods here
};

export default ${Name};
`;

    fs.writeFileSync(filePath, template, "utf-8");
    console.log(chalk.green(`  ✔ Created Src/Utils/${fileName}.js`));

    addExportToIndex(indexPath, Name, fileName);
    console.log(chalk.green(`  ✔ Updated Src/Utils/index.js`));

    console.log(chalk.bold.green(`\n✅ Util "${fileName}" created successfully!\n`));
}

module.exports = addUtilsCommand;
