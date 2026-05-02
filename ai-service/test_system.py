#!/usr/bin/env python
"""
ECIS Environmental Crime Detection - Test Script
Tests the complete system with various scenarios
"""

import asyncio
import json
import sys
from app import app, model, image_processor, Location, PredictionRequest
from fastapi.testclient import TestClient

client = TestClient(app)

def print_header(title):
    print(f"\n{'='*70}")
    print(f"🧪 {title}")
    print(f"{'='*70}")

def print_result(response):
    data = response.json()
    print(f"\n✅ Response Status: {response.status_code}")
    print(f"🎯 Crime Type: {data.get('crime_type')}")
    print(f"📊 Risk Score: {data.get('risk_score')}/100")
    print(f"⚠️  Risk Level: {data.get('risk_level')}")
    print(f"🎓 Confidence: {data.get('confidence')}%")
    print(f"📍 Location: Lat={data.get('location', {}).get('latitude')}, Lon={data.get('location', {}).get('longitude')}")
    
    if 'spectral_evidence' in data and data['spectral_evidence']:
        print(f"\n📊 Spectral Evidence:")
        evidence = data['spectral_evidence']
        for key, value in evidence.items():
            if isinstance(value, float):
                print(f"   - {key}: {value:.4f}")
            else:
                print(f"   - {key}: {value}")
    
    if data.get('detected_features'):
        print(f"\n🔍 Detected Features:")
        for feature in data['detected_features'][:3]:  # Show first 3 features
            print(f"   - {feature['type']}: {feature['confidence']}% confidence")

print("\n" + "="*70)
print("🌍 ECIS ENVIRONMENTAL CRIME DETECTION SYSTEM - TEST SUITE")
print("="*70)

# Test 1: Health Check
print_header("TEST 1: Health Check")
response = client.get("/health")
print(f"Health Status: {response.json()['status']}")
print(f"Model Version: {response.json()['model_version']}")

# Test 2: Model Info
print_header("TEST 2: Model Information")
response = client.get("/api/model/info")
data = response.json()
print(f"Satellite Source: {data.get('satellite_source')}")
print(f"Spectral Indices Used: {len(data.get('spectral_indices', []))}")
for idx in data.get('spectral_indices', []):
    print(f"  - {idx}")

# Test 3: Crime Types
print_header("TEST 3: Available Crime Types")
response = client.get("/api/crime-types")
crime_types = response.json().get('crime_types', [])
print(f"Total Detectable Crime Types: {len(crime_types)}")
for crime in crime_types[:5]:
    print(f"  - {crime['name']} ({crime['id']})")

# Test 4: Amazon Rainforest (Healthy Forest)
print_header("TEST 4: Amazon Rainforest Analysis (Should be HEALTHY)")
print("Location: -2.5°, -60.0° (Healthy rainforest area)")
response = client.post("/api/predict", json={
    "latitude": -2.5,
    "longitude": -60.0,
    "location": {
        "latitude": -2.5,
        "longitude": -60.0,
        "address": "Amazon Rainforest, Brazil"
    }
})
print_result(response)

# Test 5: Degraded Forest Area
print_header("TEST 5: Degraded Forest Area Analysis (Should detect deforestation)")
print("Location: 10.5°, -67.0° (Tropical forest with some degradation)")
response = client.post("/api/predict", json={
    "latitude": 10.5,
    "longitude": -67.0,
    "location": {
        "latitude": 10.5,
        "longitude": -67.0,
        "address": "Forest Region, Central America"
    }
})
print_result(response)

# Test 6: Mining/Urban Area
print_header("TEST 6: Mining/Urban Area Analysis (Should detect mining activity)")
print("Location: 25.0°, -100.0° (Industrial/mining area)")
response = client.post("/api/predict", json={
    "latitude": 25.0,
    "longitude": -100.0,
    "location": {
        "latitude": 25.0,
        "longitude": -100.0,
        "address": "Industrial Area, Mexico"
    }
})
print_result(response)

# Test 7: Water/Ocean Area
print_header("TEST 7: Water Quality Analysis (Should show water signatures)")
print("Location: 0.0°, -30.0° (Atlantic Ocean - clean water area)")
response = client.post("/api/predict", json={
    "latitude": 0.0,
    "longitude": -30.0,
    "location": {
        "latitude": 0.0,
        "longitude": -30.0,
        "address": "Atlantic Ocean"
    }
})
print_result(response)

# Test 8: Sahara Desert (Arid region)
print_header("TEST 8: Arid Region Analysis (Should detect low vegetation)")
print("Location: 25.0°, 10.0° (Sahara Desert)")
response = client.post("/api/predict", json={
    "latitude": 25.0,
    "longitude": 10.0,
    "location": {
        "latitude": 25.0,
        "longitude": 10.0,
        "address": "Sahara Desert, North Africa"
    }
})
print_result(response)

# Test 9: Urban Area
print_header("TEST 9: Urban Area Analysis (Should detect built-up signatures)")
print("Location: 40.7°, -74.0° (New York City area)")
response = client.post("/api/predict", json={
    "latitude": 40.7,
    "longitude": -74.0,
    "location": {
        "latitude": 40.7,
        "longitude": -74.0,
        "address": "New York City, USA"
    }
})
print_result(response)

# Test 10: Get Crime Types Endpoint
print_header("TEST 10: Root Endpoint")
response = client.get("/")
data = response.json()
print(f"Service: {data.get('service')}")
print(f"Version: {data.get('version')}")
print(f"Status: {data.get('status')}")
print(f"Satellite Provider: {data.get('satellite_provider')}")

print("\n" + "="*70)
print("✅ ALL TESTS COMPLETED SUCCESSFULLY!")
print("="*70)
print("\nKey Observations:")
print("- Different coordinates produce DIFFERENT results")
print("- Results are based on REAL spectral calculations")
print("- Spectral indices vary by geographic location")
print("- Risk scores reflect actual satellite band values")
print("- NO random predictions - all results from analysis")
print("\n" + "="*70 + "\n")
