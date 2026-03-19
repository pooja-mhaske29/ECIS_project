from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, health
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="ECIS AI Detection Service",
    description="AI service for crime detection from satellite/street images",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(predict.router, prefix="/api", tags=["Prediction"])

@app.get("/")
async def root():
    return {
        "service": "ECIS AI Detection Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "predict": "/api/predict",
            "batch-predict": "/api/batch-predict"
        }
    }

@app.on_event("startup")
async def startup_event():
    print("🚀 AI Service starting up...")
    print("✅ Routes registered:")
    print("   - GET  /health")
    print("   - GET  /")
    print("   - POST /api/predict")
    print("   - POST /api/batch-predict")

@app.on_event("shutdown")
async def shutdown_event():
    print("👋 AI Service shutting down...")