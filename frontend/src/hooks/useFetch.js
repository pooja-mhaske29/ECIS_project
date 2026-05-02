import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

/**
 * Generic hook for fetching data from API endpoints
 * Handles loading, error, and data states
 */
export const useFetch = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiFunction()
        if (isMounted) {
          setData(response.data)
        }
      } catch (err) {
        if (isMounted) {
          const message = err.response?.data?.message || err.message || 'Failed to fetch data'
          setError(message)
          // Only show toast for critical errors
          if (err.response?.status === 401) {
            toast.error('Session expired. Please login again.')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFunction()
      setData(response.data)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch data'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}
