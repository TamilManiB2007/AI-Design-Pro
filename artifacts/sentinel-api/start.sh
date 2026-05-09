#!/bin/bash
set -e
cd /home/runner/workspace/artifacts/sentinel-api

echo "Installing Python dependencies..."
/home/runner/workspace/.pythonlibs/bin/pip install -r requirements.txt -q 2>/dev/null || python3 -m pip install -r requirements.txt -q

echo "Starting SENTINEL-G Engine API on port 8000..."
exec /home/runner/workspace/.pythonlibs/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --log-level info
