import React, { useEffect } from 'react'

interface ToastProps { // Props for the Toast component
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) { // Toast component to display messages with different styles based on type
  useEffect(() => { // Automatically close the toast after the specified duration
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration]) // Cleanup timer on unmount or when dependencies change

  const getTypeStyles = () => { // Function to determine styles based on type prop
    switch (type) {
      case 'success':
        return { backgroundColor: '#10b981', color: 'white' }
      case 'error':
        return { backgroundColor: '#ef4444', color: 'white' }
      case 'info':
      default:
        return { backgroundColor: '#3b82f6', color: 'white' }
    }
  }

  const toastStyle = { // Styles for the toast container
    position: 'fixed' as const,
    top: '1rem',
    right: '1rem',
    ...getTypeStyles(),
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontSize: '0.875rem',
    fontWeight: '500',
    zIndex: 1000,
    maxWidth: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
  }

  const closeButtonStyle = { // Styles for the close button
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    padding: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return ( // Render the toast with the message and close button
    <div style={toastStyle}>
      <span>{message}</span>
      <button onClick={onClose} style={closeButtonStyle}>
        ×
      </button>
    </div>
  )
}