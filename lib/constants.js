/**
 * Centralized CLI log messages.
 *
 * Every user-facing string lives here. Commands import what they need
 * instead of scattering inline strings across the codebase.
 */

// ── Prefixes ────────────────────────────────────────────────────────
const PREFIX = {
    SUCCESS: "  + ",
    WARN: "  warn ",
    ERROR: "  error ",
    INFO: "  > ",
    ITEM: "    - ",
};

// ── Generic ─────────────────────────────────────────────────────────
const GENERIC = {
    NOT_INSIDE_PROJECT: "This command must be run inside a project created by TryAppStack.",
    SRC_NOT_FOUND: "Could not find Src/ directory.",
    FILE_ALREADY_EXISTS: (name) => `${name} already exists. Skipping.`,
    INDEX_ALREADY_HAS: (name) => `${name} already exported in index.js. Skipping.`,
    LOADER_ALREADY_HAS: (name) => `${name} already registered in ServerLoader.js. Skipping.`,
};

// ── Init ────────────────────────────────────────────────────────────
const INIT = {
    PROJECT_CREATED: "Project created successfully.",
    SECTION_NEXT_STEPS: "What to do next",
    STEP_CD: (name) => `cd ${name}`,
    STEP_ENV: "npx tas setup-env",
    STEP_ENV_ALT: "or edit config.env manually",
    STEP_START: (cmd) => cmd,
    STEP_TEST: "curl http://localhost:3000/health",
    SECTION_INCLUDED: "Included out of the box",
    INCLUDED_AUTH: "Authentication  Register, Login, Forgot/Reset Password",
    INCLUDED_OTP: "OTP             Email and phone-based verification",
    INCLUDED_UPLOAD: "File Uploads    Local, S3, Cloudinary",
    INCLUDED_EMAIL: "Email           Nodemailer with SMTP",
    INCLUDED_SECURITY: "Security        Helmet, CORS, Rate Limiting, XSS, NoSQL Sanitize",
    INCLUDED_TOOLING: "Tooling         Docker, Jest, ESLint, Prettier",
    SECTION_DOCS: "Documentation",
    DOC_SETUP: "docs/setup.md           Setup checklist and overview",
    DOC_AUTH: "docs/authentication.md  Auth and OTP endpoints",
    DOC_SERVICES: "docs/services.md        Email, S3, Cloudinary usage",
    DOC_CLI: "docs/cli-usage.md       CLI commands and patterns",
    DOC_DOCKER: "docs/docker.md          Docker orchestration and setup",
    SECTION_COMMANDS: "Commands",
    CMD_MODULE: "tas add-module <Name>     Full module (controller + model + router)",
    CMD_ROUTER: "tas add-router <Name>     Express router",
    CMD_ENV: "tas setup-env             Configure env variables",
    CMD_VAR: "tas add-var-env <VAR>     Add env variable",
    SKIP_DOC_HINT: "Add --skip-doc to skip auto-generating documentation.",
    COPYING_FILES: "Copying project files...",
    FILES_COPIED: "Project files copied.",
    CONFIGURING_PKG: "Configuring package.json...",
    PKG_CONFIGURED: "package.json configured.",
    SETTING_ENV: "Setting up environment variables...",
    ENV_SET: "Environment variables configured.",
    ENV_NOT_FOUND: "No env file found in template. Skipping.",
    SETTING_GIT: "Setting up git repository...",
    GIT_DONE: "Git repository initialized.",
    GIT_SKIPPED: "Git not available. Skipping.",
    INSTALLING_DEPS: (pm) => `Installing dependencies with ${pm}...`,
    DEPS_INSTALLED: "Dependencies installed.",
    DEPS_FAILED: (pm, name) => `Failed to install dependencies. Run manually: cd ${name} && ${pm === "yarn" ? "yarn" : "npm install"}`,
    COPY_FAILED: "Failed to copy template files.",
    PKG_FAILED: "Failed to configure package.json.",
    ENV_FAILED: "Failed to set up environment variables.",
    TEMPLATE_NOT_FOUND: "Template not found.",
    COMING_SOON: "This stack is coming soon. Stay tuned for future releases.",
};

// ── Component creation ──────────────────────────────────────────────
const CREATE = {
    CREATING_MODULE: (name) => `Creating module: ${name}`,
    MODULE_DONE: (name) => `Module ${name} created.`,
    CONTROLLER_DONE: (name) => `Controller ${name} created.`,
    MODEL_DONE: (name) => `Model ${name} created.`,
    ROUTER_DONE: (name) => `Router ${name} created.`,
    MIDDLEWARE_DONE: (name) => `Middleware ${name} created.`,
    SERVICE_DONE: (name) => `Service ${name} created.`,
    UTIL_DONE: (name) => `Utility ${name} created.`,
    TEMPLATE_DONE: (name) => `Template ${name} created.`,
    CREATED_FILE: (path) => `Created ${path}`,
    UPDATED_FILE: (path) => `Updated ${path}`,
    GENERATED_DOC: (path) => `Generated ${path}`,
    SECTION_CREATED: "Created",
    SECTION_UPDATED: "Updated",
    SECTION_DOCS: "Documentation",
};

// ── Environment ─────────────────────────────────────────────────────
const ENV = {
    SETUP_TITLE: "Configure environment variables",
    SETUP_HINT: "Press Enter to keep the current/default value.",
    CONFIG_NOT_FOUND: "config.env not found.",
    CONFIG_INDEX_NOT_FOUND: "Config/index.js not found.",
    VAR_ALREADY_EXISTS: (key) => `${key} already exists in config.env.`,
    VAR_ADDED_ENV: (key) => `Added ${key} to config.env`,
    VAR_ADDED_CONFIG: (key) => `Added ${key} to Config/index.js`,
    VAR_ALREADY_IN_CONFIG: (key) => `${key} already exists in Config/index.js`,
    ENV_UPDATED: "config.env updated.",
    VAR_DONE: (key) => `Environment variable ${key} added.`,
};

module.exports = {
    PREFIX,
    GENERIC,
    INIT,
    CREATE,
    ENV,
};
