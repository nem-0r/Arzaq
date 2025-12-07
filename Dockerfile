# Dockerfile for Railway deployment
# This file is in the root of the project and builds the arzaq-backend

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file from arzaq-backend
COPY arzaq-backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code from arzaq-backend
COPY arzaq-backend/ .

# Create uploads directory
RUN mkdir -p uploads/qr_codes

# Expose port (Railway will set PORT env var)
EXPOSE 8000

# Run the application
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
