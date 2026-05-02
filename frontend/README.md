# ECIS Frontend

A modern, production-ready React + Vite frontend for the Environmental Crime Intelligence System.

## Features

✨ **Dark Theme with Neon Accents** - Glassmorphism design with neon green/cyan colors
📊 **Interactive Dashboard** - Real-time crime statistics with Recharts
🗺️ **Interactive Maps** - Leaflet integration for hotspot visualization
🔍 **Crime Detection** - Coordinate-based detection with spectral analysis
📋 **Reports Management** - Searchable, filterable crime reports table
🎬 **Smooth Animations** - Framer Motion for fluid transitions
📱 **Responsive Design** - Full mobile support with Tailwind CSS
🔐 **Authentication** - Secure login/register with JWT tokens
⚡ **Real-time Alerts** - Toast notifications for updates

## Installation

### Prerequisites
- Node.js 16+ and npm
- Backend API running on http://localhost:5000

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

The app will open at http://localhost:5173

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with sidebar
│   │   ├── ProtectedRoute.jsx  # Route protection
│   │   └── LoadingSpinner.jsx  # Loading state
│   ├── pages/
│   │   ├── Login.jsx           # Authentication
│   │   ├── Register.jsx        # User registration
│   │   ├── Dashboard.jsx       # Statistics & charts
│   │   ├── Detection.jsx       # Crime detection
│   │   ├── Reports.jsx         # Crime reports table
│   │   └── Hotspots.jsx        # Map & hotspots
│   ├── services/
│   │   └── api.js              # API client with axios
│   ├── utils/
│   │   └── constants.js        # Colors, formatters, helpers
│   ├── styles/
│   │   └── index.css           # Tailwind & custom styles
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env                        # Environment variables
└── package.json
```

## Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Leaflet** - Maps
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide Icons** - Icons

## API Integration

The app connects to the backend API at `http://localhost:5000/api`

### Endpoints Used

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /ai-integration/detect` - Single location detection
- `GET /ai-integration/hotspots` - Get crime hotspots
- `GET /ai-integration/stats` - Get AI service statistics
- `GET /violations` - Get violations with filtering
- `GET /violations/analytics` - Get analytics data
- `GET /ai-integration/health` - Check service health

## Authentication

The app uses JWT tokens stored in localStorage. Login is required for all pages except `/login` and `/register`.

## Customization

### Theme Colors
Edit `tailwind.config.js`:
- Neon Green: `#00ff88`
- Neon Cyan: `#00ffff`
- Dark BG: `#0a0e27`

### API Base URL
Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## Performance Optimizations

- Code splitting with React.lazy()
- Suspense boundaries for loading states
- Optimized Recharts with ResponsiveContainer
- Lazy loading for heavy components
- CSS-in-JS with Tailwind for minimal bundle

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Issues
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Verify CORS is enabled on backend

### Port Already in Use
```bash
# Change port in vite.config.js
port: 5174
```

## Contributing

1. Follow the existing code style
2. Use Tailwind CSS for styling
3. Add loading states for async operations
4. Use React Router for navigation

## License

MIT

## Support

For issues or questions, refer to the main project README.md
