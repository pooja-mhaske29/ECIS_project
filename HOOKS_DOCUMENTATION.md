# Custom Hooks Documentation

Complete guide to using all custom hooks in the ECIS frontend.

## 🎣 Available Hooks

### 1. `useAuth()` - Authentication Management

Manages user authentication, login, registration, and logout.

**Usage:**
```jsx
import { useAuth } from '@/hooks'

export default function MyComponent() {
  const { user, loading, error, login, register, logout, isAuthenticated } = useAuth()

  const handleLogin = async () => {
    await login('email@example.com', 'password123')
    // User is automatically logged in and redirected
  }

  const handleRegister = async () => {
    await register('John', 'john@example.com', 'password123')
    // User is redirected to login page
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {user && <p>Welcome, {user.name}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

**Returns:**
- `user` - Current authenticated user object
- `loading` - Boolean indicating loading state
- `error` - Error message if authentication failed
- `login(email, password)` - Async function to login
- `register(name, email, password)` - Async function to register
- `logout()` - Function to logout user
- `isAuthenticated()` - Function returning boolean auth status

---

### 2. `useFetch()` - Generic Data Fetching

Fetches data from API endpoints with automatic loading/error handling.

**Usage:**
```jsx
import { useFetch } from '@/hooks'
import { crimeService } from '@/services/api'

export default function Dashboard() {
  // Basic usage
  const { data, loading, error, refetch } = useFetch(
    () => crimeService.getStats(),
    [] // dependencies array
  )

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <p>Total crimes: {data?.total}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

**Features:**
- Prevents memory leaks with cleanup
- Handles 401 errors with automatic logout
- Automatic retry with refetch function
- Dependencies array controls when to re-fetch

**Returns:**
- `data` - The fetched data
- `loading` - Boolean indicating loading state
- `error` - Error message if fetch failed
- `refetch()` - Function to manually refetch data

---

### 3. `useForm()` - Form State Management

Simplifies form handling with built-in validation and reset.

**Usage:**
```jsx
import { useForm } from '@/hooks'
import { authService } from '@/services/api'

export default function LoginForm() {
  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm } = useForm(
    { email: '', password: '' },
    async (formValues) => {
      await authService.login(formValues.email, formValues.password)
      resetForm() // Clear form after successful login
    }
  )

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="your@email.com"
        />
        {touched.email && errors.email && <p>{errors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <p>{errors.password}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

**Features:**
- Automatic error clearing on field change
- Field touched tracking
- Form reset function
- Submission state tracking

**Returns:**
- `values` - Form field values object
- `errors` - Form validation errors
- `touched` - Fields that have been touched
- `isSubmitting` - Boolean indicating submission state
- `handleChange(e)` - Change handler for inputs
- `handleBlur(e)` - Blur handler for inputs
- `handleSubmit(e)` - Form submission handler
- `setFieldValue(name, value)` - Set individual field value
- `setFieldError(name, error)` - Set field error
- `resetForm()` - Reset form to initial values

---

### 4. `useDebounce()` - Debounced Values

Debounces values to prevent excessive function calls (e.g., search input).

**Usage:**
```jsx
import { useDebounce, useFetch } from '@/hooks'
import { violationService } from '@/services/api'

export default function SearchViolations() {
  const [searchInput, setSearchInput] = React.useState('')
  
  // Debounce search input (wait 500ms after user stops typing)
  const debouncedSearch = useDebounce(searchInput, 500)

  // Fetch when debounced value changes
  const { data: results } = useFetch(
    () => violationService.search(debouncedSearch),
    [debouncedSearch]
  )

  return (
    <div>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search crimes..."
      />
      {results && <p>{results.length} results found</p>}
    </div>
  )
}
```

**Parameters:**
- `value` - The value to debounce
- `delay` - Debounce delay in milliseconds (default: 500)

**Returns:**
- Debounced value

---

### 5. `useLocalStorage()` - localStorage Management

Syncs component state with browser localStorage.

**Usage:**
```jsx
import { useLocalStorage } from '@/hooks'

export default function ThemeToggle() {
  // Persists theme preference to localStorage
  const [theme, setTheme] = useLocalStorage('theme', 'dark')

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('light')}>Light Theme</button>
      <button onClick={() => setTheme('dark')}>Dark Theme</button>
      {/* Theme persists after page reload */}
    </div>
  )
}
```

**Features:**
- Auto-syncs across browser tabs
- Persists after page reload
- Handles JSON serialization automatically
- Safe for SSR (checks for window)

**Parameters:**
- `key` - localStorage key name
- `initialValue` - Default value if key doesn't exist

**Returns:**
- `[value, setValue]` - Like useState but persisted to localStorage

---

### 6. `useApi()` - API Call Handler

Manages API calls with loading/error states and automatic toasts.

**Usage:**
```jsx
import { useApi } from '@/hooks'
import { crimeService } from '@/services/api'

