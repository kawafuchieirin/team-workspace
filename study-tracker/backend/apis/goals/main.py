from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    dynamodb_endpoint: str = "http://localhost:8000"
    dynamodb_region: str = "ap-northeast-1"
    aws_access_key_id: str = "dummy"
    aws_secret_access_key: str = "dummy"
    cors_origins: str = "http://localhost:5173"
    default_user_id: str = "default-user"
    goals_table_name: str = "study-tracker-goals"
    records_table_name: str = "study-tracker-records"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()

app = FastAPI(title="Goals API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


from handler import router  # noqa: E402

app.include_router(router, prefix="/api/v1/goals", tags=["goals"])
