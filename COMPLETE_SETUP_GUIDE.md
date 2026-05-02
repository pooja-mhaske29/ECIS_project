# 🌍 ECIS - Environmental Crime Intelligence System
## Complete Setup & Deployment Guide

A full-stack MERN application for real-time detection of environmental crimes using satellite spectral analysis.

---

## 📋 Project Structure

```
ECIS_project/
├── backend/                    # Node.js + Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env
├── ai-service/                 # Python + FastAPI
│   ├── app.py
│   ├── environmental_detector.py
│   ├── planet_client.py
│   ├── sentinel_client.py
│   ├── requirements.txt
│   └── .env
├── frontend/                   # React + Vite
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
├── AI_INTEGRATION_GUIDE.md
├── AI_SETUP_QUICK_START.md
└── README.md
```

---

## 🚀 Quick Start (All Services)

### Prerequisites
- **Node.js** 16+ with npm
- **Python** 3.8+ with pip
- **MongoDB** (local or Atlas)
- **Git**

### Step 1: Clone & Initial Setup

```bash
# Navigate to project
cd c:\Users\LENOVO\ECIS_project

# Create .env files for each service
```

---

## 🔧 Backend Setup (Node.js + Express)

### Installation

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ecis

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this

# AI Service Integration
AI_SERVICE_URL=http://127.0.0.1:8000

# Server Configuration
NODE_ENV=development
PORT=5000
HOST=127.0.0.1
EOF
```

### Database Setup

```bash
# Ensure MongoDB is running
# Windows: Start MongoDB service or run mongod locally

# Create database indexes (optional, automatic on first run)
mongosh ecis
```

### Start Backend Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
📨 Server running on http://127.0.0.1:5000
```

**Available Endpoints:**
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Login user
- `POST /api/ai-integration/detect` - Single location detection
- `POST /api/ai-integration/batch-detect` - Batch detection
- `GET /api/ai-integration/hotspots` - Get hotspots
- `GET /api/ai-integration/stats` - Get statistics
- `GET /api/violations` - Get violations
- `GET /api/violations/analytics` - Get analytics

---

## 🤖 AI Service Setup (Python + FastAPI)

### Installation

```bash
cd ai-service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

The AI service automatically loads environment variables. No .env file needed if using defaults.

### Start AI Service

```bash
python app.py
```

**Expected Output:**
```
🌍 ECIS - Environmental Crime Intelligence System
🚀 SERVER: http://127.0.0.1:8000
📚 API DOCUMENTATION: http://127.0.0.1:8000/docs
✅ No deprecation warnings
```

**Available Endpoints:**
- `POST /api/v1/detect` - Single location detection
- `POST /api/v1/batch-detect` - Batch detection
- `GET /api/v1/hotspots` - Get hotspots
- `GET /api/v1/stats` - Get statistics
- `GET /api/v1/reports` - Get reports
- `GET /health` - Health check

---

## 🎨 Frontend Setup (React + Vite)

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
# API Configuration
VITE_API_URL=http://localhost:5000/api
EOF
```

### Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://127.0.0.1:5173/
```

**Access the App:**
- Open http://localhost:5173 in your browser
- You'll be redirected to login page
- Create account or use demo credentials

---

## 🔐 Authentication & Demo Credentials

### Register New User
```bash
# POST http://localhost:5000/api/auth/register
{
  "name": "Your Name",
  "email": "your@email.com",
  "password": "YourPassword123!"
}
```

### Login
```bash
# POST http://localhost:5000/api/auth/login
{
  "email": "your@email.com",
  "password": "YourPassword123!"
}
```

### Demo Credentials
If demo account exists:
- Email: `demo@example.com`
- Password: `Demo123!`

---

## 🧪 Testing the Integration

### 1. Verify All Services Running

```bash
# Terminal 1 - Backend (Port 5000)
cd backend && npm run dev

# Terminal 2 - AI Service (Port 8000)
cd ai-service && python app.py

# Terminal 3 - Frontend (Port 5173)
cd frontend && npm run dev
```

### 2. Test API Endpoints

```bash
# Check health
curl http://localhost:5000/api/ai-integration/health

# Expected response:
# {"success":true,"aiServiceHealthy":true,"timestamp":"..."}
```

### 3. Test Crime Detection

```bash
# 1. Get auth token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "Demo123!"
  }'

