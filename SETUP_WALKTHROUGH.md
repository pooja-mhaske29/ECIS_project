# 🚀 Complete System Setup Walkthrough

Follow this step-by-step guide to get the entire ECIS system running.

---

## ✅ Pre-Installation Checklist

- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Python 3.8+ installed (`python --version`)
- [ ] MongoDB installed or Atlas account created
- [ ] Git installed
- [ ] Visual Studio Code (or preferred editor)

---

## 📋 Setup Checklist

### Phase 1: Environment Preparation

#### 1.1 Verify Prerequisites
```powershell
# Check Node.js
node --version
npm --version

# Check Python
python --version

# Check MongoDB (if installed locally)
mongod --version
```

**✅ Expected:** All commands show version numbers

---

### Phase 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```powershell
cd c:\Users\LENOVO\ECIS_project\backend
```

#### 2.2 Install Dependencies
```powershell
npm install
```

**⏱️ Expected time:** 2-3 minutes
**✅ Expected:** No errors, node_modules folder created

#### 2.3 Create .env File
```powershell
# Option 1: Using cat
cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/ecis
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
AI_SERVICE_URL=http://127.0.0.1:8000
NODE_ENV=development
PORT=5000
HOST=127.0.0.1
EOF

# Option 2: Using Notepad (GUI)
notepad .env
# Then copy and paste the above content
```

#### 2.4 Verify Backend Structure
```powershell
# Check files exist
ls controllers/
ls models/
ls routes/
ls services/aiService.js
```

**✅ Expected:** All folders and files visible

#### 2.5 **SKIP THIS STEP** - MongoDB already running
The project documentation shows MongoDB should be running. Ensure it is:

```powershell
# Check if MongoDB service is running (Windows)
Get-Service MongoDB

# If not running, start it:
# Start-Service MongoDB
```

#### 2.6 Start Backend Server
```powershell
npm run dev
```

**⏱️ Expected time:** 10-15 seconds
**✅ Expected Output:**
```
✅ MongoDB Connected Successfully
📨 Server running on http://127.0.0.1:5000
```

**Keep this terminal running!** ✅

---

### Phase 3: AI Service Setup

#### 3.1 Open New Terminal
Press `Ctrl+Shift+`` in VS Code OR open a new PowerShell window

#### 3.2 Navigate to AI Service
```powershell
cd c:\Users\LENOVO\ECIS_project\ai-service
```

#### 3.3 Verify Python Dependencies
```powershell
# Check if requirements.txt exists
ls requirements.txt

# Install dependencies
pip install -r requirements.txt
```

**⏱️ Expected time:** 2-3 minutes (or faster if cached)
**✅ Expected:** All packages installed successfully

#### 3.4 Start AI Service
```powershell
python app.py
```

**⏱️ Expected time:** 5-10 seconds
**✅ Expected Output:**
```
2026-04-19 23:52:33,912 - __main__ - INFO - EnvironmentalCrimeDetector initialized
🌍 ECIS - Environmental Crime Intelligence System
========================...========================
🚀 SERVER: http://127.0.0.1:8000
📚 API DOCUMENTATION: http://127.0.0.1:8000/docs
✅ No deprecation warnings
```

**Keep this terminal running!** ✅

---

### Phase 4: Frontend Setup

#### 4.1 Open Third Terminal
Press `Ctrl+Shift+`` again OR open another PowerShell window

#### 4.2 Navigate to Frontend
```powershell
cd c:\Users\LENOVO\ECIS_project\frontend
```

#### 4.3 Install Dependencies
```powershell
npm install
```

**⏱️ Expected time:** 3-4 minutes
**✅ Expected:** No errors, node_modules folder created

#### 4.4 Create .env File (if not exists)
```powershell
# Check if exists
cat .env

# If not, create it:
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF
```

#### 4.5 Start Frontend Development Server
```powershell
npm run dev
```

**⏱️ Expected time:** 10-15 seconds
**✅ Expected Output:**
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://127.0.0.1:5173/
➜  press h to show help
```

**Browser will open automatically** ✅

---

## 🧪 Testing Phase 1: Verify All Services

### Test 1.1: Health Check
Open a fourth terminal:
```powershell
# Test backend health
curl http://127.0.0.1:5000/health

# Expected response:
# {"success":true,"status":"OK","mongodb":"connected"}
```

### Test 1.2: AI Service Health
```powershell
# Test AI service
curl http://127.0.0.1:8000/health

# Expected response:
# {"success":true,"status":"healthy"}
```

### Test 1.3: Frontend Loads
Open browser: http://localhost:5173
**✅ Expected:** You see the ECIS login page

---

## 🔐 Testing Phase 2: Authentication

### Test 2.1: Register New User

In the browser at http://localhost:5173:

1. Click "Create one" link (bottom of login)
2. Fill in registration form:
   - **Name:** Test User
   - **Email:** test@example.com
   - **Password:** Test123!
   - **Confirm:** Test123!
3. Click "Create Account"

**✅ Expected:** 
- Success message
- Redirected to login page

### Test 2.2: Login with New Account

1. Enter email: `test@example.com`
2. Enter password: `Test123!`
3. Click "Sign In"

**✅ Expected:**
- Success notification
- Redirected to Dashboard
- Can see "Dashboard" in sidebar

---

## 📊 Testing Phase 3: Dashboard

