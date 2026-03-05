const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const {
    ensureInsideProject,
    addExportToIndex,
    addImportToServerLoader,
    toPascalCase,
} = require("../utils/helpers");
const { generateDoc } = require("../utils/generateDoc");
const { CREATE, GENERIC, PREFIX } = require("../../lib/constants");

function addRouterCommand(name, options = {}) {
    ensureInsideProject();

    const Name = toPascalCase(name);
    const skipDoc = options.skipDoc || false;
    const fileName = `${Name}Routes`;
    const controllerName = `${Name}Controller`;
    const filePath = path.resolve(process.cwd(), `Src/Routes/${fileName}.js`);
    const indexPath = path.resolve(process.cwd(), "Src/Routes/index.js");

    if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`\n${PREFIX.WARN}${GENERIC.FILE_ALREADY_EXISTS(fileName + ".js")}\n`));
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
    console.log(chalk.green(`${PREFIX.SUCCESS}${CREATE.CREATED_FILE("Src/Routes/" + fileName + ".js")}`));

    addExportToIndex(indexPath, fileName, fileName);
    console.log(chalk.green(`${PREFIX.SUCCESS}${CREATE.UPDATED_FILE("Src/Routes/index.js")}`));

    addImportToServerLoader(Name);
    console.log(chalk.green(`${PREFIX.SUCCESS}${CREATE.UPDATED_FILE("Src/Loaders/ServerLoader.js")}`));

    // Generate router documentation
    if (!skipDoc) {
        generateDoc(name, {
            type: "router",
            createdFiles: [`Src/Routes/${fileName}.js`],
            updatedFiles: [
                "Src/Routes/index.js",
                "Src/Loaders/ServerLoader.js",
            ],
        });
    }

    console.log(chalk.bold.green(`\n${CREATE.ROUTER_DONE(fileName)}\n`));
}

module.exports = addRouterCommand;
