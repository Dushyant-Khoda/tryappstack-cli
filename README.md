# TryAppStack CLI

![npm version](https://img.shields.io/npm/v/tryappstack)
![downloads](https://img.shields.io/npm/dm/tryappstack)
![license](https://img.shields.io/npm/l/tryappstack)

TryAppStack CLI is a developer tool that helps you quickly create production-ready applications using modern boilerplates.

Instead of manually setting up folder structures, dependencies, and architecture, TryAppStack generates a complete project in seconds.

## Installation

Install globally:

```bash
npm install -g tryappstack
```

Or run with `npx`:

```bash
npx tryappstack init
```

## Usage

Create a new project:

```bash
tas init
```

Show CLI version:

```bash
tas --version
```

Show help:

```bash
tas --help
```

You will see an interactive menu to choose your project stack. Only **Node API (MongoDB + JS)** is available today; other stacks are marked **Coming Soon**.

After you select a stack and answer a few questions (project name, port, database URL, etc.), TryAppStack will create the project folder and install dependencies.

## CLI Commands

| Command | Alias | Description |
|--------|--------|-------------|
| `tas init` | `i` | Scaffold a new project from a stack template |
| `tas setup-env` | `env` | Set up environment variables in `config.env` |
| `tas add-var-env <name>` | `addenv` | Add a new env variable to config |
| `tas add-controller <name>` | `c` | Create a new controller |
| `tas add-model <name>` | `m` | Create a new Mongoose model |
| `tas add-router <name>` | `r` | Create a new Express router |
| `tas add-module <name>` | `mod` | Create controller + model + router |
| `tas add-middleware <name>` | `mid` | Create a new middleware |
| `tas add-service <name>` | `s` | Create a new service |
| `tas add-utils <name>` | `u` | Create a new utility module |
| `tas add-templates <name>` | `tpl` | Create a new HTML template |

The `add-*` commands are meant to be run **inside** a project that was created with `tas init`.

## Available Templates

- **Node API (MongoDB + JS)** — Express + Mongoose + JWT + Swagger. Ready to use.
- **Node API (MongoDB + TypeScript)** — Coming Soon
- **Node API (TypeORM + PostgreSQL)** — Coming Soon
- **Node API (TypeORM + MySQL)** — Coming Soon
- **React App** — Coming Soon
- **Electron App** — Coming Soon

## Contribution

We welcome contributions. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:

- How to contribute
- How to add a new template
- How to improve CLI commands

## Future Roadmap

- TypeScript backend templates
- Next.js fullstack templates
- Docker-ready boilerplates
- Authentication modules
- Redis integration
- Microservice templates
- CI/CD starter templates

## License

MIT. See [LICENSE](LICENSE) for details.
