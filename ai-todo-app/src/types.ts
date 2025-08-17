export interface Todo { // Type definition for a Todo item
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  user_id: string;
}

export interface User { // Type definition for a User
  id: string;
  email: string;
}

export type TodoFilter = 'all' | 'active' | 'completed' | 'due-today' | 'priority'; // Type definition for TodoFilter

export interface Database { // Type definition for the database schema
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