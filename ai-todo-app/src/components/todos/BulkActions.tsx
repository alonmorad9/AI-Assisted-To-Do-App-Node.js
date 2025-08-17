import React from 'react'
import { Todo } from '../../types'
import { Button } from '../ui/Button'
import { updateTodo, deleteTodo } from '../../lib/todos'

interface BulkActionsProps { // Props for the BulkActions component
  todos: Todo[] // List of todos to perform bulk actions on
  onTodosUpdated: () => void // Callback function to call when todos are updated
}

export function BulkActions({ todos, onTodosUpdated }: BulkActionsProps) { // Main component to handle bulk actions on todos
  const [loading, setLoading] = React.useState(false) // State to indicate if bulk actions are being processed

  const activeTodos = todos.filter(todo => !todo.completed) // Filter active todos
  const completedTodos = todos.filter(todo => todo.completed) // Filter completed todos

  const handleToggleAll = async () => { // Function to toggle all todos between completed and active states
    if (todos.length === 0) return

    setLoading(true)
    try {
      const shouldComplete = activeTodos.length > 0
      
      // Update all todos to the opposite state
      const promises = todos.map(todo => 
        updateTodo(todo.id, { completed: shouldComplete })
      )
      
      await Promise.all(promises) // Wait for all updates to complete
      onTodosUpdated() // Notify parent component that todos have been updated
    } catch (err) {
      console.error('Failed to toggle all todos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCompleted = async () => { // Function to delete all completed todos
    if (completedTodos.length === 0) return

    if (!confirm(`Are you sure you want to delete ${completedTodos.length} completed todos?`)) { // Confirm deletion
      return
    }

    setLoading(true)
    try {
      const promises = completedTodos.map(todo => deleteTodo(todo.id))
      await Promise.all(promises)
      onTodosUpdated()
    } catch (err) {
      console.error('Failed to delete completed todos:', err)
    } finally {
      setLoading(false)
    }
  }

  if (todos.length === 0) { // If there are no todos, do not render the component
    return null
  }

  const containerStyle = { // Style for the bulk actions container
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem',
  }

  const actionsStyle = { // Style for the action buttons
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  }

  const getToggleAllText = () => { // Function to determine the text for the toggle all button
    if (activeTodos.length > 0) {
      return `Mark All Complete (${activeTodos.length})`
    } else {
      return `Mark All Incomplete (${todos.length})`
    }
  }

  return ( // JSX for the BulkActions component
    <div style={containerStyle}>
      <div style={actionsStyle}>
        <Button
          onClick={handleToggleAll}
          disabled={loading}
          variant="primary"
        >
          {loading ? 'Updating...' : getToggleAllText()}
        </Button>

        {completedTodos.length > 0 && (
          <Button
            onClick={handleDeleteCompleted}
            disabled={loading}
            variant="secondary"
          >
            {loading ? 'Deleting...' : `Delete Completed (${completedTodos.length})`}
          </Button>
        )}

        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          {activeTodos.length} active, {completedTodos.length} completed
        </span>
      </div>
    </div>
  )
}