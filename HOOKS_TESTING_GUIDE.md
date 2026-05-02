# Frontend Hooks Testing & Verification Guide

Complete guide to testing all custom hooks in the ECIS frontend.

---

## 🧪 Pre-Setup

Before testing, ensure:

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Verify vite.config.js has @ alias
cat vite.config.js | grep -A 3 "alias"

# 3. Start the dev server
npm run dev

# Should show:
# VITE v5.0.0  ready in XXX ms
# ➜  Local:   http://127.0.0.1:5173/
```

---

## 📋 Hook Testing Checklist

### ✅ Test 1: useAuth Hook (Authentication)

**Objective:** Verify login, register, and logout work correctly

**Steps:**

1. **Open Browser DevTools** (F12)
2. **Go to Application Tab** → Local Storage
3. **Clear localStorage** (delete all items)
4. **Refresh page** → Should redirect to /login

**Test 1.1: Registration**
1. Click "Create one" link on login page
2. Fill registration form:
   - Name: Test User
   - Email: test123@example.com
   - Password: Test123!
   - Confirm: Test123!
3. Click "Create Account"

**Expected Results:**
- ✅ Success toast appears
- ✅ Redirected to /login page
- ✅ useAuth hook successfully registered user

**Check Console:**
```javascript
// In DevTools Console:
localStorage.getItem('token')  // Should be null (not logged in yet)
localStorage.getItem('user')   // Should be null
```

**Test 1.2: Login**
1. Enter email: test123@example.com
2. Enter password: Test123!
3. Click "Sign In"

**Expected Results:**
- ✅ "Login successful!" toast appears
- ✅ Redirected to Dashboard (/)(
- ✅ Page loads with data

**Check Console:**
```javascript
// In DevTools Console:
localStorage.getItem('token')  // Should have JWT token
JSON.parse(localStorage.getItem('user')).name  // Should show "Test User"
```

**Test 1.3: Logout**
1. Click sidebar menu button (mobile) or see logout in sidebar
2. Scroll to bottom of sidebar
3. Click "Logout" button

**Expected Results:**
- ✅ "Logged out successfully" toast
- ✅ localStorage is cleared
- ✅ Redirected to /login page

**Verify useAuth Hook:**
```javascript
// All should be true
localStorage.getItem('token') === null
localStorage.getItem('user') === null
window.location.pathname === '/login'
```

---

### ✅ Test 2: useForm Hook (Form Handling)

**Objective:** Verify form state, validation, and submission

**Steps:**

1. **Login** if not already logged in
2. **Navigate to Detection page** (Detection in sidebar)
3. **Fill out form:**
   - Location Name: Amazon Test
   - Latitude: -15.5
   - Longitude: -56.5
   - Address: Amazon Basin, Brazil

**Test 2.1: Field Value Management**
1. Type in each field
2. Open DevTools Console
3. Run this command:
```javascript
// Should show form values
// (values would be in component state)
```

**Expected Results:**
- ✅ All fields update as you type
- ✅ Text appears in input boxes
- ✅ No console errors

**Test 2.2: Form Submission**
1. Click "Analyze Location" button

**Expected Results:**
- ✅ Loading spinner appears
- ✅ Button becomes disabled
- ✅ Request sent to backend
- ✅ Results appear after 5-10 seconds

**Test 2.3: Validation**
1. Clear Latitude field (make it empty)
2. Try to submit

**Expected Results:**
- ✅ Error toast appears: "Please fill in all required fields"
- ✅ Request is NOT sent
- ✅ Form state not cleared

**Test 2.4: Invalid Coordinates**
1. Enter Latitude: 150 (outside -90 to 90)
2. Click "Analyze Location"

**Expected Results:**
- ✅ Error toast: "Invalid coordinates"
- ✅ Request not sent

---

### ✅ Test 3: useFetch Hook (Data Fetching)

**Objective:** Verify data loading, error handling, and refetch

**Steps:**

1. **Go to Dashboard page**
2. **Wait for data to load**

**Test 3.1: Loading States**
1. Refresh Dashboard page
2. Watch Network tab in DevTools
3. See requests to:
   - /api/ai-integration/stats
   - /api/violations/analytics
   - /api/ai-integration/health

**Expected Results:**
- ✅ Loading spinner appears briefly
- ✅ After 2-5 seconds, data loads
- ✅ Charts and stats display
- ✅ No console errors

**Test 3.2: Data Display**
1. Look at statistics cards:
   - Total Reports (should be > 0)
   - Critical Crimes
   - Avg Risk Score
   - Area Affected

**Expected Results:**
- ✅ All values display properly
- ✅ Charts render without errors
- ✅ AI Health indicator shows "Online" (green)

**Test 3.3: Error Handling**
1. Open Network tab in DevTools
2. Check offline mode (DevTools → Offline)
3. Refresh Dashboard

**Expected Results:**
- ✅ Error messages appear in Network tab
- ✅ UI shows graceful error handling
- ✅ No browser crashes

**Test 3.4: Refetch**
1. Make detection on Detection page
2. Go back to Dashboard
3. New data should load automatically

**Expected Results:**
- ✅ New detection appears in reports
- ✅ Statistics update
- ✅ useFetch hook refetches on dependency change

---

### ✅ Test 4: useDebounce Hook (Search Debouncing)

**Objective:** Verify debounced search doesn't make excessive requests

**Steps:**

1. **Go to Reports page**
2. **Open Network tab** in DevTools
3. **Click Advanced Filters** to expand filters

**Test 4.1: Debounced Search (if implemented)**
1. Type in search box slowly: "illegal"
2. Watch Network tab

**Expected Results:**
- ✅ NOT making a request for each keystroke
- ✅ Only makes request after you stop typing (500ms delay)
- ✅ Number of requests << number of keystrokes

**Test 4.2: Filter Updates**
1. Change Crime Type filter
2. Select different status

**Expected Results:**
- ✅ Table updates with new filter
- ✅ One request per filter change (not multiple)
- ✅ Results are correct

---

### ✅ Test 5: useLocalStorage Hook (Persistent Data)

**Objective:** Verify localStorage persistence works

**Steps:**

1. **Go to Dashboard**
2. **Open DevTools** → Application → Local Storage → http://localhost:5173

**Test 5.1: Token Persistence**
1. You should see:
   - `token` key with JWT value
   - `user` key with user data

**Expected Results:**
- ✅ Token is stored in localStorage
- ✅ User data is stored
- ✅ Values survive page reload

**Test 5.2: Page Reload**
1. Refresh the page (F5)

**Expected Results:**
- ✅ You stay logged in
- ✅ No redirect to /login
- ✅ Same user info displayed
- ✅ Dashboard data loads

**Test 5.3: Cross-Tab Sync**
1. Open another tab: http://localhost:5173
2. Go to Reports in first tab
3. Switch to second tab

**Expected Results:**
- ✅ Second tab is also logged in
- ✅ Can see same data
- ✅ Both tabs in sync

**Test 5.4: Logout and Storage Clear**
1. Click Logout button
2. Check localStorage

**Expected Results:**
- ✅ `token` key is deleted
- ✅ `user` key is deleted
- ✅ localStorage is empty

---

### ✅ Test 6: useApi Hook (API Calls with Feedback)

**Objective:** Verify API calls with toast notifications

**Steps:**

1. **Go to Detection page**
2. **Enable Network DevTools**
3. **Fill form and click "Analyze Location"**

**Test 6.1: Loading State**
1. Before results appear:
   - Button should show "Analyzing..." (or similar)
   - Button should be disabled
   - Loading spinner should appear

**Expected Results:**
- ✅ Loading feedback is clear
- ✅ Button is disabled (can't double-click)
- ✅ Visual feedback for 5-10 seconds

**Test 6.2: Success State**
1. Results appear after processing

**Expected Results:**
- ✅ "Crime detection analysis complete" toast
- ✅ Results display in result section
- ✅ Risk score and severity shown
- ✅ Spectral indices visualized

**Test 6.3: Error Handling**
1. Try with very high latitude (e.g., 150)
2. Click "Analyze Location"

**Expected Results:**
- ✅ Error toast appears: "Invalid coordinates"
- ✅ No request is made
- ✅ Error is handled gracefully

---

### ✅ Test 7: useClickOutside Hook (Click Detection)

**Objective:** Verify click-outside detection for sidebar

**Steps:**

1. **Go to Mobile view** (DevTools → Toggle device toolbar)
2. **Narrow viewport to 375px width** (mobile size)
3. **Refresh page**

**Test 7.1: Sidebar Opening**
1. Click hamburger menu (☰)

**Expected Results:**
- ✅ Sidebar slides open from left
- ✅ Dark overlay appears on mobile
- ✅ Smooth animation

**Test 7.2: Click Outside to Close**
1. Sidebar is open
2. Click on the main content area (not sidebar)

**Expected Results:**
- ✅ Sidebar closes smoothly
- ✅ Dark overlay disappears
- ✅ useClickOutside hook working

**Test 7.3: Sidebar Menu Still Works**
1. Open sidebar again
2. Click a menu item (Dashboard, Detection, etc.)

**Expected Results:**
- ✅ Page navigates correctly
- ✅ Sidebar closes after navigation
- ✅ New page loads

**Test 7.4: Close Button Works**
1. Open sidebar
2. Click X button at top-right

**Expected Results:**
- ✅ Sidebar closes
- ✅ Overlay disappears
- ✅ Smooth animation

---

## 🎯 Integration Testing

### Complete User Flow Test

**Step 1: Register & Login**
```
1. Go to http://localhost:5173 (redirects to /login)
2. Click "Create one"
3. Register: test@example.com / Test123! / Test123!
4. Login with new account
5. Should see Dashboard
```

**Step 2: Analyze Detection**
```
1. Click Detection in sidebar
2. Fill coordinates: -15.5, -56.5
3. Fill address: Test Location
4. Click Analyze
5. Wait for results (5-10 seconds)
6. See risk score and severity
```

**Step 3: View Reports**
```
1. Click Reports in sidebar
2. Should see the detection you just made
3. Try filtering by crime type
4. Try filtering by risk score
5. Click Export CSV
6. Check CSV file contents
```

**Step 4: View Hotspots**
```
1. Click Hotspots in sidebar
2. Should see map with marker for your detection
3. Try filtering crime types
4. Click on marker for details
5. See list of hotspots below map
```

**Step 5: Logout**
```
1. Click Logout button
2. Should see "Logged out" toast
3. Should redirect to /login
4. localStorage should be empty
```

---

## 🔍 Console Verification

**Test in Browser Console (F12):**

```javascript
// 1. Check hooks are accessible
Object.keys(window)
// Should show React DevTools

