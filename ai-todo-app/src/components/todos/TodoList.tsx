import React, { useEffect, useState } from 'react'
import { Todo } from '../../types'
import { getTodos } from '../../lib/todos'
import { TodoItem } from './TodoItem'

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTodos = async () => {
    try {
      const { data, error } = await getTodos()
      
      if (error) {
        setError(error.message)
      } else {
        setTodos(data || [])
      }
    } catch (err) {
      setError('Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const handleTodoUpdated = () => {
    loadTodos()
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#6b7280' }}>Loading todos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#dc2626' }}>Error: {error}</p>
        <button 
          onClick={loadTodos}
          style={{ 
            marginTop: '1rem', 
            padding: '0.5rem 1rem', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.375rem', 
            cursor: 'pointer' 
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem 2rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>No todos yet</h3>
        <p style={{ color: '#6b7280' }}>Create your first todo using the form above!</p>
      </div>
    )
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div>
      <div style={{ 
        marginBottom: '1rem', 
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: 0, color: '#1f2937' }}>
          Your Todos ({completedCount}/{totalCount} completed)
        </h3>
      </div>

      <div>
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onTodoUpdated={handleTodoUpdated}
          />
        ))}
      </div>
    </div>
  )
}