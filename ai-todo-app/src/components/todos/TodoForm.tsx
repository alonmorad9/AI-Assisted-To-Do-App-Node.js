import React from 'react'
import { Button } from '../ui/Button'
import { ValidatedInput } from '../ui/ValidatedInput'
import { createTodo } from '../../lib/todos'
import { useToast } from '../../lib/toast'
import { useFormValidation } from '../../hooks/useFormValidation'
import { createTodoSchema, sanitizeTodoInput } from '../../lib/validation'

interface TodoFormProps {
  onTodoAdded: () => void
}

export function TodoForm({ onTodoAdded }: TodoFormProps) {
  const { showToast } = useToast()

  const form = useFormValidation({
    schema: createTodoSchema,
    initialValues: {
      title: '',
      description: '',
      due_date: '',
      priority: 'medium' as const,
    },
    onSubmit: async (data) => {
      try {
        // Sanitize input data
        const sanitizedData = sanitizeTodoInput(data)
        
        const { error } = await createTodo({
          ...sanitizedData,
          completed: false,
        })

        if (error) {
          showToast(`Failed to create todo: ${error.message}`, 'error')
        } else {
          // Reset form
          form.setValue('title', '')
          form.setValue('description', '')
          form.setValue('due_date', '')
          form.setValue('priority', 'medium')
          
          showToast('Todo created successfully! 🎉', 'success')
          onTodoAdded()
        }
      } catch (err) {
        showToast('Failed to create todo. Please try again.', 'error')
      }
    },
  })

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
  }

  const selectStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    backgroundColor: 'white',
    transition: 'border-color 0.2s ease',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
  }

  const characterCountStyle = (current: number, max: number) => ({
    fontSize: '0.75rem',
    color: current > max * 0.8 ? '#ef4444' : '#6b7280',
    textAlign: 'right' as const,
    marginTop: '0.25rem',
  })

  return (
    <form onSubmit={form.handleSubmit} style={formStyle}>
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600', 
        marginBottom: '1.5rem', 
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        ✨ Add New Todo
      </h3>

      <div style={{ marginBottom: '1.5rem' }}>
        <ValidatedInput
          id="todo-title"
          type="text"
          label="Todo Title"
          placeholder="What needs to be done?"
          value={form.values.title}
          onChange={(value) => form.setValue('title', value)}
          onBlur={() => form.setFieldTouched('title')}
          error={form.getFieldError('title')}
          required
        />
        <div style={characterCountStyle(form.values.title.length, 200)}>
          {form.values.title.length}/200 characters
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <ValidatedInput
          id="todo-description"
          type="text"
          label="Description"
          placeholder="Add more details (optional)"
          value={form.values.description || ''}
          onChange={(value) => form.setValue('description', value)}
          onBlur={() => form.setFieldTouched('description')}
          error={form.getFieldError('description')}
        />
        {form.values.description && (
          <div style={characterCountStyle(form.values.description.length, 1000)}>
            {form.values.description.length}/1000 characters
          </div>
        )}
      </div>

      <div style={gridStyle}>
        <div>
          <ValidatedInput
            id="todo-due-date"
            type="date"
            label="Due Date"
            value={form.values.due_date || ''}
            onChange={(value) => form.setValue('due_date', value)}
            onBlur={() => form.setFieldTouched('due_date')}
            error={form.getFieldError('due_date')}
          />
        </div>

        <div>
          <label htmlFor="todo-priority" style={labelStyle}>
            Priority Level
          </label>
          <select
            id="todo-priority"
            value={form.values.priority}
            onChange={(e) => form.setValue('priority', e.target.value as 'low' | 'medium' | 'high')}
            style={selectStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
              form.setFieldTouched('priority')
            }}
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={form.isSubmitting || form.hasErrors || !form.values.title.trim()}
        style={{ 
          width: '100%', 
          marginTop: '1.5rem',
          padding: '0.75rem',
          fontSize: '1rem',
          fontWeight: '600',
        }}
      >
        {form.isSubmitting ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            Creating...
          </div>
        ) : (
          '+ Add Todo'
        )}
      </Button>
    </form>
  )
}