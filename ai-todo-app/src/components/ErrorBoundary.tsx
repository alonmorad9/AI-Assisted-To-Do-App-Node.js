import React, { Component, ReactNode } from 'react'
import { Button } from './ui/Button'

interface Props { // Props for the ErrorBoundary component
  children: ReactNode
}

interface State { // State for the ErrorBoundary component
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> { // ErrorBoundary component
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State { // Update state to indicate an error has occurred
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() { // Render fallback UI if an error has occurred
    if (this.state.hasError) { // If an error has occurred, render the fallback UI
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children // If no error has occurred, render the children components
  }
}