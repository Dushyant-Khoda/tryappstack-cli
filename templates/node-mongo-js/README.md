# TryAppStack – Node.js + MongoDB (JavaScript)

A production-ready Node.js API boilerplate with MongoDB, built using Express and Babel.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example config.env   # or .env

# Start development server
npm run dev
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm start` | Start with nodemon (auto-restart) |
| `npm test` | Run tests with Jest |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without writing |

## Security Features

The template includes production-grade security middleware wired in `ServerLoader`:

- **Helmet** – Sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.)
- **Rate Limiting** – Configurable request rate limiter (default: 100 req / 15 min)
- **CORS** – Cross-Origin Resource Sharing with credentials
- **Mongo Sanitize** – Prevents NoSQL injection by stripping `$` and `.` from input
- **XSS Clean** – Sanitizes user input to prevent cross-site scripting attacks

## Health Check

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Liveness probe – returns uptime, timestamp, environment |
| `GET /health/ready` | Readiness probe – verifies database connectivity |

## Testing

Tests live in the `tests/` directory and use **Jest** + **Supertest**:

```bash
npm test                  # Run all tests
npm run test:coverage     # Run with coverage report
```

- `tests/health.test.js` – Health endpoint tests
- `tests/user.test.js` – User CRUD route stubs (fill in as controllers are implemented)

## Docker

```bash
# Build and run with Docker Compose (app + MongoDB)
docker-compose up -d

# Stop
docker-compose down

# Build image only
docker build -t tryappstack-api .
```

The `docker-compose.yml` includes:
- **app** – Node.js API container
- **mongo** – MongoDB 7 with persistent volume

## CI/CD

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to `main`/`develop`:
- Lints code with ESLint
- Runs test suite with Jest
- Tests against Node.js 18 and 20
- Uses a MongoDB service container

## Project Structure

```
├── Config/                 # Environment configuration
├── Src/
│   ├── Controller/         # Route handlers
│   ├── Loaders/            # Server, database, morgan config
│   ├── Middleware/         # Auth, error, upload, validation
│   ├── Models/             # Mongoose models
│   ├── Routes/             # Express routers (user, health)
│   ├── Services/           # Business logic (email, upload, OTP)
│   └── Utils/              # Logger, error handler, success handler
├── tests/                  # Jest test suites
├── Dockerfile              # Production Docker image
├── docker-compose.yml      # App + MongoDB orchestration
├── jest.config.js          # Jest configuration
├── main.js                 # Application entry point
└── package.json
```

## Environment Variables

Copy `.env.example` to `config.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DEBUG_MODE` | Show detailed errors | `true` |
| `DB_URL` | MongoDB connection string | – |
| `JWT_SECRET` | JWT signing secret | – |
| `JWT_EXPIRE` | JWT expiry duration | `2d` |
| `LOG_STORAGE_STRATEGY` | Log grouping: `month` or `date` | `month` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |

See `.env.example` for the full list including AWS, SMTP, and Cloudinary settings.

## License

MIT
