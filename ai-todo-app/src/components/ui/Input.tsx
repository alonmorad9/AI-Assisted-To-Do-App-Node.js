import React from 'react'

interface InputProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
  id?: string
}

export function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  id,
  ...ariaProps
}: InputProps) {
  const style = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s ease',
  }

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={style}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#d1d5db'
        e.currentTarget.style.boxShadow = 'none'
      }}
      {...ariaProps}
    />
  )
}