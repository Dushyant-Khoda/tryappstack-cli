# Setup & Overview

Welcome to your project! Follow the steps below to get started.

---

## Before You Start — Setup Checklist

Complete these steps in order before writing any code:

### 1. Configure Environment Variables

```bash
# Option A: Interactive setup (recommended)
npx tas setup-env

# Option B: Manual setup
cp .env.example config.env
# Then edit config.env with your values
```

**Required variables you must set:**

| Variable | What it is | Where to get it |
|----------|-----------|-----------------|
| `DB_URL` | MongoDB connection string | [MongoDB Atlas](https://www.mongodb.com/atlas) or local: `mongodb://localhost:27017/myapp` |
| `JWT_SECRET` | Secret key for signing tokens | Any random string (keep it long and private) |
| `PORT` | Server port | Default: `3000` |

**Set these when you need email features:**

| Variable | What it is |
|----------|-----------|
| `SMTP_SERVICE` | Email provider (e.g., `gmail`) |
| `SMTP_HOST` | SMTP host (e.g., `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (e.g., `587`) |
| `SMTP_MAIL` | Your email address |
| `SMTP_PASS` | App password ([how to get one](https://support.google.com/accounts/answer/185833)) |

**Set these when you need file uploads:**

| Variable | When to set |
|----------|------------|
| `IS_S3`, `AWS_CLIENT_ID`, `AWS_CLIENT_SECRET`, `AWS_REGION`, `AWS_BUCKET_NAME` | Using AWS S3 |
| `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Using Cloudinary |

> You can add new env variables anytime: `npx tas add-var-env MY_VARIABLE`

---

### 2. Start the Server

```bash
npm start     # or: yarn start
```

You should see the server running at `http://localhost:3000` (or your configured port).

---

### 3. Test the Health Endpoint

```bash
curl http://localhost:3000/health
```

If you get a success response, everything is working.

---

## What's Included

Your project comes with these features ready to use:

| Feature | Details |
|---------|---------|
| **Authentication** | Register, Login, Logout, Forgot/Reset Password with OTP |
| **OTP System** | Email-based (auth) and phone-based (standalone) OTP with rate limiting |
| **File Uploads** | Local, AWS S3, and Cloudinary support |
| **Email Service** | Nodemailer-based email sending |
| **Security** | Helmet, Rate Limiting, CORS, Mongo Sanitize, XSS Protection |
| **Logging** | Morgan + custom Logger with month/date-wise log files |
| **Validation** | Joi-based request validation middleware |
| **Swagger** | API documentation setup |
| **Docker** | Dockerfile + docker-compose.yml |
| **Testing** | Jest + Supertest setup |
| **Linting** | ESLint + Prettier configured |

---

## Documentation Index

| Guide | What you'll learn |
|-------|-------------------|
| [Authentication & OTP](authentication.md) | All auth endpoints, curl examples, adding roles, JWT config |
| [Services](services.md) | How to use Email, OTP, S3, Cloudinary, File Upload services |
| [CLI Usage](cli-usage.md) | Creating modules, naming conventions, validation tips |

---

## Quick Reference — CLI Commands

```bash
npx tas add-module <Name>       # Full module (Controller + Model + Router)
npx tas add-controller <Name>   # Controller only
npx tas add-model <Name>        # Model only
npx tas add-router <Name>       # Router only
npx tas add-middleware <Name>    # Middleware
npx tas add-service <Name>      # Service
npx tas add-utils <Name>        # Utility
npx tas setup-env               # Configure env variables
npx tas add-var-env <VAR>       # Add a new env variable
```

> Add `--skip-doc` to skip auto-generating documentation for modules/routes.

---

## Project Structure

```
├── Config/              → Environment config loader
├── Src/
│   ├── Controller/      → Route handlers (business logic)
│   ├── Loaders/         → Server, Database, Swagger, Morgan setup
│   ├── Middleware/       → Auth, Error handling, Upload, Validation
│   ├── Models/          → Mongoose schemas
│   ├── Routes/          → Express route definitions
│   ├── Services/        → Email, OTP, S3, Cloudinary, File Upload
│   ├── Templates/       → Email/HTML templates
│   ├── Uploads/         → Uploaded files directory
│   ├── Utils/           → Error handler, Logger, Success handler
│   └── Validations/     → Joi request validation schemas
├── docs/                → This documentation
├── tests/               → Jest test files
├── config.env           → Environment variables (edit this!)
└── main.js              → Application entry point
```
