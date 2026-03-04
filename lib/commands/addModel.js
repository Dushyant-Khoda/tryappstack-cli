const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { ensureInsideProject, addExportToIndex, toPascalCase } = require("../utils/helpers");

function addModelCommand(name) {
    ensureInsideProject();

    const Name = toPascalCase(name);
    const fileName = `${Name}Model`;
    const filePath = path.resolve(process.cwd(), `Src/Models/${fileName}.js`);
    const indexPath = path.resolve(process.cwd(), "Src/Models/index.js");

    if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`\n⚠  ${fileName}.js already exists.\n`));
        process.exit(0);
    }

    const template = `import mongoose from "mongoose";

const ${Name}Schema = new mongoose.Schema(
  {
    // Add your schema fields here
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ${fileName} = mongoose.model("${Name}", ${Name}Schema);
export default ${fileName};
`;

    fs.writeFileSync(filePath, template, "utf-8");
    console.log(chalk.green(`  ✔ Created Src/Models/${fileName}.js`));

    addExportToIndex(indexPath, fileName, fileName);
    console.log(chalk.green(`  ✔ Updated Src/Models/index.js`));

    console.log(chalk.bold.green(`\n✅ Model "${fileName}" created successfully!\n`));
}

module.exports = addModelCommand;
