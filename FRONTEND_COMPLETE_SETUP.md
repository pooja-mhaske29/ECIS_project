# ECIS Frontend - Complete Setup Guide

## 🎯 Overview

This is a production-ready React + Vite frontend for the Environmental Crime Intelligence System (ECIS). The application features satellite imagery analysis as the primary method for detecting environmental crimes including illegal logging, mining, water pollution, and land degradation.

## ✨ Key Features

### 1. **Satellite Analysis** (Primary Feature)
- Drag-and-drop satellite image upload
- Image display with zoom, pan, and rotate controls
- Spectral indices visualization (NDVI, NDWI, NDBI)
- Before/after comparison slider for change detection
- Crime detection overlay with color-coded polygons
- Real-time AI-powered analysis

### 2. **Dashboard**
- Real-time statistics cards with live API data
- Crime type distribution bar chart
- Risk level distribution donut chart
- 7-day crime trends line chart
- Interactive hotspot map with Leaflet
- Recent alerts feed
- Auto-refresh every 10 seconds

### 3. **Fixed Sidebar Navigation**
- Permanent 280px sidebar (never collapses)
- Dark glassmorphic design with neon green accents
- Quick access to all major features
- Real-time API health indicator

### 4. **Additional Pages**
- **Crime Detection**: Single-location detection
- **Reports**: Filterable list of all reports
- **Hotspots**: Map-based view of crime hotspots
- **Statistics**: Detailed analytics and trends
- **Settings**: User preferences and configuration

## 📋 Prerequisites

- Node.js 16+ and npm
- Backend running on `http://localhost:8000`
- Modern web browser (Chrome, Firefox, Safari)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Edit `.env` file:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_MAPBOX_TOKEN=your_token_here
VITE_SENTINEL_API_KEY=your_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx          # Fixed sidebar navigation
│   │   │   ├── Header.jsx           # Top header with time/status
│   │   │   └── MainLayout.jsx       # Main layout wrapper
│   │   ├── Satellite/
│   │   │   ├── ImageUploader.jsx    # Drag-drop upload
│   │   │   ├── SatelliteViewer.jsx  # Image display & controls
│   │   │   ├── BandSelector.jsx     # Spectral indices selection
│   │   │   ├── ComparisonSlider.jsx # Before/after comparison
│   │   │   ├── OverlayRenderer.jsx  # Crime polygon overlay
│   │   │   ├── AnalysisControls.jsx # Detection controls
│   │   │   └── ResultsPanel.jsx     # Results display
│   │   ├── Dashboard/
│   │   │   ├── StatsCards.jsx       # Statistics cards
│   │   │   ├── CrimeTypeChart.jsx   # Crime distribution
│   │   │   ├── RiskLevelChart.jsx   # Risk distribution
│   │   │   ├── TrendsChart.jsx      # 7-day trends
│   │   │   ├── HotspotMap.jsx       # Leaflet map
│   │   │   └── RecentAlerts.jsx     # Alert feed
│   │   ├── Detection/
│   │   │   ├── CoordinateInput.jsx
│   │   │   ├── SpectralIndicesDisplay.jsx
│   │   │   └── ResultsCard.jsx
│   │   └── Common/
│   │       ├── LoadingSpinner.jsx
│   │       ├── ErrorBoundary.jsx
│   │       ├── ToastNotification.jsx
│   │       └── ConfirmDialog.jsx
│   ├── pages/
│   │   ├── SatelliteAnalysis.jsx    # MAIN PAGE - satellite focus
│   │   ├── Dashboard.jsx
│   │   ├── CrimeDetection.jsx
│   │   ├── Reports.jsx
│   │   ├── Hotspots.jsx
│   │   ├── Statistics.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── api.js                  # Axios instance
│   │   └── satelliteApi.js         # Satellite endpoints
│   ├── hooks/
│   │   ├── useCrimeDetection.js    # Detection hook
│   │   └── useRealTimeStats.js     # Stats hook
│   ├── utils/
│   │   ├── imageProcessing.js      # Spectral calculations
│   │   └── constants.js             # App constants
│   ├── styles/
│   │   └── index.css               # Tailwind + custom styles
│   ├── App.jsx                      # Main app component
│   └── main.jsx                     # Entry point
├── public/
│   └── icons/                       # Icons
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env
```

## 🎨 Design System

### Color Palette
- **Primary**: Emerald Green (`#10b981`)
- **Secondary**: Cyan (`#06b6d4`)
- **Background**: Dark Gray (`#111827`)
- **Accent**: Neon Green (`#00ff88`)

