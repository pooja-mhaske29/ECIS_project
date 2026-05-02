# API DOCUMENTATION

## Base URL
```
http://127.0.0.1:8000
```

## Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Service information |
| GET | `/health` | Health check |
| GET | `/docs` | Interactive API docs (Swagger UI) |
| GET | `/api/model/info` | Model capabilities |
| GET | `/api/crime-types` | List detectable crimes |
| POST | `/api/predict` | Main prediction endpoint |
| POST | `/api/predict/file` | Analyze uploaded image |

---

## POST /api/predict

**Predict environmental crimes from coordinates or image**

### Request Body

#### Option A: Satellite Analysis from Coordinates

```json
{
  "latitude": 10.5,
  "longitude": -67.0,
  "location": {
    "latitude": 10.5,
    "longitude": -67.0,
    "address": "Forest Region"
  }
}
```

#### Option B: Image File URL

```json
{
  "image_url": "https://example.com/satellite-image.jpg",
  "location": {
    "latitude": 10.5,
    "longitude": -67.0
  }
}
```

#### Option C: Base64 Encoded Image

```json
{
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "location": {
    "latitude": 10.5,
    "longitude": -67.0
  }
}
```

### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| latitude | float | Yes* | Location latitude (-90 to 90) |
| longitude | float | Yes* | Location longitude (-180 to 180) |
| image_url | string | Yes* | URL to satellite/image file |
| image_base64 | string | Yes* | Base64 encoded image data |
| location | object | No | Additional location metadata |
| timestamp | string | No | Request timestamp (ISO 8601) |

\*Provide either coordinates OR image, not both

### Response

```json
{
  "prediction_id": "550e8400-e29b-41d4-a716-446655440000",
  "crime_type": "illegal_logging_critical",
  "crime_category": "deforestation",
  "confidence": 95.0,
  "risk_score": 85.2,
  "risk_level": "high",
  "environmental_impact": {
    "impact_level": "severe",
    "specific_impacts": {
      "co2_impact": "critical",
      "biodiversity": "critical",
      "soil_erosion": "severe"
    },
    "estimated_damage_area_hectares": 42.5,
    "urgency_level": "immediate",
    "co2_equivalent": 10625.0,
    "species_affected": [
      "Orangutan",
      "Sumatran Tiger",
      "Bornean Elephant"
    ]
  },
  "detected_features": [
    {
      "type": "deforested_area",
      "confidence": 95.0,
      "area_hectares": 42.5
    },
    {
      "type": "vegetation_loss",
      "confidence": 90.0,
      "area_hectares": 42.5
    }
  ],
  "satellite_timestamp": "2024-04-18T12:34:56.789Z",
  "processing_time_ms": 3456.78,
  "model_version": "3.0.0-sentinel",
  "location": {
    "latitude": 10.5,
    "longitude": -67.0,
    "address": "Forest Region, Central America"
  },
  "spectral_evidence": {
    "ndvi_mean": 0.18,
    "ndvi_min": -0.05,
    "ndvi_max": 0.65,
    "critical_pixels_ratio": 0.42,
    "threshold_critical": 0.2
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| prediction_id | UUID | Unique prediction identifier |
| crime_type | string | Detected environmental crime type |
| crime_category | string | Crime category (deforestation, pollution, etc) |
| confidence | float | Prediction confidence (0-100) |
| risk_score | float | Overall risk score (0-100) |
| risk_level | string | Risk severity: none, low, medium, high, critical |
| environmental_impact | object | Impact assessment details |
| detected_features | array | Geographic features detected |
| satellite_timestamp | ISO 8601 | Data acquisition time |
| processing_time_ms | float | API processing time |
| model_version | string | Model version used |
| location | object | Request location |
| spectral_evidence | object | Spectral index values |

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing/invalid parameters) |
| 500 | Server error (API failure) |

### Example Requests

#### cURL - Healthy Forest

```bash
curl -X POST "http://127.0.0.1:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -2.5,
    "longitude": -60.0,
    "location": {
      "address": "Amazon Rainforest"
    }
  }'
