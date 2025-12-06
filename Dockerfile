# Dockerfile for Railway deployment (from repo root)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from backend folder
COPY arzaq-backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code from backend folder
COPY arzaq-backend/ .

# Create uploads directory
RUN mkdir -p uploads/qr_codes

# Make start script executable
RUN chmod +x start.sh

# Expose port (Railway will set PORT env var)
EXPOSE 8000

# Run the application with migrations
CMD ["./start.sh"]
