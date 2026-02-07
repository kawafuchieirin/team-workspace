.PHONY: up down build logs test-records test-goals test-backend test-frontend test restart generate-spec

up:
	docker compose up --build -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

logs-records:
	docker compose logs -f records-api

logs-goals:
	docker compose logs -f goals-api

logs-frontend:
	docker compose logs -f frontend

test-records:
	cd backend/apis/records && poetry run pytest tests/ -v

test-goals:
	cd backend/apis/goals && poetry run pytest tests/ -v

test-backend: test-records test-goals

test-frontend:
	cd frontend && npm test -- --run

test: test-backend test-frontend

restart:
	docker compose restart

restart-records:
	docker compose restart records-api

restart-goals:
	docker compose restart goals-api

restart-frontend:
	docker compose restart frontend

generate-spec:
	cd backend/apis/records && poetry run python generate_specification.py > openapi.json
	cd backend/apis/goals && poetry run python generate_specification.py > openapi.json
