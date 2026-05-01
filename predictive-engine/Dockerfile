# Use the official Python 3.11 slim image.
# 'slim' is smaller than the full image but contains more tools than alpine, making pip installs smoother.
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Prevent Python from writing .pyc files to disk and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install dependencies using pip
# --no-cache-dir reduces the image size by not storing the downloaded pip packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code
COPY . .

# Expose port 8000 for FastAPI
EXPOSE 8000

# Default command to run the Uvicorn ASGI server with hot-reloading
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
