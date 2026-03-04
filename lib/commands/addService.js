const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { ensureInsideProject, addExportToIndex, toPascalCase } = require("../utils/helpers");

function addServiceCommand(name) {
    ensureInsideProject();

    const Name = toPascalCase(name);
    const fileName = `${Name}Service`;
    const filePath = path.resolve(process.cwd(), `Src/Services/${fileName}.js`);
    const indexPath = path.resolve(process.cwd(), "Src/Services/index.js");

    if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`\n⚠  ${fileName}.js already exists.\n`));
        process.exit(0);
    }

    const template = `const ${fileName} = {
  async execute(data) {
    // Add your service logic here
    return data;
  },
};

export default ${fileName};
`;

    fs.writeFileSync(filePath, template, "utf-8");
    console.log(chalk.green(`  ✔ Created Src/Services/${fileName}.js`));

    addExportToIndex(indexPath, fileName, fileName);
    console.log(chalk.green(`  ✔ Updated Src/Services/index.js`));

    console.log(chalk.bold.green(`\n✅ Service "${fileName}" created successfully!\n`));
}

module.exports = addServiceCommand;
