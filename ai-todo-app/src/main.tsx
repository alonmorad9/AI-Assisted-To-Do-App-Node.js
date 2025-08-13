import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { supabase } from './lib/supabase'

function App() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing database...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase
          .from('todos')
          .select('*')
          .limit(1)
        
        if (error) {
          setConnectionStatus(`❌ Database Error: ${error.message}`)
        } else {
          setConnectionStatus('✅ Database Connected Successfully!')
        }
      } catch (err) {
        setConnectionStatus(`❌ Connection Error: ${String(err)}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
          AI Todo App Setup
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#059669', marginBottom: '1rem' }}>
          ✅ React + Vite + TypeScript working!
        </p>
        <p style={{ fontSize: '1.125rem' }}>
          Database Status: <span style={{ fontFamily: 'monospace' }}>{connectionStatus}</span>
        </p>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

const root = ReactDOM.createRoot(rootElement)
root.render(<App />)