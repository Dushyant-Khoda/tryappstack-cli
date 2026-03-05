# Docker Setup & Commands

This application is fully containerized for both development and production. By using Docker, you eliminate "it works on my machine" issues and get a consistent environment instantly.

## Architecture

The `docker-compose.yml` spins up two services:
1. **app:** The Node.js application container
2. **mongo:** A designated MongoDB container with persistent data volumes

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

---

## 🔥 Quick Start (Local Orchestration)

To spin up the entire application (Node.js API + MongoDB) in one command:

```bash
docker-compose up -d
```

> **Note:** The `-d` flag runs the containers in detached mode (in the background).

### Stopping the Containers
To stop the application and database gracefully:
```bash
docker-compose down
```

---

## 🛠️ Handy Docker Commands

### 1. View Application Logs
If you ran `docker-compose up -d` and want to see your server logs (e.g. to see startup errors or API requests):
```bash
docker-compose logs -f app
```

### 2. Rebuild the Application Container
If you added a new NPM package or changed the `Dockerfile`, you must rebuild the image:
```bash
docker-compose up -d --build
```

### 3. Clear Database Volumes (Reset Data)
To stop the application AND permanently delete all data in the MongoDB volume (Useful for a fresh slate):
```bash
docker-compose down -v
```

---

## 📦 Production Deployment

If you are deploying to a production server (like AWS EC2, DigitalOcean, or Render), you only need to build the API image.

```bash
# 1. Build the production Docker image
docker build -t tryappstack-api .

# 2. Run the container (Make sure to pass your custom ENV file)
docker run -d -p 3000:3000 --env-file config.env tryappstack-api
```
