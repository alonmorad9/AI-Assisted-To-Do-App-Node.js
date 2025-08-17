import React, { useState } from 'react'
import { Todo } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Loading } from '../ui/Loading'
import { updateTodo, deleteTodo } from '../../lib/todos'
import { useToast } from '../../lib/toast'

interface TodoItemProps { // Props for the TodoItem component
  todo: Todo // The todo item to display and manage
  onTodoUpdated: () => void // Callback function to call when the todo is updated
}

export function TodoItem({ todo, onTodoUpdated }: TodoItemProps) { // Main component for displaying and managing a single todo item
  const [loading, setLoading] = useState(false) // State to manage loading state during updates
  const [editing, setEditing] = useState(false) // State to manage whether the item is in edit mode
  const { showToast } = useToast() // Import toast function for displaying messages
  
  // Edit form state
  const [editTitle, setEditTitle] = useState(todo.title) // State to store the new title when editing
  const [editDescription, setEditDescription] = useState(todo.description || '') // State to store the new description when editing
  const [editDueDate, setEditDueDate] = useState(todo.due_date || '') // State to store the new due date when editing
  const [editPriority, setEditPriority] = useState(todo.priority) // State to store the new priority when editing

  const handleToggleComplete = async () => { // Function to toggle the completion status of the todo
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
        onTodoUpdated() // Call the callback to notify parent component
      }
    } catch (err) {
      showToast('Failed to update todo. Please try again.', 'error')
    } finally {
      setLoading(false) // Reset loading state
    }
  }

  const handleDelete = async () => { // Function to delete the todo item
    if (!confirm('Are you sure you want to delete this todo?')) return

    setLoading(true) // Set loading state to true while deleting
    try {
      const { error } = await deleteTodo(todo.id)
      if (error) {
        showToast(`Failed to delete todo: ${error.message}`, 'error')
      } else {
        showToast('Todo deleted successfully', 'success')
        onTodoUpdated() // Call the callback to notify parent component
      }
    } catch (err) {
      showToast('Failed to delete todo. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleStartEdit = () => { // Function to start editing the todo item
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setEditDueDate(todo.due_date || '')
    setEditPriority(todo.priority)
    setEditing(true)
  }

  const handleCancelEdit = () => { // Function to cancel editing and reset fields
    setEditing(false)
  }

  const handleSaveEdit = async () => { // Function to save the edited todo item
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

  const getPriorityColor = (priority: string) => { // Function to get the color based on priority
    switch (priority) {
      case 'high': return '#dc2626'
      case 'medium': return '#d97706'
      case 'low': return '#059669'
      default: return '#6b7280'
    }
  }

  const getPriorityEmoji = (priority: string) => { // Function to get the emoji based on priority
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const itemStyle = { // Style for the todo item container
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '0.75rem',
    opacity: todo.completed ? 0.7 : 1,
    border: todo.completed ? '2px solid #10b981' : '2px solid transparent',
    transition: 'all 0.2s ease',
  }

  const headerStyle = { // Style for the todo header
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  }

  const titleStyle = { // Style for the todo title
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    textDecoration: todo.completed ? 'line-through' : 'none',
    margin: 0,
  }

  const priorityStyle = { // Style for the priority label
    fontSize: '0.75rem',
    fontWeight: '500',
    color: getPriorityColor(todo.priority),
    textTransform: 'uppercase' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  }

  const buttonGroupStyle = { // Style for the button group
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
    flexWrap: 'wrap' as const,
  }

  const editFormStyle = { // Style for the edit form
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    marginBottom: '0.75rem',
  }

  const editRowStyle = { // Style for the edit row
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '0.75rem',
  }

  const selectStyle = { // Style for the priority select dropdown
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    backgroundColor: 'white',
  }

  const formatDate = (dateString: string) => { // Function to format the date and check if it's today or past
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const isPast = date < today
    
    return { // Return formatted date and flags for today and past
      formatted: date.toLocaleDateString(),
      isToday,
      isPast: isPast && !isToday
    }
  }

  if (loading && !editing) { // If loading and not in edit mode, show a loading spinner
    return (
      <div style={{...itemStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80px'}}>
        <Loading text="Updating..." />
      </div>
    )
  }

  return ( // JSX for the TodoItem component
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