from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Application configuration settings.
    We use Pydantic's BaseSettings to manage configuration via environment variables.
    This is an enterprise best practice for avoiding hardcoded secrets and configurations.
    """
    PROJECT_NAME: str = "EduNode Predictive Engine"
    API_V1_STR: str = "/api/v1"
    
    # Enable debugging based on environment (e.g. true for local dev, false for prod)
    DEBUG: bool = True

    class Config:
        # Pydantic will attempt to read these variables from a .env file if it exists
        env_file = ".env"

# Instantiate the settings so they can be imported and used across the application.
settings = Settings()
