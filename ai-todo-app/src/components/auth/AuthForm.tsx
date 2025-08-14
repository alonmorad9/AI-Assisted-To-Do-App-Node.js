import React, { useState } from 'react'
import { useAuth } from '../../lib/auth'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const containerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }

  const formStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  }

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '1rem',
    color: '#1f2937',
  }

  const errorStyle = {
    color: '#dc2626',
    fontSize: '0.875rem',
    textAlign: 'center' as const,
  }

  const linkStyle = {
    color: '#3b82f6',
    cursor: 'pointer',
    textDecoration: 'underline',
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={errorStyle}>{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span 
          style={linkStyle}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </span>
      </p>
    </div>
  )
}