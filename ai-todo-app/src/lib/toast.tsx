import React, { createContext, useContext, useState } from 'react'
import { Toast } from '../components/ui/Toast'

interface ToastContextType { // Context type for the Toast context
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined) // Create the Toast context with an initial value of undefined

interface ToastMessage { // Type for individual toast messages
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export function ToastProvider({ children }: { children: React.ReactNode }) { // ToastProvider component to provide toast functionality to the app
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (message: string, type: 'success' | 'error' | 'info') => { // Function to show a toast message
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: number) => { // Function to remove a toast message by its ID
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return ( // Provide the Toast context to children components
    <ToastContext.Provider value={{ showToast }}> // Provide the showToast function to the context
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() { // Custom hook to use the Toast context
  const context = useContext(ToastContext) // Get the Toast context
  if (context === undefined) { // If context is undefined, throw an error
    throw new Error('useToast must be used within a ToastProvider') // Ensure the hook is used within a ToastProvider
  }
  return context // Return the context value
}