const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { ensureInsideProject, addExportToIndex, toPascalCase } = require("../utils/helpers");
const { CREATE, GENERIC, PREFIX } = require("../../lib/constants");

function addServiceCommand(name) {
  ensureInsideProject();

  const Name = toPascalCase(name);
  const fileName = `${Name}Service`;
  const filePath = path.resolve(process.cwd(), `Src/Services/${fileName}.js`);
  const indexPath = path.resolve(process.cwd(), "Src/Services/index.js");

  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow(`\n${PREFIX.WARN}${GENERIC.FILE_ALREADY_EXISTS(fileName + ".js")}\n`));
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
  console.log(chalk.green(`${PREFIX.SUCCESS}${CREATE.CREATED_FILE("Src/Services/" + fileName + ".js")}`));

  addExportToIndex(indexPath, fileName, fileName);
  console.log(chalk.green(`${PREFIX.SUCCESS}${CREATE.UPDATED_FILE("Src/Services/index.js")}`));

  console.log(chalk.bold.green(`\n${CREATE.SERVICE_DONE(fileName)}\n`));
}

module.exports = addServiceCommand;
