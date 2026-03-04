# Node API (MongoDB + JavaScript)

A production-ready Node.js backend template with Express, MongoDB (Mongoose), JWT auth, and common services.

## Environment Variables

**Never commit real credentials.** This template ships with `.env.example` only. When you scaffold with TryAppStack, a `config.env` file is created from it.

### Setup

1. Copy `.env.example` to `config.env` in the project root (or use `npx tas setup-env` after scaffolding).
2. Replace placeholder values in `config.env` with your real values.

### Required variables

| Variable     | Description                    | Example                    |
| ------------ | ------------------------------ | -------------------------- |
| `PORT`       | Server port                    | `3000`                     |
| `DB_URL`     | MongoDB connection string      | `mongodb://localhost:27017/myapp` |
| `JWT_SECRET` | Secret for signing JWT tokens  | Use a long random string   |

### Optional (for features)

- **Email:** `SMTP_HOST`, `SMTP_MAIL`, `SMTP_PASS`, `SMTP_PORT`, `SMTP_SERVICE`
- **AWS S3:** `AWS_CLIENT_ID`, `AWS_CLIENT_SECRET`, `AWS_REGION`, `AWS_BUCKET_NAME`, `IS_S3=true`
- **Cloudinary:** `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`

The app loads `config.env` via `dotenv` in `Config/index.js`. Keep `config.env` in `.gitignore` and never commit it.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT, optional OTP
- **Storage:** AWS S3 / Cloudinary / local (configurable)
- **Validation:** Joi
- **API docs:** Swagger-ready

## Project structure

```
Config/           → Environment config loader
Src/
  Controller/     → Route handlers
  Loaders/        → DB, Server, Swagger, Morgan
  Middleware/     → Auth, Error, Upload, Validation
  Models/         → Mongoose schemas
  Routes/         → Express routes
  Services/       → Email, S3, Cloudinary, OTP, etc.
  Templates/      → Email/HTML templates
  Utils/          → Error handler, Logger, Helpers
main.js           → Entry point
config.env        → Your env vars (create from .env.example)
```

## Run

```bash
npm install   # or yarn
npm start    # or yarn start
```

## Commands (from project root)

Use TryAppStack CLI to add modules, controllers, models, etc.:

```bash
npx tas add-module <Name>
npx tas add-controller <Name>
npx tas add-model <Name>
npx tas add-router <Name>
npx tas setup-env
```
