import React, { useEffect, useState } from 'react'
import { Todo, TodoFilter } from '../../types'
import { getTodos } from '../../lib/todos'
import { TodoItem } from './TodoItem'
import { TodoFilters } from './TodoFilters'
import { BulkActions } from './BulkActions'

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentFilter, setCurrentFilter] = useState<TodoFilter>('all')

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

  const isToday = (dateString: string) => {
    const today = new Date()
    const todoDate = new Date(dateString)
    return today.toDateString() === todoDate.toDateString()
  }

  const getFilteredTodos = () => {
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

  const getTodoCounts = () => {
    return {
      all: todos.length,
      active: todos.filter(todo => !todo.completed).length,
      completed: todos.filter(todo => todo.completed).length,
      dueToday: todos.filter(todo => todo.due_date && isToday(todo.due_date)).length,
      highPriority: todos.filter(todo => todo.priority === 'high').length,
    }
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

  const filteredTodos = getFilteredTodos()
  const todoCounts = getTodoCounts()

  const getFilterDisplayText = () => {
    switch (currentFilter) {
      case 'active': return 'Active Todos'
      case 'completed': return 'Completed Todos'
      case 'due-today': return 'Due Today'
      case 'priority': return 'High Priority Todos'
      case 'all':
      default: return 'All Todos'
    }
  }

  return (
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