### Test 3.1: Load Dashboard
You should already be on the Dashboard after login.

**Check:**
- [ ] Page loads without errors
- [ ] See statistics cards (Total Reports, Critical Crimes, etc.)
- [ ] Charts are visible and animated
- [ ] AI Service shows "Online" (green status)

### Test 3.2: Check API Data
Open browser DevTools (F12):

1. Go to Network tab
2. Check for requests to:
   - `/api/ai-integration/stats`
   - `/api/violations/analytics`
   - `/api/ai-integration/health`

**✅ Expected:** All return 200 OK with data

---

## 🎯 Testing Phase 4: Crime Detection

### Test 4.1: Navigate to Detection Page

1. Click "Detection" in sidebar
2. Page should load

### Test 4.2: Perform Crime Detection

Fill in the form:
- **Location Name:** Amazon Test
- **Latitude:** -15.5
- **Longitude:** -56.5
- **Address:** Amazon Basin, Brazil

Click "Analyze Location"

**⏱️ Wait:** 5-10 seconds
**✅ Expected:**
- Loading spinner appears
- Results show with crime analysis
- See spectral indices (NDVI, NDWI, NDBI)
- Risk score and severity displayed

### Test 4.3: Check Database

In backend terminal, the console should show:
```
🎯 Processing crime detection for location: Amazon Test
🔍 Calling AI Service: POST http://127.0.0.1:8000/api/v1/detect
✅ AI Service response received
✅ Violation record created: {id}
```

---

## 📋 Testing Phase 5: Reports

### Test 5.1: Navigate to Reports

1. Click "Reports" in sidebar
2. Page loads with violation data

**✅ Expected:**
- Table shows the detection you just created
- Crime type: "Illegal Logging" or similar
- Risk Score: 85 (from detection)
- Confidence: 92.5%

### Test 5.2: Test Filters

1. Click "Advanced Filters"
2. Select a Crime Type
3. Set Risk Score range (40-100)
4. Click Apply

**✅ Expected:** Table updates with filtered data

### Test 5.3: Test Export

1. Click "Export CSV" button
2. Download should start

**✅ Expected:** CSV file downloaded with violation data

---

## 🗺️ Testing Phase 6: Hotspots

### Test 6.1: Load Hotspots Page

1. Click "Hotspots" in sidebar
2. Page loads with map and sidebar

**✅ Expected:**
- Map displays
- Hotspot markers visible
- Crime type filter panel on left

### Test 6.2: Filter Crime Types

1. Uncheck some crime types in sidebar
2. Map should update with only selected types

**✅ Expected:** Markers update dynamically

---

## 🎬 Summary: What Should Be Running

### Three Active Terminals

**Terminal 1 - Backend:**
```
✅ MongoDB Connected Successfully
📨 Server running on http://127.0.0.1:5000
```

**Terminal 2 - AI Service:**
```
🌍 ECIS - Environmental Crime Intelligence System
🚀 SERVER: http://127.0.0.1:8000
```

**Terminal 3 - Frontend:**
```
VITE v5.0.0  ready

➜  Local:   http://127.0.0.1:5173/
```

**Browser:** http://localhost:5173 ✅

---

## 🐛 Troubleshooting Quick Fixes

### Backend Won't Connect to MongoDB
```powershell
# Check MongoDB is running
Get-Service MongoDB

# Or start mongod manually (if using local):
mongod --dbpath "C:\data\db"
```

### Port Already in Use
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Or change port in code:
# backend: .env → PORT=5001
# frontend: vite.config.js → port: 5174
```

### AI Service Crashes
```powershell
# Clear Python cache
py -m pip cache purge

# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

### Frontend Won't Load
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### API Errors 401/403
```javascript
// Clear localStorage and login again
// In browser console:
localStorage.clear()
location.reload()
```

---

## ✨ Success Indicators

You'll know everything is working when:

✅ **All 3 terminals running without errors**

✅ **Frontend loads at http://localhost:5173**

✅ **Can login with test account**

✅ **Dashboard shows real-time data**

✅ **Crime detection returns results in 5-10 seconds**

✅ **Reports show detected violations**

✅ **Hotspots map displays markers**

✅ **Export CSV works**

✅ **No console errors in browser DevTools**

---

## 🎉 Next Steps (After Successful Setup)

1. **Explore the Dashboard** - Check all statistics and charts
2. **Test Batch Detection** - Detect multiple locations at once
3. **View Reports** - Analyze detected crimes
4. **Customize Settings** - Update colors, API URLs, etc.
5. **Deploy to Production** - Follow deployment guides
6. **Integrate with Frontend** - Connect to your own UI
7. **Add Real Data** - Connect to actual satellite APIs

---

## 📞 Getting Help

If something isn't working:

1. **Check the logs:**
   - Backend: Terminal 1 output
   - AI Service: Terminal 2 output
   - Frontend: Browser console (F12)

2. **Refer to documentation:**
   - [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)
   - [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md)
   - [FRONTEND_DEVELOPMENT_GUIDE.md](./FRONTEND_DEVELOPMENT_GUIDE.md)

3. **Common issues:**
   - Port in use → Kill process or change port
   - MongoDB not connected → Start MongoDB service
   - API errors → Check backend is running
   - Module not found → Run `npm install`

---

**You're all set! Enjoy using ECIS! 🎉**

---

*Last Updated: April 19, 2026*