### Crime Detection Colors
- 🔴 Red: Illegal Mining
- 🟡 Yellow: Illegal Logging
- 🔵 Blue: Water Pollution
- 🟠 Orange: Land Degradation

### Theme
- Dark mode with glassmorphism effects
- Tailwind CSS for utilities
- Framer Motion for animations
- Professional, futuristic tech look

## 🔌 API Integration

### Base URL
```
http://localhost:8000/api/v1
```

### Key Endpoints

**Statistics**
- `GET /stats` - Dashboard statistics
- `GET /hotspots` - Crime hotspots
- `GET /reports` - All reports (paginated)

**Satellite Analysis**
- `POST /satellite/analyze` - Upload and analyze image
- `GET /satellite/image` - Fetch image by coordinates
- `POST /satellite/compare` - Compare two dates

**Detection**
- `POST /detect` - Single location detection
- `POST /batch-detect` - Multiple locations

## 📊 Real-Time Features

### Auto-Refresh
- Dashboard stats: Every 10 seconds
- API health check: Every 30 seconds
- Charts update automatically
- No manual refresh needed

### Live Updates
- Alert feed with latest detections
- Animated stat counters
- Real-time API status indicator
- WebSocket support for future enhancements

## 🛠️ Components Architecture

### Layout Component (Fixed Sidebar)
```jsx
<MainLayout>
  <Dashboard />
</MainLayout>
```

The sidebar is **permanently fixed** at 280px width:
- Never collapses or hides
- Always visible on all pages
- Main content has `ml-72` margin
- Header positioned at `ml-72`

### Dashboard Components
All dashboard components fetch real data from the backend:
- `StatsCards` - Fetches from `/stats`
- `CrimeTypeChart` - Uses crimes_by_type data
- `RiskLevelChart` - Uses risk_distribution
- `TrendsChart` - Aggregates reports by date
- `RecentAlerts` - Last 5 reports
- `HotspotMap` - All hotspots with clustering

## 🔐 Security

- Authentication tokens stored in localStorage
- Request interceptors add Bearer token
- 401 responses redirect to login
- CORS handled by Vite proxy
- Environment variables for sensitive data

## 🧪 Development Tips

### Using Mock Data
If backend is offline, components gracefully handle empty responses:
```javascript
const stats = {
  total_reports: 0,
  critical_crimes: 0,
  active_hotspots: 0,
  // ... other fields
};
```

### Hot Reload
Vite provides instant Hot Module Replacement:
```bash
npm run dev
# Edit files and see changes immediately
```

### Debugging
- React DevTools recommended
- Network tab to inspect API calls
- Console logs for data flow
- Tailwind IntelliSense VSCode extension

## 📦 Dependencies

### Core
- `react@18` - UI library
- `react-router-dom@6` - Routing
- `vite@5` - Build tool

### Data & State
- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching
- `zustand` - State management

### UI & Animation
- `tailwindcss@3` - Styling
- `framer-motion` - Animations
- `recharts` - Charts
- `react-leaflet` - Maps
- `react-dropzone` - File upload
- `react-hot-toast` - Notifications

### Utilities
- `date-fns` - Date formatting
- `react-icons` - Icon library

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

### API connection issues
- Check backend is running on `http://localhost:8000`
- Check `VITE_API_URL` in `.env`
- Look at Network tab in DevTools
- Check browser console for CORS errors

### Styling not applying
- Run `npm install` again
- Clear browser cache
- Restart dev server with `npm run dev`

### Maps not showing
- Install `leaflet`: `npm install leaflet`
- Check for L.Icon.Default errors
- Marker icons require CDN or local assets

## 📈 Performance Optimizations

- Code splitting with lazy loading
- Image optimization
- Memoization of expensive components
- Virtual scrolling for large lists
- Debounced API calls

## 🚢 Deployment

### Build Production
```bash
npm run build
```

Output goes to `dist/` folder

### Environment Variables
Set in `.env`:
```env
VITE_API_URL=https://api.ecis.example.com/api/v1
VITE_WS_URL=wss://api.ecis.example.com/ws
```

### Deploy Options
- Vercel
- Netlify
- AWS S3 + CloudFront
- Docker container
- Traditional web server (Apache, Nginx)

## 📝 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env` file
3. ✅ Start backend on port 8000
4. ✅ Run frontend: `npm run dev`
5. ✅ Open browser at `http://localhost:5173`
6. ✅ Test satellite image upload
7. ✅ Verify dashboard data loading
8. ✅ Check all navigation links

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify backend is running
3. Check network requests in DevTools
4. Review this guide for troubleshooting

## 📄 License

ECIS Frontend - Environmental Crime Intelligence System
