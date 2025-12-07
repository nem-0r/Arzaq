#!/bin/bash
# Start script for Railway deployment

set -e

echo "=========================================="
echo "Running database migrations..."
echo "=========================================="
alembic upgrade head

echo ""
echo "=========================================="
echo "Starting FastAPI server..."
echo "=========================================="
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
