import React, { useState } from 'react'
import { useAuth } from '../../lib/auth'
import { Button } from '../ui/Button'
import { ValidatedInput } from '../ui/ValidatedInput'
import { useFormValidation } from '../../hooks/useFormValidation'
import { signUpSchema, signInSchema, sanitizeString } from '../../lib/validation'
import { useToast } from '../../lib/toast'

export function AuthForm() { // Main authentication form component that handles both sign up and sign in
  const [isSignUp, setIsSignUp] = useState(false) // Flag to determine whether we're signing up or signing in
  const { signUp, signIn } = useAuth() // Import sign up and sign in functions from auth context
  const { showToast } = useToast() // Import toast function for displaying messages

  // Form validation for sign up
  const signUpForm = useFormValidation({
    schema: signUpSchema, // Validation schema for sign up using zod
    initialValues: { email: '', password: '' }, 
    onSubmit: async (data) => {
      const sanitizedData = {
        email: sanitizeString(data.email).toLowerCase(), // Sanitize email input
        password: data.password, // Don't sanitize passwords, just validate
      }

      const { error } = await signUp(sanitizedData.email, sanitizedData.password)
      if (error) {
        if (error.message.includes('already registered')) {
          showToast('This email is already registered. Try signing in instead.', 'error')
        } else {
          showToast(`Sign up failed: ${error.message}`, 'error')
        }
      } else {
        showToast('Account created successfully! Welcome! 🎉', 'success')
      }
    },
  })

  // Form validation for sign in
  const signInForm = useFormValidation({
    schema: signInSchema, // Validation schema for sign in using zod
    initialValues: { email: '', password: '' },
    onSubmit: async (data) => {
      const sanitizedEmail = sanitizeString(data.email).toLowerCase() // Sanitize email input

      const { error } = await signIn(sanitizedEmail, data.password)
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          showToast('Invalid email or password. Please try again.', 'error')
        } else {
          showToast(`Sign in failed: ${error.message}`, 'error')
        }
      } else {
        showToast('Welcome back! 🎉', 'success')
      }
    },
  })

  const currentForm = isSignUp ? signUpForm : signInForm // Determine which form to use based on the isSignUp state

  const switchMode = () => { // Function to switch between sign up and sign in modes
    setIsSignUp(!isSignUp)
    // Reset both forms when switching
    signUpForm.setValue('email', '')
    signUpForm.setValue('password', '')
    signInForm.setValue('email', '')
    signInForm.setValue('password', '')
  }

  const containerStyle = { // Styles for the container of the authentication form
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }

  const formStyle = { // Styles for the form
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  }

  const titleStyle = { // Styles for the title of the form
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    color: '#1f2937',
  }

  const linkStyle = {  // Styles for the link to switch between sign up and sign in
    color: '#3b82f6',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: '500',
  }

  const passwordRequirementsStyle = { // Styles for the password requirements section
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.375rem',
    border: '1px solid #e5e7eb',
  }

  return ( // JSX for the authentication form
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        {isSignUp ? '🚀 Create Account' : '👋 Welcome Back'}
      </h2>

      <form onSubmit={currentForm.handleSubmit} style={formStyle}>
        <ValidatedInput
          id="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={currentForm.values.email}
          onChange={(value) => currentForm.setValue('email', value)}
          onBlur={() => currentForm.setFieldTouched('email')}
          error={currentForm.getFieldError('email')}
          required
        />

        <div>
          <ValidatedInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={currentForm.values.password}
            onChange={(value) => currentForm.setValue('password', value)}
            onBlur={() => currentForm.setFieldTouched('password')}
            error={currentForm.getFieldError('password')}
            required
          />
          
          {isSignUp && (
            <div style={passwordRequirementsStyle}> 
              <strong>Password Requirements:</strong>
              <ul style={{ margin: '0.5rem 0 0 1rem', paddingLeft: 0 }}>
                <li>At least 6 characters long</li>
                <li>One uppercase letter (A-Z)</li>
                <li>One lowercase letter (a-z)</li>
                <li>One number (0-9)</li>
              </ul>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={currentForm.isSubmitting || currentForm.hasErrors}
          style={{ 
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
          }}
        >
          {currentForm.isSubmitting 
            ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
            : (isSignUp ? '🚀 Create Account' : '🔑 Sign In')
          }
        </Button>
      </form>

      <p style={{ 
        textAlign: 'center', 
        marginTop: '1.5rem', 
        fontSize: '0.875rem',
        color: '#6b7280',
      }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span style={linkStyle} onClick={switchMode}>
          {isSignUp ? 'Sign In' : 'Create Account'}
        </span>
      </p>
    </div>
  )
}