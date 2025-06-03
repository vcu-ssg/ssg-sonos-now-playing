# Makefile at project root

# General
.PHONY: all build clean

all: build-frontend build-backend docker-build

# Build frontend dist locally using Vite
build-frontend:
	cd frontend && npm install && npm run build

# Build backend wheel using Poetry
build-backend:
	cd backend && poetry install && poetry build

# Build Docker containers using Dockerfiles in ./docker
docker-build:
	docker build -t kiosk-backend -f docker/backend.dockerfile .
	docker build -t kiosk-frontend -f docker/frontend.dockerfile .

# Run containers using Docker Compose
up:
	docker compose -f docker/docker-compose.yml up --build

# Stop containers
down:
	docker compose -f docker/docker-compose.yml down

# Clean dist and build artifacts
clean:
	rm -rf backend/dist
	rm -rf frontend/dist
