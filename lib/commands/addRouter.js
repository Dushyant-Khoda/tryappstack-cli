const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const {
    ensureInsideProject,
    addExportToIndex,
    addImportToServerLoader,
    toPascalCase,
} = require("../utils/helpers");

function addRouterCommand(name) {
    ensureInsideProject();

    const Name = toPascalCase(name);
    const fileName = `${Name}Routes`;
    const controllerName = `${Name}Controller`;
    const filePath = path.resolve(process.cwd(), `Src/Routes/${fileName}.js`);
    const indexPath = path.resolve(process.cwd(), "Src/Routes/index.js");

    if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`\n⚠  ${fileName}.js already exists.\n`));
        process.exit(0);
    }

    const template = `import express from "express";
import { AuthenticationMiddleware } from "../Middleware";
import { ${controllerName} } from "../Controller";
const router = express.Router();

router.post("/", ${controllerName}.add${Name}Worker);
router.get("/", ${controllerName}.list${Name}Worker);
router.get("/:id", ${controllerName}.get${Name}Worker);
router.put("/:id", ${controllerName}.update${Name}Worker);
router.delete("/:id", ${controllerName}.delete${Name}Worker);

export default router;
`;

    fs.writeFileSync(filePath, template, "utf-8");
    console.log(chalk.green(`  ✔ Created Src/Routes/${fileName}.js`));

    addExportToIndex(indexPath, fileName, fileName);
    console.log(chalk.green(`  ✔ Updated Src/Routes/index.js`));

    addImportToServerLoader(Name);
    console.log(chalk.green(`  ✔ Updated Src/Loaders/ServerLoader.js`));

    console.log(chalk.bold.green(`\n✅ Router "${fileName}" created successfully!\n`));
}

module.exports = addRouterCommand;
