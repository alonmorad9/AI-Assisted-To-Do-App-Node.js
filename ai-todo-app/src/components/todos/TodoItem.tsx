import React, { useState } from 'react'
import { Todo } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Loading } from '../ui/Loading'
import { updateTodo, deleteTodo } from '../../lib/todos'
import { useToast } from '../../lib/toast'

interface TodoItemProps {
  todo: Todo
  onTodoUpdated: () => void
}

export function TodoItem({ todo, onTodoUpdated }: TodoItemProps) {
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const { showToast } = useToast()
  
  // Edit form state
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')
  const [editDueDate, setEditDueDate] = useState(todo.due_date || '')
  const [editPriority, setEditPriority] = useState(todo.priority)

  const handleToggleComplete = async () => {
    setLoading(true)
    try {
      const { error } = await updateTodo(todo.id, { completed: !todo.completed })
      if (error) {
        showToast(`Failed to update todo: ${error.message}`, 'error')
      } else {
        showToast(
          todo.completed ? 'Todo marked as incomplete' : 'Todo completed! 🎉', 
          'success'
        )
        onTodoUpdated()
      }
    } catch (err) {
      showToast('Failed to update todo. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return

    setLoading(true)
    try {
      const { error } = await deleteTodo(todo.id)
      if (error) {
        showToast(`Failed to delete todo: ${error.message}`, 'error')
      } else {
        showToast('Todo deleted successfully', 'success')
        onTodoUpdated()
      }
    } catch (err) {
      showToast('Failed to delete todo. Please try again.', 'error')
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
    if (!editTitle.trim()) {
      showToast('Todo title cannot be empty', 'error')
      return
    }

    setLoading(true)
    try {
      const { error } = await updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        due_date: editDueDate || undefined,
        priority: editPriority,
      })
      
      if (error) {
        showToast(`Failed to update todo: ${error.message}`, 'error')
      } else {
        setEditing(false)
        showToast('Todo updated successfully!', 'success')
        onTodoUpdated()
      }
    } catch (err) {
      showToast('Failed to update todo. Please try again.', 'error')
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

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const itemStyle = {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '0.75rem',
    opacity: todo.completed ? 0.7 : 1,
    border: todo.completed ? '2px solid #10b981' : '2px solid transparent',
    transition: 'all 0.2s ease',
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
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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
    backgroundColor: 'white',
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const isPast = date < today
    
    return {
      formatted: date.toLocaleDateString(),
      isToday,
      isPast: isPast && !isToday
    }
  }

  if (loading && !editing) {
    return (
      <div style={{...itemStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80px'}}>
        <Loading text="Updating..." />
      </div>
    )
  }

  return (
    <div style={itemStyle}>
      {editing ? (
        // Edit Mode
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>
            ✏️ Edit Todo
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
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>
          </div>

          <div style={buttonGroupStyle}>
            <Button
              onClick={handleSaveEdit}
              disabled={loading || !editTitle.trim()}
            >
              {loading ? <Loading size="small" text="" /> : '💾 Save'}
            </Button>
            
            <Button
              onClick={handleCancelEdit}
              disabled={loading}
              variant="secondary"
            >
              ❌ Cancel
            </Button>
          </div>
        </div>
      ) : (
        // View Mode
        <div>
          <div style={headerStyle}>
            <div style={{ flex: 1 }}>
              <h4 style={titleStyle}>
                {todo.completed && '✅ '}{todo.title}
              </h4>
              <div style={priorityStyle}>
                {getPriorityEmoji(todo.priority)} {todo.priority} priority
              </div>
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
            <p style={{ 
              color: formatDate(todo.due_date).isPast ? '#dc2626' : 
                     formatDate(todo.due_date).isToday ? '#d97706' : '#6b7280', 
              fontSize: '0.75rem', 
              margin: '0.25rem 0',
              fontWeight: formatDate(todo.due_date).isToday ? '600' : '400'
            }}>
              📅 Due: {formatDate(todo.due_date).formatted}
              {formatDate(todo.due_date).isToday && ' (Today!)'}
              {formatDate(todo.due_date).isPast && ' (Overdue)'}
            </p>
          )}

          <div style={buttonGroupStyle}>
            <Button
              onClick={handleToggleComplete}
              disabled={loading}
              variant={todo.completed ? 'secondary' : 'primary'}
            >
              {todo.completed ? '↩️ Undo' : '✅ Complete'}
            </Button>
            
            <Button
              onClick={handleStartEdit}
              disabled={loading}
              variant="secondary"
            >
              ✏️ Edit
            </Button>
            
            <Button
              onClick={handleDelete}
              disabled={loading}
              variant="secondary"
            >
              🗑️ Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}