from fastapi import APIRouter
import time
import platform
import os

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "ECIS AI Detection",
        "system": {
            "python_version": platform.python_version(),
            "platform": platform.platform(),
            "hostname": platform.node()
        }
    }

@router.get("/ready")
async def readiness_check():
    """Readiness check endpoint"""
    return {
        "status": "ready", 
        "timestamp": time.time()
    }

@router.get("/ping")
async def ping():
    """Simple ping endpoint for basic connectivity testing"""
    return {"ping": "pong"}