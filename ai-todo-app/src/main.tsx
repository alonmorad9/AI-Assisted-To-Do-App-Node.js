import React from 'react' // Import React for creating components
import ReactDOM from 'react-dom/client'
import { AuthProvider, useAuth } from './lib/auth'
import { ToastProvider } from './lib/toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthForm } from './components/auth/AuthForm'
import { Dashboard } from './components/Dashboard'
import { Loading } from './components/ui/Loading'

function AppContent() { // This component handles the main content of the app
  // Use the custom hook to access authentication state
  const { user, loading } = useAuth()

  if (loading) { // If the authentication state is still loading, show a loading indicator
    // best practice: consider creating a default loading component to all pages **
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
        }}>
          <Loading text="Loading your todos..." size="large" />
        </div>
      </div>
    )
  }

  return ( // If the user is authenticated, show the dashboard; otherwise, show the authentication form
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
      {user ? <Dashboard /> : <AuthForm />}
    </div>
  )
}

function App() { // Main App component that wraps the content with providers
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

const rootElement = document.getElementById('root') // Get the root element from the HTML
if (!rootElement) throw new Error('Root element not found') // Ensure the root element exists before rendering

const root = ReactDOM.createRoot(rootElement) // Create a root for React to render the app
root.render(<App />) // Render the App component into the root element


// This code sets up the main entry point for the React application, integrating authentication and error handling.


// question for dan & eitan: is it best practice to use react dom and react dom client together like this?