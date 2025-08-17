import React, { createContext, useContext, useEffect, useState } from 'react' // Import necessary React hooks and types
import { User, Session } from '@supabase/supabase-js' // Import types for User and Session from Supabase
import { supabase } from './supabase' // Import the Supabase client instance

interface AuthContextType { // Define the type for the AuthContext
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }> 
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined) // Create the AuthContext with an initial value of undefined

export function AuthProvider({ children }: { children: React.ReactNode }) { // AuthProvider component to provide authentication context to the app
  const [user, setUser] = useState<User | null>(null) // State to store the current user
  const [session, setSession] = useState<Session | null>(null) // State to store the current session
  const [loading, setLoading] = useState(true) // State to indicate if the auth state is loading

  useEffect(() => {
    // Get initial session 
    const getSession = async () => { 
      const { data: { session } } = await supabase.auth.getSession() // Get the current session from Supabase
      setSession(session) // Update the session state
      setUser(session?.user ?? null) // Update the user state
      setLoading(false) // Set loading to false after fetching session
    }

    getSession() // Call the function to get the initial session

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange( // Listen for auth state changes
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe() // Cleanup subscription on unmount
  }, [])

  const signUp = async (email: string, password: string) => { // Function to sign up a new user
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => { // Function to sign in an existing user
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => { // Function to sign out the current user
    await supabase.auth.signOut()
  }

  const value = { // Value to be provided to the context consumers
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return ( // Return the context value 
    <AuthContext.Provider value={value}> 
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { // Custom hook to access the AuthContext
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}