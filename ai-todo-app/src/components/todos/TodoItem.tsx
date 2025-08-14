import React, { useState } from 'react'
import { Todo } from '../../types'
import { Button } from '../ui/Button'
import { updateTodo, deleteTodo } from '../../lib/todos'

interface TodoItemProps {
  todo: Todo
  onTodoUpdated: () => void
}

export function TodoItem({ todo, onTodoUpdated }: TodoItemProps) {
  const [loading, setLoading] = useState(false)

  const handleToggleComplete = async () => {
    setLoading(true)
    try {
      await updateTodo(todo.id, { completed: !todo.completed })
      onTodoUpdated()
    } catch (err) {
      console.error('Failed to update todo:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return

    setLoading(true)
    try {
      await deleteTodo(todo.id)
      onTodoUpdated()
    } catch (err) {
      console.error('Failed to delete todo:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626'
      case 'medium': return '#d97706'
      case 'low': return '#059669'
      default: return '#6b7280'
    }
  }

  const itemStyle = {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '0.75rem',
    opacity: todo.completed ? 0.7 : 1,
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  }

  const titleStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    textDecoration: todo.completed ? 'line-through' : 'none',
    margin: 0,
  }

  const priorityStyle = {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: getPriorityColor(todo.priority),
    textTransform: 'uppercase' as const,
  }

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div style={itemStyle}>
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h4 style={titleStyle}>{todo.title}</h4>
          <span style={priorityStyle}>{todo.priority} priority</span>
        </div>
      </div>

      {todo.description && (
        <p style={{ 
          color: '#6b7280', 
          fontSize: '0.875rem', 
          margin: '0.5rem 0',
          textDecoration: todo.completed ? 'line-through' : 'none'
        }}>
          {todo.description}
        </p>
      )}

      {todo.due_date && (
        <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: '0.25rem 0' }}>
          Due: {formatDate(todo.due_date)}
        </p>
      )}

      <div style={buttonGroupStyle}>
        <Button
          onClick={handleToggleComplete}
          disabled={loading}
          variant={todo.completed ? 'secondary' : 'primary'}
        >
          {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>
        
        <Button
          onClick={handleDelete}
          disabled={loading}
          variant="secondary"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}