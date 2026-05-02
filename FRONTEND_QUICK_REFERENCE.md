# Frontend Quick Reference

## 🚀 Quick Commands

```bash
# Install & Run
npm install
npm run dev              # Development
npm run build            # Production build
npm run preview          # Preview build

# Accessing the App
http://localhost:5173
```

## 📁 File Structure

```
src/
├── components/         # Reusable components
├── pages/             # Route pages
├── services/          # API calls
├── utils/             # Helpers & constants
├── styles/            # CSS
├── App.jsx
└── main.jsx
```

## 🎨 Styling

### Neon Colors
```html
<!-- Text -->
<p class="text-neon-green">#00ff88</p>
<p class="text-neon-cyan">#00ffff</p>

<!-- Background -->
<div class="bg-dark-900">Main BG</div>
<div class="bg-dark-800">Card BG</div>
```

### Common Classes
```html
<div class="glass">                <!-- Blur effect -->
<div class="card">                 <!-- Card style -->
<button class="btn-primary">      <!-- Main button -->
<button class="btn-secondary">    <!-- Secondary -->
<span class="badge">              <!-- Badge label -->
<input class="input-field">       <!-- Input style -->
<div class="neon-glow">            <!-- Glow effect -->
```

## 🔐 Authentication

```javascript
import { authService } from '@/services/api'

// Register
authService.register({ name, email, password })

// Login
const res = await authService.login({ email, password })
localStorage.setItem('token', res.data.token)

// Logout
authService.logout()
localStorage.removeItem('token')
```

## 📡 API Calls

```javascript
import { crimeService, violationService } from '@/services/api'

// Crime Detection
crimeService.detectCrime(lat, lng, name, address)
crimeService.getHotspots()
crimeService.getStats()

// Violations
violationService.getViolations({ page, limit })
violationService.getAnalytics()
```

## 🔄 React Hooks

```jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// State
const [data, setData] = useState(null)

// Effects
useEffect(() => { /* code */ }, [deps])

// Navigation
const navigate = useNavigate()
navigate('/page')

// Location
const location = useLocation()
location.pathname
```

## ✨ Framer Motion

```jsx
import { motion } from 'framer-motion'

// Basic animation
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</motion.div>

// Hover effects
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>

// Stagger children
<motion.div initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: i * 0.1 }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

## 📊 Charts (Recharts)

```jsx
import {
  LineChart, BarChart, PieChart,
  Line, Bar, Pie,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const data = [{ name: 'A', value: 100 }]

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#00ff88" />
  </BarChart>
</ResponsiveContainer>
```

## 🗺️ Maps (Leaflet)

```jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

<MapContainer center={[lat, lng]} zoom={4}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <Marker position={[lat, lng]}>
    <Popup>Location info</Popup>
  </Marker>
</MapContainer>
```

## 🔔 Notifications

```javascript
import toast from 'react-hot-toast'

toast.success('Success message')
toast.error('Error message')
toast.loading('Loading message')
```

## 🛡️ Protected Routes

```jsx
import ProtectedRoute from '@/components/ProtectedRoute'

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 📝 Forms

```jsx
const [form, setForm] = useState({ name: '', email: '' })

const handleChange = (e) => {
  const { name, value } = e.target
  setForm(prev => ({ ...prev, [name]: value }))
}

<input
  name="email"
  value={form.email}
  onChange={handleChange}
  class="input-field"
/>
```

## 🔍 Utility Functions

```javascript
import {
  cn,                      // Class name merger
  crimeTypeColors,         // Color mapping
  severityColors,
  formatDate,              // Date formatter
  formatCoordinates,       // Coords formatter
  getRiskLevelColor,       // Risk color
  getRiskLevelLabel        // Risk label
} from '@/utils/constants'

formatDate(new Date())
// → 'Apr 19, 2026 at 11:23 AM'

getRiskLevelColor(85)
// → 'text-red-400'

getRiskLevelLabel(85)
// → 'Critical'
```

## 💻 Environment Variables

```bash
# .env file
VITE_API_URL=http://localhost:5000/api

# Access in code
const url = import.meta.env.VITE_API_URL
```

## 🐛 Common Issues

### CORS Error
```javascript
// Backend must have CORS enabled:
// app.use(cors())

// Frontend .env should have:
// VITE_API_URL=http://localhost:5000/api
```

### Token Not Sent
```javascript
// Axios interceptor automatically adds token
// Token must be in localStorage:
localStorage.setItem('token', response.data.token)
```

### Port in Use
```bash
# Change vite.config.js:
server: { port: 5174 }
```

### Build Fails
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

## 📚 Imports Cheat Sheet

```javascript
// Components
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import ProtectedRoute from '@/components/ProtectedRoute'

// Pages
import Dashboard from '@/pages/Dashboard'
import Detection from '@/pages/Detection'
import Reports from '@/pages/Reports'
import Hotspots from '@/pages/Hotspots'

// Services
import { authService, crimeService, violationService } from '@/services/api'

// Utils
import { cn, crimeTypeColors, formatDate } from '@/utils/constants'

// Libraries
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ResponsiveContainer, BarChart } from 'recharts'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
```

## 🎯 Component Template

```jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { crimeService } from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function MyComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await crimeService.getStats()
        setData(res.data)
      } catch (error) {
        toast.error('Failed to load')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Content */}
    </motion.div>
  )
}
```

## 🔗 Useful Links

- API: http://localhost:5000/api
- Frontend: http://localhost:5173
- Swagger: http://localhost:5000/api/docs
- AI Docs: http://localhost:8000/docs
- Tailwind: https://tailwindcss.com
- Framer: https://www.framer.com/motion/

---

**Last Updated:** April 19, 2026