// 2. Check localStorage
localStorage.getItem('token')       // Should have JWT if logged in
localStorage.getItem('user')        // Should have user object

// 3. Check API calls
// Go to Network tab and check:
// - GET /api/ai-integration/stats
// - GET /api/violations/analytics
// - POST /api/ai-integration/detect

// 4. Check for errors
// Console tab should be CLEAN (no red errors)
```

---

## 📊 Performance Testing

**Test Render Performance:**

1. **Go to Dashboard**
2. **Open DevTools** → Performance tab
3. **Click "Record"**
4. **Wait 5 seconds**
5. **Stop recording**

**Expected Results:**
- ✅ Frame rate near 60 FPS
- ✅ No long tasks (>50ms)
- ✅ Smooth animations
- ✅ React renders optimized with hooks

---

## ✨ Expected Results Summary

| Hook | Status | Evidence |
|------|--------|----------|
| useAuth | ✅ Working | Login/logout work, token persists |
| useForm | ✅ Working | Form fields update, validation works |
| useFetch | ✅ Working | Data loads, errors handled |
| useDebounce | ✅ Working | Search doesn't spam requests |
| useLocalStorage | ✅ Working | Data persists after reload |
| useApi | ✅ Working | Toasts show, loading states work |
| useClickOutside | ✅ Working | Sidebar closes when clicking outside |

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/hooks'"
**Solution:**
```bash
# Check vite.config.js has @ alias
grep -A 3 "alias" frontend/vite.config.js