export default function DetectionForm() {
  const { loading, error, data, execute, reset } = useApi(
    (lat, lng, address) => crimeService.detectCrime(lat, lng, 'Test', address),
    { showError: true, showSuccess: true }
  )

  const handleDetect = async () => {
    try {
      const result = await execute(-15.5, -56.5, 'Amazon Basin')
      console.log('Detection result:', result)
    } catch (error) {
      console.error('Detection failed:', error)
    }
  }

  return (
    <div>
      <button onClick={handleDetect} disabled={loading}>
        {loading ? 'Detecting...' : 'Detect Crime'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <p>Risk Score: {data.riskScore}</p>}
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

**Features:**
- Automatic error/success toasts
- Flexible error handling with showError flag
- Success notifications with showSuccess flag
- Reset function to clear state
- Pass arguments directly to execute

**Parameters:**
- `apiFunction` - Async API function to call
- `options` - Configuration object
  - `showError` (default: true) - Show error toast on failure
  - `showSuccess` (default: false) - Show success toast on success

**Returns:**
- `loading` - Boolean indicating loading state
- `error` - Error message if failed
- `data` - Response data
- `execute(...args)` - Function to call API with arguments
- `reset()` - Function to reset all state

---

### 7. `useClickOutside()` - Click Outside Detection

Detects clicks outside a component (useful for dropdowns/modals).

**Usage:**
```jsx
import { useClickOutside } from '@/hooks'

export default function Dropdown() {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = useClickOutside(() => setIsOpen(false))

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Options
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button>Option 1</button>
          <button>Option 2</button>
          {/* Menu closes when clicking outside */}
        </div>
      )}
    </div>
  )
}
```

**Features:**
- Automatically closes menus/dropdowns
- Only works for clicks outside ref element
- Useful for accessibility (closes on Escape key too)
- Cleanup on unmount

**Parameters:**
- `callback` - Function to call when clicking outside

**Returns:**
- `ref` - Ref object to attach to container element

---

## 📚 Common Patterns

### Pattern 1: Login Form
```jsx
import { useAuth, useForm } from '@/hooks'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    (values) => login(values.email, values.password)
  )

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email} onChange={handleChange} />
      <input name="password" value={values.password} onChange={handleChange} />
      <button disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
    </form>
  )
}
```

### Pattern 2: Search with Debounce
```jsx
import { useFetch, useDebounce } from '@/hooks'
import { violationService } from '@/services/api'

export default function Search() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const { data: results } = useFetch(
    () => violationService.search(debouncedQuery),
    [debouncedQuery]
  )

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {results?.map(item => <div key={item.id}>{item.name}</div>)}
    </>
  )
}
```

### Pattern 3: API with UI Feedback
```jsx
import { useApi } from '@/hooks'
import { crimeService } from '@/services/api'

export default function AnalyzeLocation() {
  const { loading, execute } = useApi(
    (lat, lng) => crimeService.detectCrime(lat, lng, 'Location', 'Address'),
    { showSuccess: true }
  )

  return (
    <button onClick={() => execute(-15.5, -56.5)} disabled={loading}>
      {loading ? 'Analyzing...' : 'Analyze'}
    </button>
  )
}
```

### Pattern 4: Persistent Settings
```jsx
import { useLocalStorage } from '@/hooks'

export default function UserSettings() {
  const [preferences, setPreferences] = useLocalStorage('userPrefs', {
    theme: 'dark',
    language: 'en'
  })

  return (
    <select value={preferences.theme} onChange={(e) => setPreferences({
      ...preferences,
      theme: e.target.value
    })}>
      <option>dark</option>
      <option>light</option>
    </select>
  )
}
```

---

## 🚀 Best Practices

1. **Dependencies in useFetch**: Always provide the dependency array to control when to refetch
   ```jsx
   const { data } = useFetch(fetchFn, [userId]) // Re-fetch when userId changes
   ```

2. **Error Handling**: Always handle errors from API hooks
   ```jsx
   const { data, error } = useFetch(fn, [])
   if (error) return <ErrorComponent message={error} />
   ```

3. **Cleanup**: useClickOutside automatically cleans up, but be mindful of ref
   ```jsx
   const ref = useClickOutside(() => { /* cleanup */ })
   return <div ref={ref}>Content</div>
   ```

4. **Form Validation**: Combine with validation library for complex forms
   ```jsx
   const { values, setFieldError } = useForm(init, onSubmit)
   // Use your validation library to set errors
   ```

5. **Loading States**: Always show loading spinner while fetching
   ```jsx
   if (loading) return <LoadingSpinner />
   ```

---

## 🔄 Hook Compositions

You can combine multiple hooks for powerful patterns:

```jsx
// Search with auto-fetch on debounced input
export default function SearchPage() {
  const [input, setInput] = useState('')
  const debouncedInput = useDebounce(input, 300)
  const { data, loading } = useFetch(
    () => searchService.search(debouncedInput),
    [debouncedInput]
  )
  const [filters, setFilters] = useLocalStorage('searchFilters', {})

  return (
    <>
      <input value={input} onChange={e => setInput(e.target.value)} />
      {loading && <Spinner />}
      {data?.map(item => <Item key={item.id} {...item} />)}
    </>
  )
}
```

---

## 📝 Import Shortcuts

All hooks can be imported from `@/hooks`:

```jsx
// Import all at once
import { 
  useAuth, 
  useFetch, 
  useForm, 
  useDebounce, 
  useLocalStorage, 
  useApi, 
  useClickOutside 
} from '@/hooks'

// Or individual imports
import { useAuth } from '@/hooks'
import { useFetch } from '@/hooks'
```

---

**Happy Hooking! 🎣**

*Last Updated: April 19, 2026*
