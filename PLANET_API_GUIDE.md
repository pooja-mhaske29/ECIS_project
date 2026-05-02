# Planet API Integration Guide

## Overview

This guide covers the Planet API integration for fetching Sentinel-2 imagery and calculating NDVI to detect deforestation.

---

## 🔑 Getting Your Planet API Key

### Step 1: Create a Planet Account
1. Visit [Planet Labs](https://www.planet.com)
2. Click "Sign Up" → Create free account
3. Verify your email

### Step 2: Get Your API Key
1. Log in to Planet Dashboard
2. Navigate to **Settings** → **API Keys**
3. Click **"Generate New Key"**
4. Copy your **API Key** (keep it secret!)

### Step 3: Add to Environment
```bash
# In .env file, add:
PLANET_API_KEY=your_planet_api_key_here
```

---

## 📡 Endpoints

### 1. Health Check
```
GET /api/planet/health
```

Check Planet API client status and authentication.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-04-18T10:30:00Z",
  "service": "Planet API Client",
  "api_available": true,
  "authentication": "API Key"
}
```

---

### 2. Search Imagery
```
POST /api/planet/search
```

Search for available Sentinel-2 imagery at coordinates.

**Parameters:**
```json
{
  "latitude": -2.5,
  "longitude": -60.0,
  "date_from": "2024-03-18",
  "date_to": "2024-04-18",
  "imagery_type": "sentinel2"
}
```

**Response:**
```json
{
  "status": "success",
  "search_results": {
    "count": 5,
    "imagery_type": "sentinel2",
    "date_from": "2024-03-18",
    "date_to": "2024-04-18"
  },
  "location": {
    "latitude": -2.5,
    "longitude": -60.0
  }
}
```

**cURL Example:**
```bash
curl -X POST "http://127.0.0.1:8000/api/planet/search" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -2.5,
    "longitude": -60.0,
    "imagery_type": "sentinel2"
  }'
```

---

### 3. Predict Deforestation (NDVI Analysis)
```
POST /predict
```

Predict deforestation risk using NDVI analysis on Sentinel-2 imagery.

**Parameters:**
```json
{
  "latitude": -2.5,
  "longitude": -60.0,
  "date_from": "2024-03-18",
  "date_to": "2024-04-18"
}
```

**Response:**
```json
{
  "ndvi_mean": 0.72,
  "ndvi_min": 0.45,
  "ndvi_max": 0.92,
  "deforestation_risk": "low",
  "confidence": 85.0,
  "critical_pixels": 512,
  "critical_ratio": 0.078,
  "degraded_pixels": 2048,
  "degraded_ratio": 0.312,
  "total_pixels": 65536,
  "location": {
    "latitude": -2.5,
    "longitude": -60.0
  },
  "timestamp": "2024-04-18T10:30:00Z",
  "processing_time_ms": 3456.78,
  "api_source": "Planet API (Sentinel-2)",
  "model_version": "3.0.0-planet"
}
```

**cURL Example:**
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -2.5,
    "longitude": -60.0
  }'
```

---

## 📊 NDVI Analysis Explained

### What is NDVI?

**NDVI = (NIR - Red) / (NIR + Red)**

NDVI (Normalized Difference Vegetation Index) measures vegetation health using satellite bands:
- **NIR (Near Infrared):** Sentinel-2 Band 8 (842 nm)
- **Red:** Sentinel-2 Band 4 (665 nm)

### Interpreting NDVI Values

```
Range: -1.0 to +1.0

NDVI < 0.0
  └─ Water, snow, or clouds

NDVI 0.0 - 0.2
  └─ CRITICAL DEFORESTATION
  └─ Bare soil, urban, barren land

NDVI 0.2 - 0.4
  └─ DEGRADED VEGETATION
  └─ Low vegetation, sparse forest

NDVI 0.4 - 0.6
  └─ MODERATE VEGETATION
  └─ Cropland, recovering forest

NDVI 0.6 - 1.0
  └─ HEALTHY VEGETATION
  └─ Dense forest, agriculture
```

### Risk Classification

| NDVI Mean | Risk Level | Action |
|-----------|-----------|--------|
| < 0.2 | CRITICAL | Immediate investigation |
| 0.2 - 0.4 | HIGH | Urgent monitoring |
| 0.4 - 0.6 | MEDIUM | Regular monitoring |
| > 0.6 | LOW | Routine observation |

---

## 🎯 Test Scenarios

### Test 1: Amazon Rainforest (Healthy)
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": -2.5, "longitude": -60.0}'
```

**Expected Result:**
- NDVI: 0.70 - 0.80 (Healthy vegetation)
- Risk: **LOW**
- Confidence: 85%+

### Test 2: Degraded Forest (Deforestation)
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 10.5, "longitude": -67.0}'
```

**Expected Result:**
- NDVI: 0.15 - 0.35 (Degraded)
- Risk: **HIGH/CRITICAL**
- Confidence: 90%+

### Test 3: Sahara Desert (Arid)
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 25.0, "longitude": 10.0}'
```

**Expected Result:**
- NDVI: 0.10 - 0.25 (Low vegetation)
- Risk: **MEDIUM** (Natural aridness, not deforestation)
- Confidence: 75%+

### Test 4: Ocean Water (Control)
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 0.0, "longitude": -30.0}'
```

