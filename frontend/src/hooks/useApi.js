import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Hook for making API calls with built-in loading and error handling
 * @param {function} apiFunction - The async API function to call
 * @param {object} options - Options for the hook
 * @returns {object} - Loading state, error, data, and execute function
 */
export const useApi = (apiFunction, options = {}) => {
  const { showError = true, showSuccess = false } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiFunction(...args)
        setData(response.data || response)

        if (showSuccess) {
          toast.success('Operation successful')
        }

        return response.data || response
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
        setError(errorMessage)

        if (showError) {
          toast.error(errorMessage)
        }

        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiFunction, showError, showSuccess]
  )

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return { loading, error, data, execute, reset }
}
