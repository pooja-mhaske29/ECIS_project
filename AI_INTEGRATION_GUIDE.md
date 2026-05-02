# AI Service Integration Guide

## Overview
This document explains the integration between the Backend API and the AI Service (ECIS - Environmental Crime Intelligence System).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React/Vue)                      │
└─────────────────────────────────────────────────────────────┘
                            ↕
                   (HTTP/REST API)
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Node.js/Express)               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  AI Integration Controller & Routes                   │  │
│  │  ├─ POST /api/ai-integration/detect                 │  │
│  │  ├─ POST /api/ai-integration/batch-detect           │  │
│  │  ├─ GET  /api/ai-integration/hotspots               │  │
│  │  ├─ GET  /api/ai-integration/stats                  │  │
│  │  ├─ GET  /api/ai-integration/reports                │  │
│  │  ├─ GET  /api/ai-integration/health                 │  │
│  │  └─ POST /api/ai-integration/webhook                │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↕                                  │
│                   (axios HTTP Client)                        │
│                            ↕                                  │
│            ┌──────────────────────────────────┐             │
│            │  Database (MongoDB)              │             │
│            │  - Violations Collection         │             │
│            │  - Users Collection              │             │
│            └──────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
                            ↕
                   (HTTP/REST API)
                            ↕
┌─────────────────────────────────────────────────────────────┐
│               AI Service (Python/FastAPI)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Crime Detection Endpoints                            │  │
│  │  ├─ POST /api/v1/detect                             │  │
│  │  ├─ POST /api/v1/batch-detect                       │  │
│  │  ├─ GET  /api/v1/hotspots                           │  │
│  │  ├─ GET  /api/v1/stats                              │  │
│  │  ├─ GET  /api/v1/reports                            │  │
│  │  └─ POST /api/v1/webhook                            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

The integration requires `axios` for HTTP requests to the AI service.

#### Configure Environment Variables
Create a `.env` file in the backend directory:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecis

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this

# AI Service Integration
AI_SERVICE_URL=http://127.0.0.1:8000

# Node Environment
NODE_ENV=development

# Backend Server
PORT=5000
HOST=127.0.0.1
```

#### Start Backend
```bash
# Development
npm run dev

# Production
npm start
```

### 2. AI Service Setup

Ensure the AI service is running:

```bash
cd ai-service
python app.py
```

The AI service should be running on `http://127.0.0.1:8000`

## API Endpoints

### Health Check

**Check if both services are running**

```http
GET /api/ai-integration/health
```

**Response:**
```json
{
  "success": true,
  "aiServiceHealthy": true,
  "timestamp": "2026-04-18T23:52:33.912Z"
}
```

### Single Location Crime Detection

**Detect crimes at a specific location**

```http
POST /api/ai-integration/detect
Content-Type: application/json
Authorization: Bearer {token}

{
  "latitude": -15.5,
  "longitude": -56.5,
  "location_name": "Amazon Rainforest Area",
  "address": "Amazon Basin, Brazil"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "violationId": "507f1f77bcf86cd799439011",
    "aiResult": {
      "report_id": "report_123",
      "crime_type": "illegal_logging",
      "confidence": 92.5,
      "risk_score": 85,
      "severity": "critical",
      "spectral_indices": {
        "ndvi": -0.234,
        "ndwi": 0.156,
        "ndbi": 0.789
      },
      "evidence": "Significant vegetation loss detected...",
      "required_action": "Immediate investigation required",
      "affected_area_hectares": 2500.5,
      "timestamp": "2026-04-18T23:52:33.912Z",
      "location": {
        "latitude": -15.5,
        "longitude": -56.5
      }
    },
    "databaseRecord": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "ILLEGAL LOGGING - Amazon Rainforest Area",
      "description": "Significant vegetation loss detected...",
      "crimeType": "illegal_logging",
      "riskScore": 85,
      "confidence": 92.5,
      "status": "investigating",
      "spectralIndices": {
        "ndvi": -0.234,
        "ndwi": 0.156,
        "ndbi": 0.789
      },
      "affectedAreaHectares": 2500.5,
      "requiredAction": "Immediate investigation required",
      "source": "ai_detection",
      "detectedAt": "2026-04-18T23:52:33.912Z"
    }
  }
}
```

