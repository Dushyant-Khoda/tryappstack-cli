# Contributing to TryAppStack

Thank you for your interest in contributing. This guide explains how you can help.

## How to Contribute

### 1. Fork the repository

Click **Fork** on the [TryAppStack GitHub repository](https://github.com/Dushyant-Khoda/tryappstack) and clone your fork locally:

```bash
git clone https://github.com/Dushyant-Khoda/tryappstack.git
cd tryappstack
```

### 2. Create a new branch

Create a branch for your change:

```bash
git checkout -b feature/your-feature-name
```

Use a clear name, e.g. `feature/add-node-ts-template` or `fix/init-env-file`.

### 3. Install dependencies

```bash
npm install
```

### 4. Make your changes

- Write clean, simple code.
- Follow the existing style (ESLint and Prettier are set up; run `npm run lint` if available).
- Keep documentation and comments in plain English.

### 5. Test locally

Run the CLI from the project root:

```bash
node bin/cli.js init
```

Create a test project and confirm everything works as expected.

### 6. Submit a pull request

- Commit your changes with a clear message.
- Push to your fork and open a **Pull Request** against the main repository.
- Describe what you changed and why.

---

## How to Add a New Template

1. **Create a template folder** under `templates/`, e.g. `templates/node-mongo-ts/`.

2. **Add your stack files** (package.json, source code, config, etc.) inside that folder. Do not include:
   - Real credentials or API keys
   - `node_modules`
   - Use `.env.example` for required environment variables

3. **Register the stack** in `lib/core/templateManager.js`:
   - Add a new entry to the `STACKS` array with `id`, `name`, and `comingSoon: false` when the template is ready.

4. **Optional:** If your template uses a different env file name or structure, update `lib/core/projectCreator.js` so it correctly copies and updates env/config for the new template.

5. **Document the template** with a `README.md` inside the template folder explaining setup and environment variables.

---

## How to Improve CLI Commands

- **New commands:** Add a new file in `lib/commands/` (e.g. `myCommand.js`) and register it in `bin/cli.js` with `program.command(...)`.
- **Shared logic:** Put helpers in `lib/utils/helpers.js` or `lib/utils/logger.js`.
- **Template selection / project creation:** Core logic lives in `lib/core/templateManager.js` and `lib/core/projectCreator.js`.

Keep commands focused and document them in the main README.

---

## Code Quality

- Pre-commit hooks run **ESLint** and **Prettier** on staged files. Fix any reported issues before committing.
- Use simple English in comments and docs.

---

## Questions?

Open an [issue](https://github.com/Dushyant-Khoda/tryappstack/issues) for bugs or feature ideas.

Thank you for contributing.
