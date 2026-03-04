const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { ensureInsideProject, addExportToIndex, toPascalCase } = require("../utils/helpers");

function addControllerCommand(name) {
    ensureInsideProject();

    const Name = toPascalCase(name);
    const fileName = `${Name}Controller`;
    const filePath = path.resolve(process.cwd(), `Src/Controller/${fileName}.js`);
    const indexPath = path.resolve(process.cwd(), "Src/Controller/index.js");

    if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`\n⚠  ${fileName}.js already exists.\n`));
        process.exit(0);
    }

    const template = `const ${fileName} = {
  async add${Name}Worker(req, res, next) {
  },
  async list${Name}Worker(req, res, next) {
  },
  async get${Name}Worker(req, res, next) {
  },
  async update${Name}Worker(req, res, next) {
  },
  async delete${Name}Worker(req, res, next) {
  },
};

export default ${fileName};
`;

    fs.writeFileSync(filePath, template, "utf-8");
    console.log(chalk.green(`  ✔ Created Src/Controller/${fileName}.js`));

    addExportToIndex(indexPath, fileName, fileName);
    console.log(chalk.green(`  ✔ Updated Src/Controller/index.js`));

    console.log(chalk.bold.green(`\n✅ Controller "${fileName}" created successfully!\n`));
}

module.exports = addControllerCommand;
