import React from 'react'
import { useAuth } from '../lib/auth'
import { Button } from './ui/Button'

export function Dashboard() {
  const { user, signOut } = useAuth()

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            AI Todo App Dashboard
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Welcome, {user?.email}!
          </p>
        </div>
        <Button variant="secondary" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      <div style={{ 
        padding: '2rem', 
        backgroundColor: 'white', 
        borderRadius: '0.5rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        textAlign: 'center' 
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1f2937' }}>
          🎉 Authentication Working!
        </h2>
        <p style={{ color: '#6b7280' }}>
          Todo functionality coming next...
        </p>
      </div>
    </div>
  )
}