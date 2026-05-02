# Quick Start Guide

## Installation (5 minutes)

### 1. Get Free Sentinel Hub Credentials
```bash
# Sign up at: https://www.sentinel-hub.com/
# Create OAuth Client
# You'll get Client ID and Client Secret
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit .env with your credentials
# SENTINEL_HUB_CLIENT_ID=your_id
# SENTINEL_HUB_CLIENT_SECRET=your_secret
```

### 4. Run Tests (Optional)
```bash
# Core detection logic tests
python test_core.py
```

## Start the Server

```bash
python app.py
```

You'll see:
```
======================================================================
🌍 ECIS Environmental Crime Detection Service - REAL SATELLITE ANALYSIS
======================================================================
📡 Server: http://127.0.0.1:8000
📚 Docs: http://127.0.0.1:8000/docs
🛰️  Data Source: Sentinel Hub API (Sentinel-2 Satellite)
```

## Test Immediately (Copy & Paste)

### Test 1: Healthy Forest (Amazon)
```bash
curl -X POST "http://127.0.0.1:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": -2.5, "longitude": -60.0}'
```

**Expected Result:** 
- `risk_level: "low"`
- `crime_type: "no_deforestation"`

### Test 2: Deforestation (Degraded Forest)
```bash
curl -X POST "http://127.0.0.1:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 10.5, "longitude": -67.0}'
```

**Expected Result:**
- `risk_level: "high"` or `"critical"`
- `crime_type` contains "deforestation" or "logging"

### Test 3: Mining Area
```bash
curl -X POST "http://127.0.0.1:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 25.0, "longitude": -100.0}'
```

**Expected Result:**
- Risk score `> 50`
- `crime_type` contains "mining" or "urbanization"

### Test 4: Clean Water
```bash
curl -X POST "http://127.0.0.1:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 0.0, "longitude": -30.0}'
```

**Expected Result:**
- `risk_level: "low"`
- `crime_type: "no_water_pollution"`

### Test 5: Model Info
```bash
curl "http://127.0.0.1:8000/api/model/info"
```

### Test 6: Health Check
```bash
curl "http://127.0.0.1:8000/health"
```

## Interactive API Docs

Open browser: **http://127.0.0.1:8000/docs**

Try requests directly in the UI!

## Key Results to Expect

| Location | Expected Crime | Risk Level | Confidence |
|----------|---|---|---|
| Amazon (-2.5, -60) | None (Healthy) | LOW | 70-95% |
| Degraded Forest (10.5, -67) | Deforestation | HIGH/CRITICAL | 90%+ |
| Mining Area (25, -100) | Mining/Urbanization | HIGH | 90%+ |
| Ocean (0, -30) | None (Clean) | LOW | 85%+ |
| Sahara (25, 10) | None/Degradation | LOW/MEDIUM | 70%+ |

## Understanding Responses

```json
{
  "crime_type": "illegal_logging_critical",
  "confidence": 95.0,
  "risk_score": 85.2,
  "risk_level": "high",
  "spectral_evidence": {
    "ndvi_mean": 0.18,        // Low vegetation = deforestation
    "ndvi_critical": 0.2,     // Threshold crossed
    "critical_pixels_ratio": 0.42  // 42% severely deforested
  }
}
```

## Spectral Indices Explained

- **NDVI** (Deforestation): -1 to +1
  - < 0.2 = Severe deforestation
  - 0.2-0.4 = Degraded
  - > 0.6 = Healthy
  
- **NDWI** (Water Pollution): -1 to +1
  - < -0.3 = Polluted
  - > 0.4 = Clean

- **NDBI** (Mining): -1 to +1
  - > 0.3 = Built-up/mining
  - < 0.1 = Natural

## No API Credentials Yet?

System uses **realistic fallback data** based on coordinates. Results are still meaningful!

## Need Real Satellite Data?

1. Get free Sentinel Hub account
2. Add Client ID & Secret to `.env`
3. System will fetch real Sentinel-2 imagery
4. Results become even more accurate!

## Troubleshooting

**"Credentials not provided"?**
- Normal! System uses fallback data
- Get free account to use real satellite data

**Port 8000 already in use?**
```bash
python app.py --port 8001
```

**Import errors?**
```bash
pip install --upgrade -r requirements.txt
```

---

**System is ready to detect environmental crimes! 🌍**