**Expected Result:**
- NDVI: Negative (Water absorbs NIR)
- Risk: **LOW** (Water, not deforestation)
- Confidence: 90%+

---

## 🔧 Configuration

### Environment Variables

```bash
# .env file
PLANET_API_KEY=your_api_key_here
SATELLITE_SOURCE=planet  # Default data source

# Optional: Sentinel Hub backup
SENTINEL_HUB_CLIENT_ID=your_sentinel_id
SENTINEL_HUB_CLIENT_SECRET=your_sentinel_secret
```

### API Key Security

**Best Practices:**
- Never commit API keys to version control
- Use `.env` file (included in `.gitignore`)
- Regenerate keys if compromised
- Use key rotation policies
- Restrict key permissions to read-only access

---

## 🚀 Starting the Server

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your PLANET_API_KEY
```

### 3. Run the Server
```bash
python app.py
```

**Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 4. Access API Documentation
```
http://127.0.0.1:8000/docs
```

---

## 📊 Python Integration

### Using the Planet Client

```python
from planet_client import get_planet_client

# Initialize client
planet = get_planet_client()

# Assess deforestation at coordinates
result = planet.assess_deforestation(
    latitude=-2.5,
    longitude=-60.0,
    date_from="2024-03-18",
    date_to="2024-04-18"
)

print(f"NDVI Mean: {result['ndvi_mean']:.2f}")
print(f"Risk Level: {result['deforestation_risk']}")
print(f"Confidence: {result['confidence']}%")
```

### Fetching Bands Directly

```python
from planet_client import get_planet_client

planet = get_planet_client()

# Fetch Sentinel-2 bands
bands = planet.fetch_sentinel2_bands(
    latitude=-2.5,
    longitude=-60.0
)

# Access individual bands
blue = bands['B02']    # 0-4096
green = bands['B03']   # 0-4096
red = bands['B04']     # 0-4096
nir = bands['B08']     # 0-4096 (Near Infrared)
swir1 = bands['B11']   # 0-4096 (Short Wave Infrared)
swir2 = bands['B12']   # 0-4096

# Calculate NDVI
ndvi = planet.calculate_ndvi(bands)
print(f"NDVI Mean: {ndvi.mean():.2f}")
```

---

## 📈 Performance & Limitations

### Performance Metrics

| Metric | Value |
|--------|-------|
| Single API Request | 2-8 seconds |
| Cached Results | <500ms |
| Memory Usage | 150-200MB |
| CPU per Request | 1-2 cores |

### Cloud Cover Impact

Planet API filters imagery by cloud cover (max 50% by default).

- Clear skies: Full accuracy
- Partial clouds: Slightly reduced accuracy
- Heavy clouds: Images may be unavailable

### Temporal Resolution

- Sentinel-2: Every 5 days (global coverage)
- PSScene: Daily or multiple times per day (limited areas)

### Spatial Resolution

- Sentinel-2: 10-20m per pixel
- PSScene: 3m per pixel

---

## 🔍 Troubleshooting

### Problem: "Planet API key not provided"

**Solution:**
1. Check `.env` file exists
2. Verify `PLANET_API_KEY` is set
3. Reload environment: `python app.py`

### Problem: Slow responses

**Solution:**
- First request fetches from Planet API (2-8 seconds)
- Subsequent requests use cache (<500ms)
- Check internet connection
- Verify Planet API service status

### Problem: Inaccurate NDVI values

**Causes:**
- High cloud cover in region
- Seasonal variations (dry season = lower NDVI)
- Timing of observations
- Resolution limitations

**Solution:**
- Use date ranges during growing season
- Request multiple dates for comparison
- Consider seasonal baselines

### Problem: Authentication fails

**Solution:**
1. Verify API key in Planet Dashboard
2. Check key hasn't expired
3. Regenerate key if needed
4. Ensure correct key copied (no spaces)

---

## 📚 Additional Resources

### Planet API Documentation
- [Planet SDK Docs](https://planet-sdk-py.readthedocs.io/)
- [Planet API Reference](https://developers.planet.com/)
- [Sentinel-2 Band Guide](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-2-msi)

### NDVI Resources
- [NDVI Guide](https://www.usgs.gov/faqs/what-ndvi-normalized-difference-vegetation-index)
- [Remote Sensing Spectral Indices](https://www.indexdatabase.de/)

### Deforestation Monitoring
- [Global Forest Watch](https://www.globalforestwatch.org/)
- [ESA Forest Monitoring](https://www.esa.int/Applications/Observing_the_Earth/Forests)

---

## ✅ Checklist

- [ ] Created Planet Labs account
- [ ] Generated API Key
- [ ] Added `PLANET_API_KEY` to `.env`
- [ ] Installed dependencies: `pip install -r requirements.txt`
- [ ] Verified app starts: `python app.py`
- [ ] Tested `/api/planet/health` endpoint
- [ ] Tested `/api/planet/search` endpoint
- [ ] Tested `/predict` endpoint with sample coordinates
- [ ] Verified NDVI values make sense
- [ ] Integrated with monitoring system

---

**Planet API integration is ready for deforestation detection!** 🌍
