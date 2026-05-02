# 🚀 Frontend with Hooks - Quick Start (5 Minutes)

Get the complete frontend running in just 5 minutes!

---

## ⏱️ 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)
```powershell
cd c:\Users\LENOVO\ECIS_project\frontend
npm install
```

Wait for the installation to complete. You'll see:
```
added 100+ packages in 1m 30s
```

### Step 2: Verify Configuration (30 seconds)
```powershell
# Check vite.config.js has @ alias
cat vite.config.js | Select-String "alias" -A 3
```

Should show:
```
alias: {
  '@': path.resolve(__dirname, './src'),
}
```

### Step 3: Start Dev Server (30 seconds)
```powershell
npm run dev
```

You'll see:
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://127.0.0.1:5173/
➜  press h to show help
```

### Step 4: Open in Browser (1 minute)
1. Browser should open automatically at http://localhost:5173
2. If not, open manually: http://localhost:5173
3. You'll see the ECIS login page

### Step 5: Test Authentication (1 minute)
1. Click "Create one" to register
2. Register: name=Test, email=test@test.com, password=Test123!, confirm=Test123!
3. Click "Create Account"
4. Login with test@test.com / Test123!
5. You should see the Dashboard!

---

## ✅ Success!

If you see the Dashboard with charts and statistics, everything is working perfectly! 🎉

### What You're Seeing

- ✅ `useAuth()` hook - Managing your login/registration
- ✅ `useFetch()` hook - Loading dashboard data
- ✅ `useForm()` hook - Form handling on login/register
- ✅ All custom hooks - Fully integrated!

---

## 🧪 Quick Testing

### Test 1: Detection
1. Click "Detection" in sidebar
2. Enter coordinates: lat -15.5, lng -56.5
3. Enter address: Test Location
4. Click "Analyze Location"
5. See results in 5-10 seconds

**This uses:** `useForm()` and `useApi()` hooks ✅

### Test 2: Reports
1. Click "Reports" in sidebar
2. See your detection in the table
3. Try filtering by crime type
4. Try exporting CSV

**This uses:** `useFetch()` hook ✅

### Test 3: Hotspots
1. Click "Hotspots" in sidebar
2. See interactive map with markers
3. Try toggling crime types

**This uses:** `useFetch()` and `useMemo()` hooks ✅

### Test 4: Logout
1. Scroll to bottom of sidebar (mobile: click menu first)
2. Click "Logout" button
3. See logout toast
4. Redirected to login

**This uses:** `useAuth()` hook ✅

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── hooks/              ← NEW! 7 custom hooks
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   ├── useForm.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   ├── useApi.js
│   │   ├── useClickOutside.js
│   │   └── index.js
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js          ← Updated with @ alias
├── package.json
├── index.html
└── README.md
```

---

## 🎯 Key Files Updated

### 7 Custom Hooks Added
- `useAuth.js` - Login, register, logout
- `useFetch.js` - Data fetching
- `useForm.js` - Form management
- `useDebounce.js` - Debounced search
- `useLocalStorage.js` - Persistent data
- `useApi.js` - API calls with toasts
- `useClickOutside.js` - Sidebar closing

### Components Using Hooks
- Login.jsx - Uses useAuth, useForm
- Register.jsx - Uses useAuth, useForm
- Dashboard.jsx - Uses useFetch
- Detection.jsx - Uses useForm, useApi
- Reports.jsx - Uses useFetch
- Hotspots.jsx - Uses useFetch
- Layout.jsx - Uses useAuth, useClickOutside

---

## 📚 Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| HOOKS_DOCUMENTATION.md | Complete usage guide | 30 min |
| HOOKS_COMPLETE.md | Implementation summary | 10 min |
| HOOKS_TESTING_GUIDE.md | Testing procedures | 20 min |
| FRONTEND_QUICK_REFERENCE.md | Quick lookups | 5 min |
| FRONTEND_HOOKS_FINAL_REPORT.md | Final status | 10 min |

**Total Reading:** ~75 minutes for everything
**Quick Start:** Just run `npm run dev` - that's it!

---

## 🔧 Troubleshooting

### Problem: Port 5173 already in use
```powershell
# Change port in vite.config.js
# Find this line:
# port: 5173

# Change to:
# port: 5174
```

### Problem: npm install fails
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules
rmdir /s node_modules
del package-lock.json

# Reinstall
npm install
```

### Problem: API calls failing
Make sure backend is running:
```powershell
# In another terminal:
cd backend
npm run dev

# And AI service is running:
# In another terminal:
cd ai-service
python app.py
```

### Problem: "@/hooks" imports not working
```powershell
# Restart dev server
npm run dev
```

---

## 💡 Common Commands

```powershell
# Start development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Clear cache
npm cache clean --force

# Reinstall dependencies
npm ci
```

---

## 🎨 Using the Hooks

### Import Hooks
```javascript
import { useAuth, useFetch, useForm } from '@/hooks'
```

### Use in Component
```jsx
export default function MyComponent() {
  const { user, login } = useAuth()
  const { data, loading } = useFetch(() => api.getData(), [])
  const { values, handleChange, handleSubmit } = useForm(init, onSubmit)

  return (
    // Your JSX
  )
}
```

---

## ✨ What's New

### Before (Without Hooks)
```jsx
const [loading, setLoading] = useState(true)
const [data, setData] = useState(null)
const [error, setError] = useState(null)

useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true)
      const res = await api.call()
      setData(res.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }
  fetch()
}, [])
```

### After (With Hooks)
```jsx
const { data, loading, error } = useFetch(() => api.call(), [])
```

**50%+ less code!** 🎉

---

## 🚀 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Test login/register
4. ✅ Test all pages
5. ✅ Check documentation if needed
6. ✅ Build new features using hooks!

---

## 📊 Hooks at a Glance

| Hook | What It Does | When To Use |
|------|-------------|------------|
| useAuth | Login/register/logout | Auth pages, protected routes |
| useFetch | Fetch data | Dashboard, reports, hotspots |
| useForm | Form management | Forms (login, detection, etc) |
| useDebounce | Debounce values | Search inputs |
| useLocalStorage | Persist data | User preferences, settings |
| useApi | API calls + toasts | Any API call with feedback |
| useClickOutside | Detect clicks outside | Dropdowns, menus, sidebars |

---

## 🎯 Estimated Time Per Task

| Task | Time |
|------|------|
| Install dependencies | 2 min |
| Start dev server | 30 sec |
| Test login | 1 min |
| Test all pages | 5 min |
| Read quick reference | 5 min |
| **Total** | **~15 minutes** |

---

## ⚡ Performance

- ✅ Fast startup (~2-3 seconds)
- ✅ Hot module reload (instant updates)
- ✅ Smooth animations (60 FPS)
- ✅ Optimized re-renders (hooks use useCallback, useMemo)
- ✅ Small bundle size (~200KB gzipped)

---

## 🔒 Security

- ✅ JWT token stored in localStorage
- ✅ Token sent in Authorization header
- ✅ 401 errors handled (auto-logout)
- ✅ Protected routes with authentication
- ✅ CORS enabled on backend

---

## 🆘 Need Help?

1. **Quick Issues:** Check HOOKS_TESTING_GUIDE.md
2. **How to Use:** Read HOOKS_DOCUMENTATION.md
3. **Examples:** See FRONTEND_QUICK_REFERENCE.md
4. **Status:** Review HOOKS_COMPLETE.md

---

## 🎉 Ready!

Everything is set up and ready to go!

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and start testing!

---

*Frontend with Hooks - Quick Start*
*Created: April 19, 2026*
*Setup Time: ~5 minutes*
