const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { ensureInsideProject, addExportToIndex, toPascalCase } = require("../utils/helpers");
const { CREATE, GENERIC, PREFIX } = require("../../lib/constants");

function addMiddlewareCommand(name) {
  ensureInsideProject();

  const Name = toPascalCase(name);
  const fileName = `${Name}Middleware`;
  const filePath = path.resolve(process.cwd(), `Src/Middleware/${fileName}.js`);
  const indexPath = path.resolve(process.cwd(), "Src/Middleware/index.js");

  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow(`\n${PREFIX.WARN}${GENERIC.FILE_ALREADY_EXISTS(fileName + ".js")}\n`));
    process.exit(0);
  }

  const template = `const ${fileName} = (req, res, next) => {
  try {
    // Add your middleware logic here
    next();
  } catch (error) {
    next(error);
  }
};

export default ${fileName};
`;

  fs.writeFileSync(filePath, template, "utf-8");
  console.log(chalk.green(`${PREFIX.SUCCESS}${CREATE.CREATED_FILE("Src/Middleware/" + fileName + ".js")}`));

  addExportToIndex(indexPath, fileName, fileName);
  console.log(chalk.green(`${PREFIX.SUCCESS}${CREATE.UPDATED_FILE("Src/Middleware/index.js")}`));

  console.log(chalk.bold.green(`\n${CREATE.MIDDLEWARE_DONE(fileName)}\n`));
}

module.exports = addMiddlewareCommand;
