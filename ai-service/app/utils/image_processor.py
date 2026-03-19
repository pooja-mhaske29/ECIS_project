import cv2
import numpy as np
from PIL import Image
import base64
import io
import requests
from typing import Tuple, Optional, List
import logging

logger = logging.getLogger(__name__)

class ImageProcessor:
    @staticmethod
    def load_image_from_url(url: str) -> Optional[np.ndarray]:
        """Load image from URL"""
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        except Exception as e:
            logger.error(f"Error loading image from URL: {e}")
            return None

    @staticmethod
    def load_image_from_base64(base64_string: str) -> Optional[np.ndarray]:
        """Load image from base64 string"""
        try:
            # Remove header if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            img_data = base64.b64decode(base64_string)
            img_array = np.asarray(bytearray(img_data), dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        except Exception as e:
            logger.error(f"Error loading image from base64: {e}")
            return None

    @staticmethod
    def preprocess_image(img: np.ndarray, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
        """Preprocess image for model input"""
        # Resize
        img = cv2.resize(img, target_size)
        
        # Normalize to [0, 1]
        img = img.astype(np.float32) / 255.0
        
        # Add batch dimension if needed
        if len(img.shape) == 3:
            img = np.expand_dims(img, axis=0)
        
        return img

    @staticmethod
    def extract_features(img: np.ndarray) -> dict:
        """Extract basic image features"""
        features = {}
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        
        # Basic statistics
        features['brightness'] = float(np.mean(gray))
        features['contrast'] = float(np.std(gray))
        features['sharpness'] = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        
        # Color statistics
        for i, color in enumerate(['red', 'green', 'blue']):
            features[f'{color}_mean'] = float(np.mean(img[:, :, i]))
            features[f'{color}_std'] = float(np.std(img[:, :, i]))
        
        return features

    @staticmethod
    def detect_edges(img: np.ndarray) -> List[dict]:
        """Simple edge detection for object counting"""
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        objects = []
        for i, contour in enumerate(contours[:5]):  # Limit to top 5
            area = cv2.contourArea(contour)
            if area > 100:  # Filter small contours
                x, y, w, h = cv2.boundingRect(contour)
                objects.append({
                    'id': i,
                    'type': 'object',
                    'confidence': float(min(area / 1000, 0.95)),
                    'bbox': [int(x), int(y), int(w), int(h)]
                })
        
        return objects