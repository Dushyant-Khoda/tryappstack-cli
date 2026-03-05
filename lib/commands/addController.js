const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { ensureInsideProject, addExportToIndex, toPascalCase } = require("../utils/helpers");
const { generateDoc } = require("../utils/generateDoc");
const { CREATE, GENERIC, PREFIX } = require("../../lib/constants");

function addControllerCommand(name, options = {}) {
    ensureInsideProject();

    const Name = toPascalCase(name);
    const skipDoc = options.skipDoc || false;
    const fileName = `${Name}Controller`;
    const filePath = path.resolve(process.cwd(), `Src/Controller/${fileName}.js`);
    const indexPath = path.resolve(process.cwd(), "Src/Controller/index.js");

    if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`\n${PREFIX.WARN}${GENERIC.FILE_ALREADY_EXISTS(fileName + ".js")}\n`));
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
    console.log(chalk.green(`${PREFIX.SUCCESS}${CREATE.CREATED_FILE("Src/Controller/" + fileName + ".js")}`));

    addExportToIndex(indexPath, fileName, fileName);
    console.log(chalk.green(`${PREFIX.SUCCESS}${CREATE.UPDATED_FILE("Src/Controller/index.js")}`));

    // Generate controller documentation
    if (!skipDoc) {
        generateDoc(name, {
            type: "controller",
            createdFiles: [`Src/Controller/${fileName}.js`],
            updatedFiles: ["Src/Controller/index.js"],
        });
    }

    console.log(chalk.bold.green(`\n${CREATE.CONTROLLER_DONE(fileName)}\n`));
}

module.exports = addControllerCommand;
