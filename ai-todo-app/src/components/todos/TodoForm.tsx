import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Loading } from '../ui/Loading'
import { createTodo } from '../../lib/todos'
import { useToast } from '../../lib/toast'

interface TodoFormProps {
  onTodoAdded: () => void
}

export function TodoForm({ onTodoAdded }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      showToast('Please enter a todo title', 'error')
      return
    }

    setLoading(true)

    try {
      const { error } = await createTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate || undefined,
        priority,
        completed: false,
      })

      if (error) {
        showToast(`Failed to create todo: ${error.message}`, 'error')
      } else {
        // Reset form
        setTitle('')
        setDescription('')
        setDueDate('')
        setPriority('medium')
        showToast('Todo created successfully!', 'success')
        onTodoAdded()
      }
    } catch (err) {
      showToast('Failed to create todo. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '1.5rem',
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
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

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600', 
        marginBottom: '1rem', 
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        ✨ Add New Todo
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Input
          type="text"
          placeholder="Add a description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={gridStyle}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.75rem', 
            fontWeight: '500', 
            color: '#6b7280', 
            marginBottom: '0.25rem' 
          }}>
            Due Date
          </label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.75rem', 
            fontWeight: '500', 
            color: '#6b7280', 
            marginBottom: '0.25rem' 
          }}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            style={selectStyle}
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <Button 
          type="submit" 
          disabled={loading || !title.trim()}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Loading size="small" text="" />
              Creating...
            </div>
          ) : (
            '+ Add Todo'
          )}
        </Button>
      </div>
    </form>
  )
}