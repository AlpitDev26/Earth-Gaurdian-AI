from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Earth Guardian AI Service"
    GEMINI_API_KEY: str = ""
    SPRING_BOOT_URL: str = "http://localhost:8080/api/v1"
    
    class Config:
        env_file = ".env"

settings = Settings()