```

#### cURL - With Image URL

```bash
curl -X POST "http://127.0.0.1:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/satellite.jpg",
    "location": {
      "latitude": 10.5,
      "longitude": -67.0
    }
  }'
```

#### Python Requests

```python
import requests

url = "http://127.0.0.1:8000/api/predict"

payload = {
    "latitude": 10.5,
    "longitude": -67.0,
    "location": {
        "address": "Forest Region"
    }
}

response = requests.post(url, json=payload)
data = response.json()

print(f"Crime Type: {data['crime_type']}")
print(f"Risk Level: {data['risk_level']}")
print(f"Confidence: {data['confidence']}%")
print(f"NDVI: {data['spectral_evidence']['ndvi_mean']}")
```

#### JavaScript Fetch

```javascript
const response = await fetch('http://127.0.0.1:8000/api/predict', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    latitude: 10.5,
    longitude: -67.0
  })
});

const data = await response.json();
console.log(`Crime Type: ${data.crime_type}`);
console.log(`Risk Level: ${data.risk_level}`);
```

---

## POST /api/predict/file

**Analyze uploaded image file**

### Request

- **Content-Type:** multipart/form-data
- **Parameters:**
  - `file` (required): Image file (.jpg, .png, .tiff)
  - `latitude` (optional): Latitude for location context
  - `longitude` (optional): Longitude for location context

### Example

```bash
curl -X POST "http://127.0.0.1:8000/api/predict/file" \
  -F "file=@./satellite-image.jpg" \
  -F "latitude=10.5" \
  -F "longitude=-67.0"
```

### Response

Same as `/api/predict`

---

## GET /api/model/info

**Get model capabilities and configuration**

### Response

```json
{
  "model_version": "3.0.0-sentinel",
  "crime_types": [
    "illegal_logging",
    "deforestation_moderate",
    "land_degradation",
    "illegal_mining_critical",
    "mining_activity_detected",
    "urbanization_detected",
    "water_pollution_critical",
    "water_pollution_moderate",
    "water_quality_degradation",
    "air_pollution_critical",
    "air_pollution_moderate",
    "air_quality_degradation"
  ],
  "crime_categories": {
    "illegal_logging": "deforestation",
    "illegal_mining_critical": "resource_extraction",
    "water_pollution_critical": "pollution"
  },
  "status": "loaded",
  "satellite_source": "Sentinel Hub (Sentinel-2)",
  "spectral_indices": [
    "NDVI (Normalized Difference Vegetation Index)",
    "NDWI (Normalized Difference Water Index)",
    "NDBI (Normalized Difference Built-up Index)",
    "Thermal/Aerosol Analysis"
  ],
  "bands_used": [
    "B02 (Blue)",
    "B03 (Green)",
    "B04 (Red)",
    "B08 (NIR)",
    "B11 (SWIR)",
    "B12 (SWIR)"
  ]
}
```

### Example

```bash
curl "http://127.0.0.1:8000/api/model/info"
```

---

## GET /api/crime-types

**List all detectable environmental crime types**

### Response

```json
{
  "crime_types": [
    {
      "id": "illegal_logging",
      "name": "Illegal Logging",
      "category": "Deforestation"
    },
    {
      "id": "illegal_mining_critical",
      "name": "Illegal Mining (Critical)",
      "category": "Resource Extraction"
    },
    {
      "id": "water_pollution_critical",
      "name": "Water Pollution (Critical)",
      "category": "Pollution"
    }
  ]
}
```

### Example

```bash
curl "http://127.0.0.1:8000/api/crime-types"
```

---

## GET /health

**Health check endpoint**

### Response

```json
{
  "status": "healthy",
  "timestamp": 1713441296.5624254,
  "service": "ECIS Environmental Crime Detection",
  "model_loaded": true,
  "model_version": "3.0.0-sentinel"
}
```

### Example

```bash
curl "http://127.0.0.1:8000/health"
```

---

## GET /

**Service information and endpoints**

### Response

```json
{
  "service": "ECIS Environmental Crime Detection",
  "version": "3.0.0",
  "status": "running",
  "satellite_provider": "Sentinel Hub",
  "crime_types": ["illegal_logging", "illegal_mining_critical", ...],
  "endpoints": {
    "health": "/health",
    "docs": "/docs",
    "predict": "/api/predict",
    "model_info": "/api/model/info"
  }
}
```

---

## GET /docs

**Interactive API documentation (Swagger UI)**

Open in browser: `http://127.0.0.1:8000/docs`

