export interface Todo {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
}

export type TodoFilter = 'all' | 'active' | 'completed' | 'due-today' | 'priority';