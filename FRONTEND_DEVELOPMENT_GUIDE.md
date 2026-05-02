# Frontend Development Guide

## Project Overview

The ECIS Frontend is a modern React + Vite application with a dark theme, neon accents, and glassmorphism design. It provides an intuitive interface for environmental crime detection and analysis.

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend API running on http://localhost:5000

### Quick Setup

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

---

## Project Architecture

### Folder Structure

```
src/
├── components/
│   ├── Layout.jsx              # Main layout wrapper with sidebar
│   ├── ProtectedRoute.jsx      # Auth guard for routes
│   └── LoadingSpinner.jsx      # Loading state component
│
├── pages/
│   ├── Login.jsx               # Authentication page
│   ├── Register.jsx            # User registration
│   ├── Dashboard.jsx           # Statistics & analytics
│   ├── Detection.jsx           # Crime detection
│   ├── Reports.jsx             # Crime reports table
│   └── Hotspots.jsx            # Map & hotspots
│
├── services/
│   └── api.js                  # Axios HTTP client
│
├── utils/
│   └── constants.js            # Colors, formatters, helpers
│
├── styles/
│   └── index.css               # Tailwind & custom CSS
│
├── App.jsx                     # Main app component
└── main.jsx                    # Entry point
```

### Component Hierarchy

```
App
├── Router
│   ├── Login (public)
│   ├── Register (public)
│   └── Layout (protected)
│       ├── Dashboard
│       ├── Detection
│       ├── Reports
│       └── Hotspots
└── Toaster (notifications)
```

---

## Key Components

### Layout Component
Main layout wrapper providing:
- Sidebar navigation with animated menu
- Top bar with page title and datetime
- Mobile-responsive design with overlay
- Logout functionality

```jsx
<Layout>
  <Outlet />  {/* Child pages render here */}
</Layout>
```

### ProtectedRoute Component
Guards routes that require authentication:
```jsx
<ProtectedRoute>
  <Layout />
</ProtectedRoute>
```

### Loading Spinner
Full-screen animated loader:
```jsx
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

---

## Styling System

### Tailwind Classes

#### Colors
```css
/* Neon accents */
.text-neon-green    /* #00ff88 */
.text-neon-cyan     /* #00ffff */
.bg-neon-cyan/30    /* With transparency */

/* Dark backgrounds */
.bg-dark-900        /* Main background */
.bg-dark-800        /* Cards */
.bg-dark-700        /* Hover states */
```

#### Components
```css
.glass              /* Glassmorphism with blur */
.glass-dark         /* Dark variant */
.neon-glow          /* Green glow effect */
.neon-border        /* Green border */
.btn-primary        /* Main button style */
.btn-secondary      /* Secondary button */
.card               /* Card component */
.badge              /* Badge label */
.input-field        /* Input styling */
```

### Custom Animations
```css
.animate-pulse-glow  /* Pulsing glow effect */
.animate-float       /* Floating motion */
.animate-scan        /* Scanning effect */
```

---

## API Integration

### API Service (`services/api.js`)

The api service provides:
- Centralized axios instance
- Automatic JWT token injection
- Error handling and redirects
- Base URL configuration

```javascript
import { authService, crimeService, violationService } from '@/services/api'

// Auth
authService.register(data)
authService.login(data)
authService.logout()

// Crime Detection
crimeService.detectCrime(lat, lng, name, address)
crimeService.batchDetectCrimes(locations)
crimeService.getHotspots()
crimeService.getStats()
crimeService.getReports()
crimeService.checkHealth()

// Violations
violationService.getViolations(filters)
violationService.getViolation(id)
violationService.createViolation(data)
violationService.getAnalytics()
```

### Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. If 401, token cleared and user redirected to login

---

## State Management

The app uses React hooks for state management:

### useState
```javascript
const [violations, setViolations] = useState([])
const [loading, setLoading] = useState(true)
```

### useEffect
```javascript
useEffect(() => {
  fetchData()
}, [dependencies])
```

### useNavigate & useLocation
```javascript
const navigate = useNavigate()
const location = useLocation()
```

---

## Data Visualization

### Recharts
Charts for statistics visualization:
- PieChart - Crime type distribution
- BarChart - Risk scores
- LineChart - Trends
- ResponsiveContainer - Responsive sizing

```jsx
<ResponsiveContainer width="100%" height={300}>
  <PieChart data={data}>
    <Pie dataKey="count" />
    <Legend />
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

### Leaflet Maps
Interactive maps for hotspot visualization:
- MapContainer - Main map wrapper
- TileLayer - Background tiles
- Marker - Point markers
- Circle - Heat circles
- Popup - Information popups

