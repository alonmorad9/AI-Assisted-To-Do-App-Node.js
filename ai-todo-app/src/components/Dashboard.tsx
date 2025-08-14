import React from 'react'
import { useAuth } from '../lib/auth'
import { Button } from './ui/Button'
import { TodoForm } from './todos/TodoForm'
import { TodoList } from './todos/TodoList'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const [refreshKey, setRefreshKey] = React.useState(0)

  const handleTodoAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            AI Todo App
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Welcome, {user?.email}!
          </p>
        </div>
        <Button variant="secondary" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      <TodoForm onTodoAdded={handleTodoAdded} />
      
      <div key={refreshKey}>
        <TodoList />
      </div>
    </div>
  )
}