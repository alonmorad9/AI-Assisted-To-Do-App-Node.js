import { z } from 'zod'

// Auth validation schemas
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
})

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

// Todo validation schemas
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  due_date: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, 'Due date cannot be in the past'),
  priority: z.enum(['low', 'medium', 'high'], {
    message: 'Priority must be low, medium, or high',
  }),
})

export const updateTodoSchema = createTodoSchema.partial().extend({
  completed: z.boolean().optional(),
})

// Type inference from schemas
export type SignUpData = z.infer<typeof signUpSchema>
export type SignInData = z.infer<typeof signInSchema>
export type CreateTodoData = z.infer<typeof createTodoSchema>
export type UpdateTodoData = z.infer<typeof updateTodoSchema>

// Validation helper functions
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  try {
    z.string().email().parse(email)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0].message }
    }
    return { isValid: false, error: 'Invalid email' }
  }
}

export function validateTodoTitle(title: string): { isValid: boolean; error?: string } {
  try {
    createTodoSchema.pick({ title: true }).parse({ title })
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0].message }
    }
    return { isValid: false, error: 'Invalid title' }
  }
}

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

export function sanitizeTodoInput(input: CreateTodoData): CreateTodoData {
  return {
    title: sanitizeString(input.title),
    description: input.description ? sanitizeString(input.description) : undefined,
    due_date: input.due_date,
    priority: input.priority,
  }
}