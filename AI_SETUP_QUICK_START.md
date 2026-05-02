# Quick Setup Guide - AI Service Integration

## Prerequisites
- Node.js 14+ installed
- Python 3.8+ installed
- MongoDB running locally or remote connection
- npm or yarn package manager

## Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (includes axios for AI service calls)
npm install

# Create .env file with configuration
echo MONGODB_URI=mongodb://localhost:27017/ecis > .env
echo JWT_SECRET=your_super_secret_key >> .env
echo AI_SERVICE_URL=http://127.0.0.1:8000 >> .env
echo NODE_ENV=development >> .env

# Start backend server
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
📨 Server running on http://127.0.0.1:5000
```

## Step 2: AI Service Setup

Open a new terminal:

```bash
# Navigate to AI service directory
cd ai-service

# The app should already be fixed (no deprecation warnings)
python app.py
```

**Expected Output:**
```
🌍 ECIS - Environmental Crime Intelligence System
🚀 SERVER: http://127.0.0.1:8000
✅ No deprecation warnings
```

## Step 3: Verify Integration

Open another terminal and test:

```bash
# Test health check (no auth required)
curl http://127.0.0.1:5000/api/ai-integration/health

# Expected response:
# {"success":true,"aiServiceHealthy":true,"timestamp":"2026-04-18T..."}
```

## Step 4: Test Crime Detection

### 1. Get Authentication Token

```bash
# Register a new user
curl -X POST http://127.0.0.1:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Login to get token
curl -X POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Save the returned token
```

### 2. Detect Crime at Location

```bash
# Replace TOKEN with the actual token from login
curl -X POST http://127.0.0.1:5000/api/ai-integration/detect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "latitude": -15.5,
    "longitude": -56.5,
    "location_name": "Amazon Rainforest Test",
    "address": "Amazon Basin, Brazil"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "violationId": "...",
    "aiResult": {
      "report_id": "...",
      "crime_type": "...",
      "confidence": 92.5,
      "risk_score": 85,
      "severity": "critical",
      "spectral_indices": {...}
    }
  }
}
```

### 3. Check Violation in Database

```bash
curl -X GET http://127.0.0.1:5000/api/violations \
  -H "Authorization: Bearer TOKEN"
```

## Available Integration Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/ai-integration/health` | ❌ | Check AI service status |
| POST | `/api/ai-integration/detect` | ✅ | Single location crime detection |
| POST | `/api/ai-integration/batch-detect` | ✅ | Multiple locations detection |
| GET | `/api/ai-integration/hotspots` | ✅ | Get crime hotspots |
| GET | `/api/ai-integration/stats` | ✅ | Get AI service statistics |
| GET | `/api/ai-integration/reports` | ✅ | Get recent reports |
| POST | `/api/ai-integration/webhook` | ❌ | Receive AI service webhooks |

## Data Flow

```
Frontend Request
    ↓
Backend API receives request (with auth token)
    ↓
Backend calls AI Service with coordinates
    ↓
AI Service analyzes location using satellite data
    ↓
AI Service returns crime detection results
    ↓
Backend creates Violation record in MongoDB
    ↓
Backend returns both AI results and database record to Frontend
```

## Troubleshooting

### Backend can't reach AI Service

```bash
# Check if AI service is running
curl http://127.0.0.1:8000/health

# If not running, start it:
cd ai-service
python app.py
```

### MongoDB connection error

```bash
# Verify MongoDB is running (Windows)
# Open PowerShell and check mongod process
Get-Process mongod

# Or start MongoDB service
# Open Windows Services and start MongoDB
```

### Port already in use

```bash
# Find process using port 5000 (backend)
netstat -ano | findstr :5000

# Find process using port 8000 (AI service)
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

## Next Steps

1. ✅ Backend and AI service running
2. ✅ Health check passing
3. ✅ Successfully detecting crimes
4. 📄 Read [AI_INTEGRATION_GUIDE.md](AI_INTEGRATION_GUIDE.md) for detailed API documentation
5. 🎨 Integrate detection UI in frontend
6. 📊 Build analytics dashboard using stats endpoint

## Environment Variables Reference

```bash
# .env file for backend
MONGODB_URI=mongodb://localhost:27017/ecis
JWT_SECRET=your_secret_key_here
AI_SERVICE_URL=http://127.0.0.1:8000
NODE_ENV=development
PORT=5000
```

## Database Collections

After testing, check MongoDB:

```bash
# Connect to MongoDB
mongosh

# Use ECIS database
use ecis

# View violations
db.violations.find().pretty()

# View statistics
db.violations.countDocuments()
db.violations.aggregate([{$group: {_id: "$crimeType", count: {$sum: 1}}}])
```

## Support

For detailed API documentation, see [AI_INTEGRATION_GUIDE.md](AI_INTEGRATION_GUIDE.md)