---

## Risk Levels

| Level | Score Range | Meaning | Action |
|-------|-------------|---------|--------|
| none | 0-10 | No crime detected | Monitor |
| low | 11-30 | Minor concerns | Routine monitoring |
| medium | 31-60 | Moderate risk | Investigation recommended |
| high | 61-80 | Significant crime | Urgent investigation |
| critical | 81-100 | Severe crime | Immediate action required |

---

## Crime Type Categories

### Deforestation
- `illegal_logging` - Active unauthorized cutting
- `deforestation_moderate` - Forest degradation
- `land_degradation` - Soil erosion/desertification

### Resource Extraction
- `illegal_mining_critical` - Active illegal mining
- `mining_activity_detected` - Potential mining areas
- `urbanization_detected` - Rapid urban expansion

### Pollution
- `water_pollution_critical` - Severe water contamination
- `water_pollution_moderate` - Moderate water pollution
- `water_quality_degradation` - Declining water quality
- `air_pollution_critical` - Severe air pollution
- `air_pollution_moderate` - Moderate air pollution
- `air_quality_degradation` - Declining air quality

---

## Spectral Indices Explained

### NDVI (Normalized Difference Vegetation Index)
```
Formula: NDVI = (NIR - Red) / (NIR + Red)
Range: -1 to +1

Interpretation:
-1 to 0.0:   Water, snow, clouds
0.0 to 0.2:  Bare soil, urban, barren
0.2 to 0.4:  Low vegetation, degraded forest
0.4 to 0.6:  Moderate vegetation, cropland
0.6 to 1.0:  Dense vegetation, forests

Deforestation Detection:
< 0.2:  CRITICAL - Severe deforestation
0.2-0.4: HIGH - Degraded forest
> 0.6:  LOW - Healthy forest
```

### NDWI (Normalized Difference Water Index)
```
Formula: NDWI = (Green - NIR) / (Green + NIR)
Range: -1 to +1

Interpretation:
< -0.3:  Pollution/discoloration
-0.3 to 0.0: Turbid water
0.0 to 0.4:  Water with sediment
> 0.4:   Clean water
```

### NDBI (Normalized Difference Built-up Index)
```
Formula: NDBI = (SWIR - NIR) / (SWIR + NIR)
Range: -1 to +1

Interpretation:
< 0.1:  Natural vegetation
0.1 to 0.3: Sparse built-up
> 0.3:  Dense built-up/mining
```

---

## Rate Limits

- No rate limiting on free tier
- Sentinel Hub API: Varies by subscription
- Recommended: Cache results within 5 days

---

## Error Handling

### Invalid Coordinates

```bash
curl -X POST "http://127.0.0.1:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 200, "longitude": 500}'
```

Response: 422 Unprocessable Entity

### Missing Image

```bash
curl -X POST "http://127.0.0.1:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Response: 400 Bad Request
```json
{"detail": "Provide either coordinates (latitude/longitude) or image (image_url/image_base64)"}
```

### API Failure

```json
{
  "detail": "Prediction failed: Failed to fetch satellite data"
}
```

---

## Best Practices

1. **Use appropriate coordinates:** Ensure you're requesting real geographic locations
2. **Cache results:** Store predictions for the same location within 5 days
3. **Batch requests:** Process multiple locations sequentially, not in parallel
4. **Monitor processing time:** Alert if processing takes > 10 seconds
5. **Validate results:** Cross-reference with other data sources

---

## Support & Troubleshooting

- **Server not responding:** Check if `python app.py` is running
- **Credentials error:** Add API keys to `.env` file
- **Slow responses:** Use cached results or check internet connection
- **Inaccurate results:** May be due to cloud cover or seasonal variations

---

**API is ready to detect environmental crimes!** 🌍