# Should show:
# alias: {
#   '@': path.resolve(__dirname, './src'),
# }

# Restart dev server
npm run dev
```

### Issue: Hooks not working
**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Localhost refuses connection
**Solution:**
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173

# Change port in vite.config.js if needed:
# server: { port: 5174 }
```

### Issue: API calls failing (401 errors)
**Solution:**
- Check backend is running on port 5000
- Check AI service is running on port 8000
- Login again to refresh token
- Check token in localStorage

---

## ✅ Final Verification Checklist

- [ ] All 7 hooks are created
- [ ] All hooks export from index.js
- [ ] @ alias is configured in vite.config.js
- [ ] All components import from @/hooks
- [ ] useFetch works (data loads on Dashboard)
- [ ] useAuth works (login/logout)
- [ ] useForm works (Detection form submission)
- [ ] useApi works (Toasts appear on success/error)
- [ ] useLocalStorage works (Token persists)
- [ ] useDebounce works (Search doesn't spam)
- [ ] useClickOutside works (Sidebar closes)
- [ ] No console errors
- [ ] All pages load correctly
- [ ] Mobile responsive (open in mobile view)
- [ ] Performance is smooth (60 FPS)

---

## 🎉 Success!

Once all tests pass, your frontend hooks are fully implemented and working!

**Next Steps:**
1. ✅ Hooks verified
2. Run full system test (backend + frontend + AI service)
3. Test data persistence
4. Test error handling
5. Deploy to production

---

*Testing Guide Created: April 19, 2026*
