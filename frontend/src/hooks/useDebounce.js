import { useState, useEffect } from 'react'

/**
 * Hook for debouncing values
 * Useful for search inputs, API calls on user input, etc.
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {*} - The debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if value changes before delay expires
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
