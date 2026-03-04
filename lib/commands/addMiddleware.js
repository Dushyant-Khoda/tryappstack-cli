const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { ensureInsideProject, addExportToIndex, toPascalCase } = require("../utils/helpers");

function addMiddlewareCommand(name) {
    ensureInsideProject();

    const Name = toPascalCase(name);
    const fileName = `${Name}Middleware`;
    const filePath = path.resolve(process.cwd(), `Src/Middleware/${fileName}.js`);
    const indexPath = path.resolve(process.cwd(), "Src/Middleware/index.js");

    if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`\n⚠  ${fileName}.js already exists.\n`));
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
    console.log(chalk.green(`  ✔ Created Src/Middleware/${fileName}.js`));

    addExportToIndex(indexPath, fileName, fileName);
    console.log(chalk.green(`  ✔ Updated Src/Middleware/index.js`));

    console.log(chalk.bold.green(`\n✅ Middleware "${fileName}" created successfully!\n`));
}

module.exports = addMiddlewareCommand;
