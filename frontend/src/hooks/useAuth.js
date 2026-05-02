import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/api'
import toast from 'react-hot-toast'

/**
 * Hook for authentication management
 * Handles login, register, logout, and token management
 */
export const useAuth = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (err) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.login({ email, password })
      const { token, user: userData } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      toast.success('Login successful')
      navigate('/')
      return userData
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const register = useCallback(async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.register({ name, email, password })
      toast.success('Registration successful! Please login.')
      navigate('/login')
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setError(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }, [navigate])

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token')
  }, [])

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  }
}
