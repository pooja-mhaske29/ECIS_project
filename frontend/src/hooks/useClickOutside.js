import { useEffect, useRef } from 'react'

/**
 * Hook for detecting clicks outside a DOM element
 * Useful for closing dropdowns, modals, etc.
 * @param {function} callback - Function to call when click is outside
 * @returns {object} - Ref to attach to the element
 */
export const useClickOutside = (callback) => {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [callback])

  return ref
}
