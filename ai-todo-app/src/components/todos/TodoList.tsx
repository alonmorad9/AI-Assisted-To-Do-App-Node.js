import React, { useEffect, useState } from 'react'
import { Todo, TodoFilter } from '../../types'
import { getTodos } from '../../lib/todos'
import { TodoItem } from './TodoItem'
import { TodoFilters } from './TodoFilters'
import { BulkActions } from './BulkActions'

export function TodoList() { // Main component to display the list of todos
  const [todos, setTodos] = useState<Todo[]>([]) // State to hold the list of todos
  const [loading, setLoading] = useState(true) // State to indicate if todos are being loaded
  const [error, setError] = useState('') // State to hold any error messages
  const [currentFilter, setCurrentFilter] = useState<TodoFilter>('all') // State to hold the current filter applied to todos

  const loadTodos = async () => { // Function to load todos from the server
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

  useEffect(() => { // Load todos when the component mounts
    loadTodos()
  }, [])

  const handleTodoUpdated = () => { // Callback to refresh todos after an update
    loadTodos()
  }

  const isToday = (dateString: string) => { // Function to check if a date is today
    const today = new Date()
    const todoDate = new Date(dateString)
    return today.toDateString() === todoDate.toDateString()
  }

  const getFilteredTodos = () => { // Function to filter todos based on the current filter
    switch (currentFilter) {
      case 'active':
        return todos.filter(todo => !todo.completed)
      case 'completed':
        return todos.filter(todo => todo.completed)
      case 'due-today':
        return todos.filter(todo => todo.due_date && isToday(todo.due_date))
      case 'priority':
        return todos.filter(todo => todo.priority === 'high')
      case 'all':
      default:
        return todos
    }
  }

  const getTodoCounts = () => { // Function to get counts of todos based on their status
    return {
      all: todos.length,
      active: todos.filter(todo => !todo.completed).length,
      completed: todos.filter(todo => todo.completed).length,
      dueToday: todos.filter(todo => todo.due_date && isToday(todo.due_date)).length,
      highPriority: todos.filter(todo => todo.priority === 'high').length,
    }
  }

  if (loading) { // If todos are still loading, show a loading state
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

  const filteredTodos = getFilteredTodos() // Get the todos based on the current filter
  const todoCounts = getTodoCounts() // Get the counts of todos based on their status

  const getFilterDisplayText = () => { // Function to get the display text for the current filter
    switch (currentFilter) {
      case 'active': return 'Active Todos'
      case 'completed': return 'Completed Todos'
      case 'due-today': return 'Due Today'
      case 'priority': return 'High Priority Todos'
      case 'all':
      default: return 'All Todos'
    }
  }

  return ( // JSX for the TodoList component
    <div>
      {todos.length > 0 && (
        <>
          <TodoFilters
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            todoCounts={todoCounts}
          />

          <BulkActions
            todos={todos}
            onTodosUpdated={handleTodoUpdated}
          />
        </>
      )}

      {todos.length === 0 ? (
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
      ) : filteredTodos.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
            No {getFilterDisplayText().toLowerCase()}
          </h3>
          <p style={{ color: '#6b7280' }}>
            {currentFilter === 'due-today' && 'No todos due today.'}
            {currentFilter === 'priority' && 'No high priority todos.'}
            {currentFilter === 'active' && 'All todos are completed!'}
            {currentFilter === 'completed' && 'No completed todos yet.'}
          </p>
        </div>
      ) : (
        <div>
          <div style={{ 
            marginBottom: '1rem', 
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: 0, color: '#1f2937' }}>
              {getFilterDisplayText()} ({filteredTodos.length})
            </h3>
          </div>

          <div>
            {filteredTodos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onTodoUpdated={handleTodoUpdated}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}