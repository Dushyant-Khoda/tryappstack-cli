# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

# [Unreleased]

## Added

### Authentication

* Added user registration and login support.
* Implemented token generation for authenticated sessions.
* Added OTP verification for phone and email.
* Added password reset using OTP.
* Added Joi validation for authentication and OTP routes.

### Testing

* Added Jest and Supertest for API testing.
* Added a `tests/` directory with base configuration.
* Added initial test examples such as `health.test.js`.

### Security

* Added Helmet middleware for HTTP header security.
* Added express-rate-limit for request rate limiting.
* Added mongo-sanitize and xss-clean to prevent injection attacks.
* Added configurable CORS middleware.

### Docker

* Added Dockerfile for containerized deployments.
* Added docker-compose configuration for local API and MongoDB setup.
* Added `.dockerignore` for optimized Docker builds.

### Monitoring

* Added `/health` endpoint for service status.
* Added `/health/ready` endpoint for readiness checks.

---

## Changed

### CLI Improvements

* Improved CLI output for better readability.
* Removed unnecessary visual elements from CLI output.
* Moved CLI messages to a centralized constants file.

### API Message Handling

* Added `src/constants/Messages.js` for centralized API messages.
* Controllers and services now use message constants instead of inline text.

### Logging

* Updated internal logs to follow a structured format.

Example:

```
[FileUpload] Upload started
[Cloudinary] File uploaded successfully
```

### Environment Variables

Updated Cloudinary environment variable names:

| Old Name      | New Name           |
| ------------- | ------------------ |
| CLOUD_NAME    | CLOUDINARY_NAME    |
| CLOUD_API_KEY | CLOUDINARY_API_KEY |

---

## Documentation

Added documentation in the `docs/` directory:

* `setup.md` – Project setup instructions
* `authentication.md` – Authentication and OTP usage
* `services.md` – Email, AWS S3, and Cloudinary configuration
* `cli-usage.md` – CLI command usage

Updated the root `README.md` with clearer setup instructions.

---

## Fixed

* Fixed an issue in the CLI `init` command related to inquirer prompt structure.
* Removed duplicate documentation paths.
* Cleaned formatting issues in documentation files.