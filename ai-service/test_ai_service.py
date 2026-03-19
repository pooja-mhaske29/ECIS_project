import requests
import json
import base64
from PIL import Image
import io

# Base URL
BASE_URL = "http://127.0.0.1:8000"

def test_health():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health Check:", response.json())
    return response.status_code == 200

def test_root():
    """Test root endpoint"""
    response = requests.get(f"{BASE_URL}/")
    print("Root Endpoint:", response.json())
    return response.status_code == 200

def test_predict():
    """Test prediction endpoint with mock data"""
    # Create a simple test image (black square)
    img = Image.new('RGB', (224, 224), color='black')
    
    # Convert to base64
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    # Prepare request
    payload = {
        "image_base64": img_base64,
        "location": {
            "latitude": 40.7128,
            "longitude": -74.0060,
            "address": "Test Location"
        }
    }
    
    # Make request
    response = requests.post(
        f"{BASE_URL}/api/predict",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print("Prediction Result:", json.dumps(response.json(), indent=2))
    return response.status_code == 200

def test_model_info():
    """Test model info endpoint"""
    response = requests.get(f"{BASE_URL}/api/model/info")
    print("Model Info:", response.json())
    return response.status_code == 200

if __name__ == "__main__":
    print("Testing AI Service...")
    print("-" * 50)
    
    tests = [
        ("Health Check", test_health),
        ("Root Endpoint", test_root),
        ("Model Info", test_model_info),
        ("Prediction", test_predict)
    ]
    
    for name, test_func in tests:
        print(f"\n📝 Testing {name}...")
        try:
            result = test_func()
            print(f"✅ {name}: {'PASSED' if result else 'FAILED'}")
        except Exception as e:
            print(f"❌ {name}: ERROR - {str(e)}")
    
    print("\n" + "-" * 50)
    print("✅ Testing complete!")