```jsx
<MapContainer center={[lat, lng]} zoom={4}>
  <TileLayer url="..." />
  <Marker position={[lat, lng]}>
    <Popup>Information</Popup>
  </Marker>
</MapContainer>
```

---

## Animations

### Framer Motion
All animations use Framer Motion for smooth transitions:

```jsx
import { motion } from 'framer-motion'

// Hover animations
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Content
</motion.div>

// Initial animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  Content
</motion.div>

// Staggered animations
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
```

---

## Notifications

### React Hot Toast
Toast notifications for user feedback:

```javascript
import toast from 'react-hot-toast'

toast.success('Operation successful')
toast.error('Something went wrong')
toast.loading('Processing...')
```

---

## Utility Functions

### Color Helpers (`utils/constants.js`)

```javascript
import { crimeTypeColors, severityColors, statusColors } from '@/utils/constants'

// Get color class based on crime type
crimeTypeColors['illegal_logging'].bg  // 'bg-red-900'
crimeTypeColors['illegal_logging'].text // 'text-red-400'

// Get color based on severity
severityColors['critical'].badge // 'badge-critical'
```

### Formatters

```javascript
formatDate(date)  // Format dates consistently
formatCoordinates(lat, lng)  // Format geographic coords
getRiskLevelColor(score)  // Get color class for risk score
getRiskLevelLabel(score)  // Get label (Critical, High, etc)
```

---

## Best Practices

### 1. Component Organization
- One component per file
- Use folder names for feature folders
- Export default component
- Keep components focused and reusable

### 2. Styling
- Use Tailwind classes primarily
- Use custom classes for complex animations
- Keep colors in constants file
- Use responsive breakpoints (md, lg, xl)

### 3. State Management
- Keep state as local as possible
- Use useEffect for side effects
- Load data on component mount
- Handle loading and error states

### 4. API Calls
- Handle errors with try/catch
- Show loading states
- Provide user feedback via toast
- Cancel requests on unmount

```jsx
useEffect(() => {
  let isMounted = true
  
  const fetchData = async () => {
    try {
      const res = await api.get('/data')
      if (isMounted) setData(res.data)
    } catch (err) {
      toast.error('Failed to load data')
    }
  }
  
  fetchData()
  return () => { isMounted = false }
}, [])
```

### 5. Performance
- Use Suspense for code splitting
- Lazy load heavy components
- Memoize expensive calculations
- Debounce search inputs

### 6. Accessibility
- Use semantic HTML
- Add alt text to images
- Ensure color contrast
- Support keyboard navigation

---

## Common Patterns

### Fetching Data

```jsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get('/endpoint')
      setData(res.data)
    } catch (err) {
      toast.error('Failed to load')
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [])

if (loading) return <LoadingSpinner />
return <div>{/* render data */}</div>
```

### Form Handling

```jsx
const [formData, setFormData] = useState({
  name: '',
  email: ''
})

const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: value
  }))
}

const handleSubmit = async (e) => {
  e.preventDefault()
  // Submit form
}
```

### Filtering & Pagination

```jsx
const [filters, setFilters] = useState({})
const [page, setPage] = useState(1)

useEffect(() => {
  fetchData({ ...filters, page })
}, [filters, page])

const handleFilterChange = (name, value) => {
  setFilters(prev => ({ ...prev, [name]: value }))
  setPage(1)  // Reset to first page
}
```

---

## Debugging

### Browser DevTools

```javascript
// Log state changes
console.log('Data:', data)

// Check API responses
fetch('http://localhost:5000/api/...')
  .then(r => r.json())
  .then(data => console.log(data))

// Check localStorage
localStorage.getItem('token')
```

### React DevTools
- Install React DevTools browser extension
- Inspect component props and state
- Track render performance

### Network Tab
- Check API requests and responses
- Verify headers (including auth token)
- Debug CORS issues

---

## Environment Variables

### .env File
```
VITE_API_URL=http://localhost:5000/api
```

### Access in Code
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Building & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

---

## Deployment Options

### Netlify
```bash
npm run build
# Deploy 'dist' folder to Netlify
```

### Vercel
```bash
# Connect GitHub repo to Vercel
# Auto-deploys on push
```

### AWS S3 + CloudFront
```bash
npm run build
# Upload 'dist' to S3
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
server: { port: 5174 }
```

### API CORS Errors
```javascript
// Check backend CORS config
// Backend should have:
// app.use(cors())

// Frontend should have correct API URL:
// VITE_API_URL=http://localhost:5000/api
```

### Module Not Found
```bash
# Ensure correct path
import Layout from '@/components/Layout'  // ✅
import Layout from '../components/Layout'  // ❌ (relative)
```

### Build Fails
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

---

## Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)
- [React Leaflet](https://react-leaflet.js.org)

---

**Last Updated:** April 19, 2026
