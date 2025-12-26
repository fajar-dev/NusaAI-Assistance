from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "password")
    DB_DATABASE: str = os.getenv("DB_DATABASE", "vectordb")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GOOGLE_EMBEDDING_MODEL: str = os.getenv("GOOGLE_EMBEDDING_MODEL", "models/embedding-001")
    GOOGLE_LLM_MODEL: str = os.getenv("GOOGLE_LLM_MODEL", "gemini-pro")
    APP_PORT: int = int(os.getenv("APP_PORT", 8000))
    VECTOR_K: int = int(os.getenv("VECTOR_K", 3))

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_DATABASE}"
    
    @property
    def PSYCOPG_DATABASE_URL(self) -> str:
        return f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_DATABASE}"

settings = Settings()
