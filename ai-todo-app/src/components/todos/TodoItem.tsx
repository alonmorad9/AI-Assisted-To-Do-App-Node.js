import React, { useState } from 'react'
import { Todo } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { updateTodo, deleteTodo } from '../../lib/todos'

interface TodoItemProps {
  todo: Todo
  onTodoUpdated: () => void
}

export function TodoItem({ todo, onTodoUpdated }: TodoItemProps) {
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  
  // Edit form state
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')
  const [editDueDate, setEditDueDate] = useState(todo.due_date || '')
  const [editPriority, setEditPriority] = useState(todo.priority)

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

  const handleStartEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setEditDueDate(todo.due_date || '')
    setEditPriority(todo.priority)
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
  }

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return

    setLoading(true)
    try {
      await updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        due_date: editDueDate || undefined,
        priority: editPriority,
      })
      setEditing(false)
      onTodoUpdated()
    } catch (err) {
      console.error('Failed to update todo:', err)
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
    flexWrap: 'wrap' as const,
  }

  const editFormStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    marginBottom: '0.75rem',
  }

  const editRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  }

  const selectStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div style={itemStyle}>
      {editing ? (
        // Edit Mode
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
            Edit Todo
          </h4>
          
          <div style={editFormStyle}>
            <Input
              type="text"
              placeholder="Todo title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />

            <Input
              type="text"
              placeholder="Description (optional)"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <div style={editRowStyle}>
              <Input
                type="date"
                placeholder="Due date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />

              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                style={selectStyle}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div style={buttonGroupStyle}>
            <Button
              onClick={handleSaveEdit}
              disabled={loading || !editTitle.trim()}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            
            <Button
              onClick={handleCancelEdit}
              disabled={loading}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        // View Mode
        <div>
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
              onClick={handleStartEdit}
              disabled={loading}
              variant="secondary"
            >
              Edit
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
      )}
    </div>
  )
}