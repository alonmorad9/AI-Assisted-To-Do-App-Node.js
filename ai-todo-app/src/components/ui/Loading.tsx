import React from 'react'

interface LoadingProps { // Props for the Loading component
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export function Loading({ text = 'Loading...', size = 'medium' }: LoadingProps) { // Loading component to show a spinner and optional text
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '16px', height: '16px' }
      case 'large':
        return { width: '32px', height: '32px' }
      case 'medium':
      default:
        return { width: '24px', height: '24px' }
    }
  }

  const spinnerStyle = { // Styles for the spinner
    ...getSizeStyles(),
    border: '2px solid #f3f4f6',
    borderTop: '2px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
    marginRight: text ? '0.5rem' : '0',
  }

  const containerStyle = { // Styles for the loading container
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    fontSize: '0.875rem',
  }

  return ( // JSX for the Loading component
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      {text && <span>{text}</span>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}