import React from 'react'
import { useAuth } from '../lib/auth'
import { Button } from './ui/Button'
import { TodoForm } from './todos/TodoForm'
import { TodoList } from './todos/TodoList'
import { useResponsive } from '../hooks/useResponsive'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { isMobile } = useResponsive()
  const [refreshKey, setRefreshKey] = React.useState(0)

  const handleTodoAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: isMobile ? '1rem' : '2rem',
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'stretch' : 'center',
    gap: isMobile ? '1rem' : '0',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }

  const titleStyle = {
    fontSize: isMobile ? '1.25rem' : '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  }

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '0.875rem',
    margin: '0.25rem 0 0 0',
    wordBreak: 'break-word' as const,
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h1 style={titleStyle}>
            📝 AI Todo App
          </h1>
          <p style={subtitleStyle}>
            Welcome back, {user?.email}!
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={signOut}
          aria-label="Sign out of your account"
          style={{ width: isMobile ? '100%' : 'auto' }}
        >
          👋 Sign Out
        </Button>
      </header>

      <main>
        <TodoForm onTodoAdded={handleTodoAdded} />
        
        <div key={refreshKey}>
          <TodoList />
        </div>
      </main>
    </div>
  )
}