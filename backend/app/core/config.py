from dotenv import load_dotenv
from functools import lru_cache
from pathlib import Path
import os

from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(BASE_DIR / ".env")



def _split_csv(value: str | None, fallback: list[str]) -> list[str]:
    if not value:
        return fallback

    return [
        item.strip()
        for item in value.split(",")
        if item.strip()
    ]



class Settings(BaseModel):

    app_name: str = os.getenv(
        "APP_NAME",
        "AI Resume Analyzer"
    )

    app_env: str = os.getenv(
        "APP_ENV",
        "development"
    )


    database_url: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./app.db"
    )


    jwt_secret_key: str = os.getenv(
        "JWT_SECRET_KEY",
        "change-me"
    )

    jwt_algorithm: str = os.getenv(
        "JWT_ALGORITHM",
        "HS256"
    )

    access_token_expire_minutes: int = int(
        os.getenv(
            "ACCESS_TOKEN_EXPIRE_MINUTES",
            "60"
        )
    )



    gemini_api_key: str = os.getenv(
        "GEMINI_API_KEY",
        ""
    )

    google_client_id: str = os.getenv(
        "GOOGLE_CLIENT_ID",
        ""
    )

    google_client_secret: str = os.getenv(
        "GOOGLE_CLIENT_SECRET",
        ""
    )


    chroma_persist_directory: str = os.getenv(
        "CHROMA_PERSIST_DIRECTORY",
        "./chroma"
    )


    upload_dir: str = os.getenv(
        "UPLOAD_DIR",
        "./uploads"
    )


    max_upload_size_mb: int = int(
        os.getenv(
            "MAX_UPLOAD_SIZE_MB",
            "10"
        )
    )



    # CORS from environment

    cors_origins: list[str] = Field(
        default_factory=lambda: _split_csv(
            os.getenv("CORS_ORIGINS"),
            [
                "http://localhost:5173"
            ]
        )
    )



    def ensure_directories(self):

        Path(
            self.chroma_persist_directory
        ).mkdir(
            parents=True,
            exist_ok=True
        )


        Path(
            self.upload_dir
        ).mkdir(
            parents=True,
            exist_ok=True
        )



@lru_cache
def get_settings() -> Settings:

    return Settings()



settings = get_settings()

settings.ensure_directories()