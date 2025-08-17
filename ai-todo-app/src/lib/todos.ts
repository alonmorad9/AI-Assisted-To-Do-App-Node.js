import { supabase } from './supabase'
import { Todo } from '../types'
import { createTodoSchema, updateTodoSchema, sanitizeTodoInput } from './validation'

export async function createTodo(todo: Omit<Todo, 'id' | 'created_at' | 'user_id'>) { // Function to create a new todo
  try {
    // Server-side validation
    const validationResult = createTodoSchema.safeParse(todo) // Validate the todo input against the schema
    if (!validationResult.success) {
      return { 
        data: null, 
        error: { 
          message: `Validation error: ${validationResult.error.issues[0].message}` // Return the first validation error
        } 
      }
    }

    // Sanitize the validated data
    const sanitizedTodo = sanitizeTodoInput(validationResult.data)

    const { data: { user } } = await supabase.auth.getUser() // Get the current user from Supabase
    
    if (!user) { // If no user is authenticated, return an error
      return { 
        data: null, 
        error: { message: 'User not authenticated' } 
      }
    }

    const { data, error } = await supabase // Insert the new todo into the database
      .from('todos')
      .insert({
        ...sanitizedTodo,
        user_id: user.id,
      })
      .select() // Select the inserted todo
      .single() // Get the inserted todo data

    return { data, error } // Return the created todo or an error
  } catch (err) { // Catch any unexpected errors
    console.error('Error creating todo:', err)
    return { 
      data: null, 
      error: { message: 'Failed to create todo. Please try again.' } 
    }
  }
}

export async function getTodos() { // Function to get all todos
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        data: null, 
        error: { message: 'User not authenticated' } 
      }
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return { data, error }
  } catch (err) {
    console.error('Error fetching todos:', err)
    return { 
      data: null, 
      error: { message: 'Failed to load todos. Please try again.' } 
    }
  }
}

export async function updateTodo(id: string, updates: Partial<Todo>) { // Function to update an existing todo
  try {
    // Validate the ID
    if (!id || typeof id !== 'string') {
      return { 
        data: null, 
        error: { message: 'Invalid todo ID' } 
      }
    }

    // Server-side validation for updates
    const validationResult = updateTodoSchema.safeParse(updates)
    if (!validationResult.success) {
      return { 
        data: null, 
        error: { 
          message: `Validation error: ${validationResult.error.issues[0].message}` 
        } 
      }
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        data: null, 
        error: { message: 'User not authenticated' } 
      }
    }

    // Sanitize string fields in updates
    const sanitizedUpdates = { ...validationResult.data }
    if (sanitizedUpdates.title) {
      sanitizedUpdates.title = sanitizedUpdates.title.trim()
    }
    if (sanitizedUpdates.description) {
      sanitizedUpdates.description = sanitizedUpdates.description.trim()
    }

    const { data, error } = await supabase
      .from('todos')
      .update(sanitizedUpdates)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own todos
      .select()
      .single()

    return { data, error }
  } catch (err) {
    console.error('Error updating todo:', err)
    return { 
      data: null, 
      error: { message: 'Failed to update todo. Please try again.' } 
    }
  }
}

export async function deleteTodo(id: string) { // Function to delete a todo by ID
  try {
    // Validate the ID
    if (!id || typeof id !== 'string') {
      return { 
        data: null, 
        error: { message: 'Invalid todo ID' } 
      }
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        data: null, 
        error: { message: 'User not authenticated' } 
      }
    }

    const { data, error } = await supabase // Delete the todo from the database
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only delete their own todos
      .select()
      .single()

    return { data, error } // Return the deleted todo or an error
  } catch (err) { // Catch any unexpected errors
    console.error('Error deleting todo:', err)
    return { 
      data: null, 
      error: { message: 'Failed to delete todo. Please try again.' } 
    }
  }
}