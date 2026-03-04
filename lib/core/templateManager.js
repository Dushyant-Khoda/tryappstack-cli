const path = require("path");
const fs = require("fs-extra");

const TEMPLATES_DIR = path.join(__dirname, "..", "..", "templates");

/**
 * Stack definitions for the CLI.
 * id: used as folder name and selection value
 * name: display name in the menu
 * comingSoon: if true, template is not available yet
 */
const STACKS = [
    { id: "node-mongo-js", name: "Node API (MongoDB + JS)", comingSoon: false },
    { id: "node-mongo-ts", name: "Node API (MongoDB + TypeScript)", comingSoon: true },
    { id: "node-typeorm-postgres", name: "Node API (TypeORM + PostgreSQL)", comingSoon: true },
    { id: "node-typeorm-mysql", name: "Node API (TypeORM + MySQL)", comingSoon: true },
    { id: "react-app", name: "React App", comingSoon: true },
    { id: "electron-app", name: "Electron App", comingSoon: true },
];

function readTemplateConfig(stackId) {
    try {
        const configPath = path.join(TEMPLATES_DIR, stackId, "template.config.json");
        if (!fs.existsSync(configPath)) {
            return null;
        }
        return fs.readJsonSync(configPath);
    } catch {
        return null;
    }
}

/**
 * Get all available stacks with their display names and coming-soon status.
 * @returns {Array<{ id: string, name: string, comingSoon: boolean }>}
 */
function getStacks() {
    return STACKS.map((s) => {
        const config = readTemplateConfig(s.id) || {};
        return {
            id: s.id,
            name: s.name,
            comingSoon: s.comingSoon,
            version: config.version || null,
            templateDescription: config.description || null,
        };
    });
}

/**
 * Get the absolute path to a template folder if it is available.
 * @param {string} stackId - Stack id (e.g. 'node-mongo-js')
 * @returns {string|null} Absolute path to template directory, or null if coming soon / not found
 */
function getTemplatePath(stackId) {
    const stack = STACKS.find((s) => s.id === stackId);
    if (!stack || stack.comingSoon) {
        return null;
    }
    const templatePath = path.join(TEMPLATES_DIR, stackId);
    if (!fs.existsSync(templatePath)) {
        return null;
    }
    return templatePath;
}

/**
 * Check if a stack is available (not coming soon).
 * @param {string} stackId
 * @returns {boolean}
 */
function isStackAvailable(stackId) {
    const stack = STACKS.find((s) => s.id === stackId);
    return stack && !stack.comingSoon;
}

module.exports = {
    getStacks,
    getTemplatePath,
    isStackAvailable,
    TEMPLATES_DIR,
};
