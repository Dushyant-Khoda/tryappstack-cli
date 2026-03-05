const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { GENERIC, PREFIX } = require("../../lib/constants");

/**
 * Verify we're inside a scaffolded project by checking for Src/ directory.
 */
function ensureInsideProject() {
    const srcDir = path.resolve(process.cwd(), "Src");
    if (!fs.existsSync(srcDir)) {
        console.log(
            chalk.red(`\n${PREFIX.ERROR}${GENERIC.NOT_INSIDE_PROJECT}`)
        );
        console.log(chalk.gray(`   ${GENERIC.SRC_NOT_FOUND}\n`));
        process.exit(1);
    }
}

/**
 * Append an export line to an index.js barrel file.
 * Pattern: export { default as ExportName } from './FileName';
 */
function addExportToIndex(indexPath, exportName, fileName) {
    const line = `export { default as ${exportName} } from './${fileName}';\n`;

    if (!fs.existsSync(indexPath)) {
        fs.writeFileSync(indexPath, line, "utf-8");
        return;
    }

    const content = fs.readFileSync(indexPath, "utf-8");
    if (content.includes(`from './${fileName}'`)) {
        console.log(chalk.yellow(`${PREFIX.WARN}${GENERIC.INDEX_ALREADY_HAS(exportName)}`));
        return;
    }

    fs.writeFileSync(indexPath, content.trimEnd() + "\n" + line, "utf-8");
}

/**
 * Add import and app.use() line to ServerLoader.js for a new route.
 * @param {string} routeName - e.g. "Product" → imports ProductRoutes, uses /api/v1.0/product
 */
function addImportToServerLoader(routeName) {
    const serverLoaderPath = path.resolve(process.cwd(), "Src/Loaders/ServerLoader.js");

    if (!fs.existsSync(serverLoaderPath)) {
        console.log(chalk.red(`${PREFIX.ERROR}Src/Loaders/ServerLoader.js not found.`));
        return;
    }

    let content = fs.readFileSync(serverLoaderPath, "utf-8");
    const routeExportName = `${routeName}Routes`;
    const routePath = `"/api/v1.0/${routeName.toLowerCase()}"`;

    if (content.includes(routeExportName)) {
        console.log(
            chalk.yellow(`${PREFIX.WARN}${GENERIC.LOADER_ALREADY_HAS(routeExportName)}`)
        );
        return;
    }

    const importRegex = /import\s*\{([^}]*)\}\s*from\s*["']\.\.\/Routes["'];?/;
    const importMatch = content.match(importRegex);

    if (importMatch) {
        const existingImports = importMatch[1].trim().replace(/,\s*$/, "");
        const newImports = existingImports
            ? `${existingImports},\n  ${routeExportName}`
            : routeExportName;
        content = content.replace(
            importRegex,
            `import {\n  ${newImports.replace(/,\s*/g, ",\n  ")},\n} from "../Routes";`
        );
    } else {
        const lastImportIdx = content.lastIndexOf("import ");
        const lineEnd = content.indexOf("\n", lastImportIdx);
        content =
            content.slice(0, lineEnd + 1) +
            `import { ${routeExportName} } from "../Routes";\n` +
            content.slice(lineEnd + 1);
    }

    const appUseRegex = /(app\.use\([^)]*Routes\);?\s*\n)/g;
    let lastAppUseMatch;
    let match;
    while ((match = appUseRegex.exec(content)) !== null) {
        lastAppUseMatch = match;
    }

    if (lastAppUseMatch) {
        const insertPos = lastAppUseMatch.index + lastAppUseMatch[0].length;
        const appUseLine = `    app.use(${routePath}, ${routeExportName});\n`;
        content = content.slice(0, insertPos) + appUseLine + content.slice(insertPos);
    } else {
        const configCloseIdx = content.lastIndexOf("  }");
        if (configCloseIdx !== -1) {
            const appUseLine = `\n    app.use(${routePath}, ${routeExportName});\n`;
            content = content.slice(0, configCloseIdx) + appUseLine + content.slice(configCloseIdx);
        }
    }

    fs.writeFileSync(serverLoaderPath, content, "utf-8");
}

/**
 * Convert input name to PascalCase.
 * e.g. "product" → "Product", "user-profile" → "UserProfile"
 */
function toPascalCase(str) {
    return str
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/\s+/g, "");
}

module.exports = {
    ensureInsideProject,
    addExportToIndex,
    addImportToServerLoader,
    toPascalCase,
};
