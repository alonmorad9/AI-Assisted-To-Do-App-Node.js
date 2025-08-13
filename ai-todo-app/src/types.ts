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

// Database type for Supabase
export interface Database {
  public: {
    Tables: {
      todos: {
        Row: Todo;
        Insert: Omit<Todo, 'id' | 'created_at'>;
        Update: Partial<Omit<Todo, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
}