from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class CrimeType(str, Enum):
    THEFT = "theft"
    ASSAULT = "assault"
    VANDALISM = "vandalism"
    FRAUD = "fraud"
    TRAFFIC = "traffic"
    SUSPICIOUS = "suspicious"
    OTHER = "other"

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Location(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: Optional[str] = None

class PredictionRequest(BaseModel):
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    location: Optional[Location] = None
    timestamp: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}

class PredictionResponse(BaseModel):
    prediction_id: str
    crime_type: CrimeType
    confidence: float = Field(..., ge=0, le=100)
    risk_score: float = Field(..., ge=0, le=100)
    risk_level: RiskLevel
    detected_objects: List[Dict[str, Any]] = []
    processing_time_ms: float
    model_version: str = "1.0.0"
    timestamp: str

class BatchPredictionRequest(BaseModel):
    images: List[PredictionRequest]
    batch_size: Optional[int] = 10

class BatchPredictionResponse(BaseModel):
    batch_id: str
    predictions: List[PredictionResponse]
    total_processed: int
    successful: int
    failed: int
    processing_time_ms: float