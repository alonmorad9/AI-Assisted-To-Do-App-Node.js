import { supabase } from './supabase'
import { Todo } from '../types'

export async function createTodo(todo: Omit<Todo, 'id' | 'created_at' | 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('todos')
    .insert({
      ...todo,
      user_id: user.id,
    })
    .select()
    .single()

  return { data, error }
}

export async function getTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function updateTodo(id: string, updates: Partial<Todo>) {
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function deleteTodo(id: string) {
  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  return { data, error }
}