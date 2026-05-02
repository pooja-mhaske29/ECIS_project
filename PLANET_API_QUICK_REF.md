# Planet API Quick Reference

## 🚀 Quick Start (5 minutes)

### 1. Get Your API Key
- Sign up at https://www.planet.com
- Generate API Key in Dashboard → Settings → API Keys
- Copy your key

### 2. Add to Environment
```bash
# Edit .env
PLANET_API_KEY=your_key_here
```

### 3. Start Server
```bash
python app.py
```

### 4. Test Endpoint
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": -2.5, "longitude": -60.0}'
```

---

## 📡 API Endpoints

### POST /predict (Main Endpoint)
Detect deforestation using NDVI analysis

**Parameters:**
```json
{
  "latitude": -2.5,
  "longitude": -60.0,
  "date_from": "2024-03-18",  // optional
  "date_to": "2024-04-18"      // optional
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
  "total_pixels": 65536,
  "location": {"latitude": -2.5, "longitude": -60.0},
  "api_source": "Planet API (Sentinel-2)",
  "model_version": "3.0.0-planet"
}
```

### GET /health
Check system and Planet API status

**Response:**
```json
{
  "status": "healthy",
  "service": "ECIS Environmental Crime Detection",
  "satellite_sources": ["Sentinel Hub", "Planet API"],
  "model_version": "3.0.0-sentinel"
}
```

### POST /api/planet/search
Search for available imagery

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

### GET /api/planet/health
Check Planet API connection

**Response:**
```json
{
  "status": "healthy",
  "service": "Planet API Client",
  "api_available": true,
  "authentication": "API Key"
}
```

---

## 🎯 Test Examples

### Amazon Rainforest (Healthy Forest)
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": -2.5, "longitude": -60.0}'
```
Expected: `deforestation_risk: "low"`, `ndvi_mean: ~0.7-0.8`

### Deforested Area
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 10.5, "longitude": -67.0}'
```
Expected: `deforestation_risk: "high"`, `ndvi_mean: ~0.2-0.3`

### Search Imagery
```bash
curl -X POST "http://127.0.0.1:8000/api/planet/search" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -2.5,
    "longitude": -60.0,
    "imagery_type": "sentinel2"
  }'
```

### Check Health
```bash
curl "http://127.0.0.1:8000/health"
```

### Check Planet API
```bash
curl "http://127.0.0.1:8000/api/planet/health"
```

---

## 🐍 Python Examples

### Basic Usage
```python
from planet_client import get_planet_client

planet = get_planet_client()

# Assess deforestation
result = planet.assess_deforestation(
    latitude=-2.5,
    longitude=-60.0
)

print(f"NDVI: {result['ndvi_mean']:.2f}")
print(f"Risk: {result['deforestation_risk']}")
print(f"Confidence: {result['confidence']}%")
```

### Calculate NDVI
```python
from planet_client import get_planet_client
import numpy as np

planet = get_planet_client()

# Get bands
bands = planet.fetch_sentinel2_bands(-2.5, -60.0)

# Calculate NDVI
ndvi = planet.calculate_ndvi(bands)

print(f"NDVI Mean: {ndvi.mean():.2f}")
print(f"NDVI Std: {ndvi.std():.2f}")
```

### Search Imagery
```python
from planet_client import get_planet_client

planet = get_planet_client()

results = planet.search_imagery(
    latitude=-2.5,
    longitude=-60.0,
    date_from="2024-03-18",
    date_to="2024-04-18",
    imagery_type="sentinel2"
)

print(f"Found {results['count']} items")
```

---

## 📊 NDVI Interpretation

```
NDVI Value     Meaning
─────────────────────────
< 0.0         Water/Clouds
0.0 - 0.2     🔴 CRITICAL - Deforestation/Bare Soil
0.2 - 0.4     🟠 HIGH - Degraded Forest
0.4 - 0.6     🟡 MEDIUM - Moderate Vegetation
> 0.6         🟢 LOW - Healthy Forest
```

---

## ⚙️ Configuration

### .env File
```
# Planet API
PLANET_API_KEY=your_api_key_here

# Optional: Sentinel Hub backup
SENTINEL_HUB_CLIENT_ID=your_id
SENTINEL_HUB_CLIENT_SECRET=your_secret

# Server
HOST=127.0.0.1
PORT=8000
SATELLITE_SOURCE=planet
```

---

## 🔒 Security Notes

- Never share your API key
- Keep .env in .gitignore
- Use environment variables for production
- Regenerate keys if compromised
- Use key rotation policies

---

## 📈 Performance

| Metric | Value |
|--------|-------|
| First Request | 2-8 seconds |
| Cached Request | <500ms |
| Memory | 150-200MB |
| Concurrency | Unlimited (async) |

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key not provided" | Add `PLANET_API_KEY` to .env |
| Slow responses | First request is slower (caching) |
| Authentication fails | Verify API key, regenerate if needed |
| Inaccurate results | Check cloud cover, use date ranges |

---

## 📚 More Info

- Full guide: See `PLANET_API_GUIDE.md`
- API docs: http://127.0.0.1:8000/docs
- Planet labs: https://www.planet.com

---

**Ready to detect deforestation!** 🌍
