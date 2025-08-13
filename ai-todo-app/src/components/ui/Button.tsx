import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  const baseStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    opacity: disabled ? 0.6 : 1,
  }

  const primaryStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
  }

  const secondaryStyle = {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  }

  const style = {
    ...baseStyle,
    ...(variant === 'primary' ? primaryStyle : secondaryStyle),
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  )
}