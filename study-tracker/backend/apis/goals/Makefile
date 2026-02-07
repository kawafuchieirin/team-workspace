.PHONY: up down test logs generate-spec

up:
	docker compose up --build -d

down:
	docker compose down

test:
	poetry run pytest tests/ -v

logs:
	docker compose logs -f

generate-spec:
	poetry run python generate_specification.py > openapi.json
