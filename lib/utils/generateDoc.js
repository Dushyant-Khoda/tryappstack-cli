const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { toPascalCase } = require("./helpers");
const { CREATE, PREFIX } = require("../../lib/constants");

/**
 * Generate a documentation file for a module, router, or controller.
 *
 * @param {string} name - Raw name (e.g. "product")
 * @param {Object} options
 * @param {"module"|"router"|"controller"} options.type - What was generated
 * @param {string[]} [options.createdFiles] - List of created file paths
 * @param {string[]} [options.updatedFiles] - List of updated file paths
 */
function generateDoc(name, options = {}) {
    const Name = toPascalCase(name);
    const type = options.type || "module";
    const docsDir = path.resolve(process.cwd(), "docs/modules");
    const docPath = path.join(docsDir, `${Name}.md`);

    // Ensure docs/modules directory exists
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }

    const routeBase = `/api/v1.0/${name.toLowerCase()}`;
    const controllerName = `${Name}Controller`;
    const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    let content = `# ${Name} Module\n\n`;
    content += `> Auto-generated on ${now} by TryAppStack CLI\n\n`;

    // Created / Updated files
    if (options.createdFiles && options.createdFiles.length > 0) {
        content += `## Created Files\n\n`;
        options.createdFiles.forEach((f) => {
            content += `- \`${f}\`\n`;
        });
        content += `\n`;
    }

    if (options.updatedFiles && options.updatedFiles.length > 0) {
        content += `## Updated Files\n\n`;
        options.updatedFiles.forEach((f) => {
            content += `- \`${f}\`\n`;
        });
        content += `\n`;
    }

    // Routes section (for module and router types)
    if (type === "module" || type === "router") {
        content += `## Routes\n\n`;
        content += `| Method | Endpoint | Handler |\n`;
        content += `|--------|----------|--------|\n`;
        content += `| POST | \`${routeBase}/\` | \`${controllerName}.add${Name}Worker\` |\n`;
        content += `| GET | \`${routeBase}/\` | \`${controllerName}.list${Name}Worker\` |\n`;
        content += `| GET | \`${routeBase}/:id\` | \`${controllerName}.get${Name}Worker\` |\n`;
        content += `| PUT | \`${routeBase}/:id\` | \`${controllerName}.update${Name}Worker\` |\n`;
        content += `| DELETE | \`${routeBase}/:id\` | \`${controllerName}.delete${Name}Worker\` |\n`;
        content += `\n`;

        // Curl examples
        content += `## Curl Examples\n\n`;

        content += `### Create ${Name}\n\n`;
        content += `\`\`\`bash\n`;
        content += `curl -X POST http://localhost:3000${routeBase}/ \\\n`;
        content += `  -H "Content-Type: application/json" \\\n`;
        content += `  -d '{"name": "example"}'\n`;
        content += `\`\`\`\n\n`;

        content += `### List All ${Name}s\n\n`;
        content += `\`\`\`bash\n`;
        content += `curl -X GET http://localhost:3000${routeBase}/\n`;
        content += `\`\`\`\n\n`;

        content += `### Get ${Name} by ID\n\n`;
        content += `\`\`\`bash\n`;
        content += `curl -X GET http://localhost:3000${routeBase}/<id>\n`;
        content += `\`\`\`\n\n`;

        content += `### Update ${Name}\n\n`;
        content += `\`\`\`bash\n`;
        content += `curl -X PUT http://localhost:3000${routeBase}/<id> \\\n`;
        content += `  -H "Content-Type: application/json" \\\n`;
        content += `  -d '{"name": "updated"}'\n`;
        content += `\`\`\`\n\n`;

        content += `### Delete ${Name}\n\n`;
        content += `\`\`\`bash\n`;
        content += `curl -X DELETE http://localhost:3000${routeBase}/<id>\n`;
        content += `\`\`\`\n`;
    }

    // Controller-only type
    if (type === "controller") {
        content += `## Controller Methods\n\n`;
        content += `| Method | Description |\n`;
        content += `|--------|-------------|\n`;
        content += `| \`add${Name}Worker\` | Create a new ${Name} |\n`;
        content += `| \`list${Name}Worker\` | List all ${Name}s |\n`;
        content += `| \`get${Name}Worker\` | Get a single ${Name} by ID |\n`;
        content += `| \`update${Name}Worker\` | Update a ${Name} by ID |\n`;
        content += `| \`delete${Name}Worker\` | Delete a ${Name} by ID |\n`;
        content += `\n`;
        content += `> Create a router for this controller to expose these methods as API endpoints:\n`;
        content += `> \`\`\`bash\n`;
        content += `> npx tas add-router ${name}\n`;
        content += `> \`\`\`\n`;
    }

    fs.writeFileSync(docPath, content, "utf-8");
    console.log(chalk.green(`${PREFIX.SUCCESS}${CREATE.GENERATED_DOC("docs/modules/" + Name + ".md")}`));
}

module.exports = { generateDoc };