### Batch Crime Detection

**Detect crimes at multiple locations**

```http
POST /api/ai-integration/batch-detect
Content-Type: application/json
Authorization: Bearer {token}

{
  "locations": [
    {
      "latitude": -15.5,
      "longitude": -56.5,
      "location_name": "Amazon Area 1",
      "address": "Amazon Basin, Brazil"
    },
    {
      "latitude": 1.0,
      "longitude": 110.0,
      "location_name": "Borneo Area",
      "address": "Indonesian Kalimantan"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "batchId": "batch_456",
    "totalLocations": 2,
    "detectedCrimes": 2,
    "createdViolations": 2,
    "processingTimeMs": 1250,
    "violationIds": [
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439012"
    ],
    "aiReports": [
      {
        "report_id": "report_123",
        "crime_type": "illegal_logging",
        "confidence": 92.5,
        "risk_score": 85,
        "severity": "critical"
      },
      {
        "report_id": "report_124",
        "crime_type": "illegal_mining",
        "confidence": 78.5,
        "risk_score": 72,
        "severity": "high"
      }
    ]
  }
}
```

### Get Crime Hotspots

**Fetch known environmental crime hotspots from AI service**

```http
GET /api/ai-integration/hotspots
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Amazon Rainforest",
      "latitude": -1.5,
      "longitude": -60.0,
      "crime_type": "illegal_logging",
      "severity": "critical",
      "last_detected": "2026-04-18T23:52:33.912Z"
    },
    {
      "name": "Congo Basin",
      "latitude": 0.0,
      "longitude": 25.0,
      "crime_type": "illegal_mining",
      "severity": "high",
      "last_detected": "2026-04-18T20:00:00.000Z"
    }
  ]
}
```

### Get AI Service Statistics

**Retrieve statistics from AI service**

```http
GET /api/ai-integration/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_reports": 1250,
    "critical_crimes": 145,
    "high_severity_crimes": 320,
    "average_risk_score": 62.5,
    "most_common_crime": "illegal_logging",
    "affected_area_total_hectares": 125000.5,
    "timestamp": "2026-04-18T23:52:33.912Z"
  }
}
```

### Get AI Service Reports

**Fetch recent detection reports from AI service**

```http
GET /api/ai-integration/reports
Authorization: Bearer {token}
```

### Receive Webhooks

**Webhook endpoint for AI service to send notifications (Public - No Auth)**

```http
POST /api/ai-integration/webhook
Content-Type: application/json

{
  "event": "crime_detected",
  "data": {
    "report_id": "report_789",
    "crime_type": "water_pollution",
    "confidence": 85.5,
    "risk_score": 78,
    "severity": "high",
    "spectral_indices": {
      "ndvi": 0.456,
      "ndwi": -0.567,
      "ndbi": 0.234
    },
    "evidence": "Water contamination detected...",
    "required_action": "Investigation required",
    "affected_area_hectares": 500.0,
    "timestamp": "2026-04-18T23:52:33.912Z",
    "location": {
      "name": "River Region",
      "latitude": 35.0,
      "longitude": 45.0
    }
  },
  "timestamp": "2026-04-18T23:52:33.912Z"
}
```

## Database Schema

### Violation Model Updates

The Violation model now includes AI service specific fields:

```javascript
{
  title: String,
  description: String,
  crimeType: String,  // Now includes environmental crime types
  riskScore: Number,
  confidence: Number,
  location: {
    type: Point,
    coordinates: [longitude, latitude],
    address: String
  },
  status: String,
  detectedAt: Date,
  detectedBy: ObjectId (User),
  source: String,  // 'ai_detection', 'manual_report', 'integration'
  spectralIndices: {  // NEW: AI service data
    ndvi: Number,
    ndwi: Number,
    ndbi: Number
  },
  affectedAreaHectares: Number,  // NEW
  requiredAction: String,         // NEW
  aiReportId: String,            // NEW
  createdAt: Date,
  updatedAt: Date
}
```

## Crime Type Enumerations

### Environmental Crimes (AI Service)
- `illegal_logging` - Unauthorized tree cutting and deforestation
- `illegal_mining` - Unauthorized mineral extraction
- `water_pollution` - Water contamination and pollution
- `land_degradation` - Soil erosion and land degradation
- `ecosystem_damage` - General ecosystem harm
- `none` - No crime detected

### General Crimes (Legacy Support)
- `theft`
- `assault`
- `vandalism`
- `fraud`
- `traffic`
- `other`

## Testing the Integration

### 1. Test Backend-to-AI Service Connection

```bash
# Open PowerShell in backend directory
cd backend

# Test AI service health
curl http://127.0.0.1:5000/api/ai-integration/health
```

Expected Response: `"aiServiceHealthy": true`

### 2. Test Crime Detection

```bash
# First, login to get a token
curl -X POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Use the returned token in subsequent requests
curl -X POST http://127.0.0.1:5000/api/ai-integration/detect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "latitude": -15.5,
    "longitude": -56.5,
    "location_name": "Amazon Test",
    "address": "Amazon Basin, Brazil"
  }'
```

### 3. Test Batch Detection

```bash
curl -X POST http://127.0.0.1:5000/api/ai-integration/batch-detect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "locations": [
      {
        "latitude": -15.5,
        "longitude": -56.5,
        "location_name": "Amazon",
        "address": "Brazil"
      },
      {
        "latitude": 1.0,
        "longitude": 110.0,
        "location_name": "Borneo",
        "address": "Indonesia"
      }
    ]
  }'
```

### 4. View Stored Violations

```bash
curl -X GET http://127.0.0.1:5000/api/violations \
  -H "Authorization: Bearer {token}"
```

## Error Handling

The integration includes comprehensive error handling:

1. **AI Service Unavailable**: Returns 500 with clear error message
2. **Invalid Request Data**: Returns 400 with validation errors
3. **Database Errors**: Returns 500 with error details
4. **Authentication Errors**: Returns 401/403 for protected routes

## Logging

All integration operations are logged:

```
🎯 Processing crime detection for location: Amazon Test
🔍 Calling AI Service: POST http://127.0.0.1:8000/api/v1/detect
✅ AI Service response received
✅ Violation record created: 507f1f77bcf86cd799439011
```

## Troubleshooting

### AI Service Connection Issues

1. **Verify AI service is running:**
   ```bash
   curl http://127.0.0.1:8000/health
   ```

2. **Check environment variables:**
   ```bash
   # In backend .env
   AI_SERVICE_URL=http://127.0.0.1:8000
   ```

3. **Check logs in terminal running AI service**

### Database Issues

1. **Verify MongoDB is running:**
   ```bash
   mongosh
   ```

2. **Check connection string in .env:**
   ```bash
   MONGODB_URI=mongodb://localhost:27017/ecis
   ```

### Request Issues

1. **Missing Authorization Header:**
   - All routes except `/health` and `/webhook` require authentication
   - Include: `Authorization: Bearer {token}`

2. **Invalid Coordinates:**
   - Latitude: -90 to 90
   - Longitude: -180 to 180

## Future Enhancements

1. Caching AI service responses
2. Rate limiting for AI service calls
3. Async job queue for batch processing
4. Real-time WebSocket updates for crime detection
5. Machine learning model training on detected violations
6. Advanced filtering and search capabilities
