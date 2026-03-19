from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.responses import JSONResponse
from app.schemas.prediction import (
    PredictionRequest, PredictionResponse, 
    BatchPredictionRequest, BatchPredictionResponse
)
from app.models.prediction_model import get_model
from app.utils.image_processor import ImageProcessor
import logging
import time
import uuid
from typing import List
import asyncio

router = APIRouter()
logger = logging.getLogger(__name__)
image_processor = ImageProcessor()

@router.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Make a prediction from image URL or base64
    """
    start_time = time.time()
    
    try:
        # Load image
        img = None
        if request.image_url:
            img = image_processor.load_image_from_url(request.image_url)
        elif request.image_base64:
            img = image_processor.load_image_from_base64(request.image_base64)
        else:
            raise HTTPException(status_code=400, detail="No image provided")
        
        if img is None:
            raise HTTPException(status_code=400, detail="Failed to load image")
        
        # Extract features
        features = image_processor.extract_features(img)
        
        # Get model instance
        model = get_model()
        
        # Make prediction
        prediction = model.predict(img, features)
        
        # Add location if provided
        if request.location:
            prediction['location'] = request.location.dict()
        
        logger.info(f"Prediction completed in {prediction['processing_time_ms']}ms")
        
        return prediction
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/file")
async def predict_file(file: UploadFile = File(...)):
    """
    Make a prediction from uploaded image file
    """
    start_time = time.time()
    
    try:
        # Read file
        contents = await file.read()
        
        # Convert to numpy array
        import numpy as np
        import cv2
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Extract features
        features = image_processor.extract_features(img)
        
        # Get model instance
        model = get_model()
        
        # Make prediction
        prediction = model.predict(img, features)
        
        processing_time = (time.time() - start_time) * 1000
        prediction['processing_time_ms'] = round(processing_time, 2)
        
        logger.info(f"File prediction completed in {processing_time}ms")
        
        return prediction
        
    except Exception as e:
        logger.error(f"File prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-predict", response_model=BatchPredictionResponse)
async def batch_predict(request: BatchPredictionRequest):
    """
    Make predictions on multiple images
    """
    start_time = time.time()
    batch_id = str(uuid.uuid4())
    
    try:
        model = get_model()
        predictions = []
        successful = 0
        failed = 0
        
        # Process in parallel (limited concurrency)
        semaphore = asyncio.Semaphore(5)  # Max 5 concurrent tasks
        
        async def process_image(img_req):
            async with semaphore:
                try:
                    # Load image
                    img = None
                    if img_req.image_url:
                        img = image_processor.load_image_from_url(img_req.image_url)
                    elif img_req.image_base64:
                        img = image_processor.load_image_from_base64(img_req.image_base64)
                    
                    if img is None:
                        return None
                    
                    # Extract features
                    features = image_processor.extract_features(img)
                    
                    # Make prediction
                    pred = model.predict(img, features)
                    return pred
                except:
                    return None
        
        # Create tasks
        tasks = [process_image(req) for req in request.images[:request.batch_size]]
        
        # Wait for all tasks
        results = await asyncio.gather(*tasks)
        
        # Process results
        for result in results:
            if result:
                predictions.append(result)
                successful += 1
            else:
                failed += 1
        
        processing_time = (time.time() - start_time) * 1000
        
        return BatchPredictionResponse(
            batch_id=batch_id,
            predictions=predictions,
            total_processed=len(request.images[:request.batch_size]),
            successful=successful,
            failed=failed,
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model/info")
async def model_info():
    """Get model information"""
    model = get_model()
    return {
        "model_version": model.model_version,
        "crime_types": model.crime_types,
        "status": "loaded"
    }