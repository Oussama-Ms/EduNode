from fastapi import FastAPI
from app.core.config import settings
from app.api import endpoints

# Initialize the FastAPI application using the configurations
# This sets up the OpenAPI/Swagger documentation automatically
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Include the endpoints router.
# This attaches the routes defined in endpoints.py to the main application under the specified prefix.
app.include_router(
    endpoints.router,
    prefix=settings.API_V1_STR,
    tags=["predictive"]
)

@app.get("/")
async def root():
    """
    Health check endpoint to verify the microservice is running.
    """
    return {"message": f"Welcome to the {settings.PROJECT_NAME}"}
