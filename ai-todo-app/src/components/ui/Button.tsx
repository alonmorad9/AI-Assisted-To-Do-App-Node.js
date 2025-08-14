import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
  style?: React.CSSProperties
}

export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  style = {},
  ...ariaProps
}: ButtonProps) {
  const baseStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    outline: 'none',
    ...style,
  }

  const primaryStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
  }

  const secondaryStyle = {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  }

  const hoverStyle = disabled ? {} : {
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }

  const combinedStyle = {
    ...baseStyle,
    ...(variant === 'primary' ? primaryStyle : secondaryStyle),
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={combinedStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyle)
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, combinedStyle)
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = '2px solid #3b82f6'
        e.currentTarget.style.outlineOffset = '2px'
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none'
      }}
      {...ariaProps}
    >
      {children}
    </button>
  )
}