import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider, useAuth } from './lib/auth'
import { AuthForm } from './components/auth/AuthForm'
import { Dashboard } from './components/Dashboard'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
        }}>
          <p style={{ fontSize: '1.125rem' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      {user ? <Dashboard /> : <AuthForm />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

const root = ReactDOM.createRoot(rootElement)
root.render(<App />)