import React from 'react'

interface ValidatedInputProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  required?: boolean
  label?: string
  id?: string
}

export function ValidatedInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  label,
  id,
}: ValidatedInputProps) {
  const hasError = !!error

  const baseStyle = {
    width: '100%',
    padding: '0.75rem',
    border: `2px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: hasError ? '#fef2f2' : 'white',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: hasError ? '#ef4444' : '#374151',
    marginBottom: '0.5rem',
  }

  const errorStyle = {
    color: '#ef4444',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  }

  return (
    <div>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={baseStyle}
        onFocus={(e) => {
          if (!hasError) {
            e.currentTarget.style.borderColor = '#3b82f6'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? '#ef4444' : '#d1d5db'
          e.currentTarget.style.boxShadow = 'none'
          onBlur?.()
        }}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      
      {error && (
        <div id={`${id}-error`} style={errorStyle} role="alert">
          <span>⚠️</span>
          {error}
        </div>
      )}
    </div>
  )
}