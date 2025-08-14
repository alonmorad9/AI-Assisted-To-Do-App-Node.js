import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { createTodo } from '../../lib/todos'

interface TodoFormProps {
  onTodoAdded: () => void
}

export function TodoForm({ onTodoAdded }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    setError('')

    try {
      const { error } = await createTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate || undefined,
        priority,
        completed: false,
      })

      if (error) {
        setError(error.message)
      } else {
        // Reset form
        setTitle('')
        setDescription('')
        setDueDate('')
        setPriority('medium')
        onTodoAdded()
      }
    } catch (err) {
      setError('Failed to create todo')
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
    gridTemplateColumns: '1fr 1fr',
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
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
        Add New Todo
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <Input
          type="text"
          placeholder="Todo title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={gridStyle}>
        <Input
          type="date"
          placeholder="Due date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          style={selectStyle}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      {error && (
        <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading || !title.trim()}>
        {loading ? 'Adding...' : 'Add Todo'}
      </Button>
    </form>
  )
}