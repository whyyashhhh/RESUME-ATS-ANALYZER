from functools import lru_cache
import os
from pathlib import Path

from pydantic import BaseModel, Field


def _split_csv(value: str | None, fallback: list[str]) -> list[str]:
    if not value:
        return fallback
    parsed = [item.strip() for item in value.split(',') if item.strip()]
    return parsed or fallback


class Settings(BaseModel):
    app_name: str = os.getenv('APP_NAME', 'AI Resume Analyzer')
    app_env: str = os.getenv('APP_ENV', 'development')
    database_url: str = os.getenv(
        'DATABASE_URL',
        'postgresql+psycopg://postgres:postgres@localhost:5432/resume_analyzer',
    )
    jwt_secret_key: str = os.getenv('JWT_SECRET_KEY', 'change-me')
    jwt_algorithm: str = os.getenv('JWT_ALGORITHM', 'HS256')
    access_token_expire_minutes: int = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '60'))
    gemini_api_key: str = os.getenv('GEMINI_API_KEY', '')
    chroma_persist_directory: str = os.getenv('CHROMA_PERSIST_DIRECTORY', './chroma')
    upload_dir: str = os.getenv('UPLOAD_DIR', './uploads')
    max_upload_size_mb: int = int(os.getenv('MAX_UPLOAD_SIZE_MB', '10'))
    cors_origins: list[str] = Field(
        default_factory=lambda: _split_csv(os.getenv('CORS_ORIGINS'), ['http://localhost:5173'])
    )

    def ensure_directories(self) -> None:
        Path(self.chroma_persist_directory).mkdir(parents=True, exist_ok=True)
        Path(self.upload_dir).mkdir(parents=True, exist_ok=True)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
settings.ensure_directories()