# 2. Use token to detect crime
curl -X POST http://localhost:5000/api/ai-integration/detect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "latitude": -15.5,
    "longitude": -56.5,
    "location_name": "Amazon Test",
    "address": "Amazon Basin, Brazil"
  }'
```

---

## 📊 Frontend Features

### Dashboard
- Real-time crime statistics
- Risk level distribution charts
- Crime type analysis
- Recent violations
- AI service health status

### Crime Detection
- Interactive coordinate input
- Current location detection
- Spectral indices visualization (NDVI, NDWI, NDBI)
- Severity gauge
- Evidence summary
- Risk score analysis

### Reports
- Searchable crime reports table
- Advanced filtering by:
  - Crime type
  - Status
  - Risk score range
  - Date range
- CSV export functionality
- Pagination

### Hotspots
- Interactive Leaflet map
- Crime hotspot markers
- Heat circles by severity
- Crime type layer filtering
- Hotspot statistics

---

## 🎨 Design System

### Color Palette
```
Neon Green:   #00ff88  (Primary accent)
Neon Cyan:    #00ffff  (Secondary accent)
Dark BG:      #0a0e27  (Background)
Dark Card:    #131829  (Card background)
```

### Component Library
- Glassmorphism cards
- Neon glowing effects
- Smooth animations (Framer Motion)
- Responsive grid layouts
- Toast notifications

---

## 📦 Build & Deployment

### Frontend Build

```bash
cd frontend

# Production build
npm run build

# Output in dist/ folder
# Ready to deploy to Netlify, Vercel, etc.
```

### Backend Deployment

```bash
# Ensure .env is configured for production
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret
AI_SERVICE_URL=https://ai-service.example.com

# Deploy to Heroku, AWS, DigitalOcean, etc.
```

### AI Service Deployment

```bash
# Ensure requirements.txt is up to date
pip freeze > requirements.txt

# Deploy to Heroku, AWS Lambda, or dedicated server
```

---

## 🐛 Troubleshooting

### Backend Won't Connect to MongoDB
```bash
# Check MongoDB is running
# Windows Service:
Get-Service MongoDB

# Or start mongod:
mongod --dbpath "C:\data\db"
```

### AI Service Port Already in Use
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process
taskkill /PID <PID> /F
```

### Frontend Can't Reach Backend
```bash
# Check .env file
cat frontend/.env
# Should have: VITE_API_URL=http://localhost:5000/api

# Check backend is running on 5000
curl http://localhost:5000/health
```

### JWT Token Issues
```bash
# Clear localStorage and login again
# In browser console:
localStorage.clear()
```

---

## 📚 API Documentation

### Backend API
Swagger documentation available at:
```
http://localhost:5000/api/docs  (if Swagger is set up)
```

### AI Service API
Interactive docs at:
```
http://127.0.0.1:8000/docs
http://127.0.0.1:8000/redoc
```

---

## 🔄 Development Workflow

### Making Changes

**Backend:**
```bash
cd backend
npm run dev  # Auto-reloads on file changes
```

**AI Service:**
```bash
cd ai-service
python app.py  # Restart manually on changes
```

**Frontend:**
```bash
cd frontend
npm run dev  # Auto-reloads on file changes
```

---

## 📝 Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/ecis
JWT_SECRET=your_secret_key
AI_SERVICE_URL=http://127.0.0.1:8000
NODE_ENV=development
PORT=5000
HOST=127.0.0.1
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### AI Service (.env) - Optional
```
# Uses Python environment variables
# No specific .env needed for defaults
```

---

## 🎯 Next Steps

1. ✅ Install all dependencies
2. ✅ Configure .env files
3. ✅ Start all three services
4. ✅ Test API endpoints
5. ✅ Create user account
6. ✅ Test crime detection
7. ✅ Explore dashboard & reports
8. ✅ Deploy to production

---

## 📞 Support

For detailed API documentation, see:
- [AI Integration Guide](./AI_INTEGRATION_GUIDE.md)
- [Quick Start Guide](./AI_SETUP_QUICK_START.md)
- Backend README: `./backend/README.md`
- Frontend README: `./frontend/README.md`

---

## 📄 License

MIT License - See LICENSE file for details

---

**Last Updated:** April 19, 2026
**Status:** Production Ready ✨
