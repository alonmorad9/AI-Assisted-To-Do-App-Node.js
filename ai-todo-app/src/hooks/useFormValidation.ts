import { useState } from 'react'
import { z } from 'zod'

interface UseFormValidationProps<T extends Record<string, any>> {
  schema: z.ZodObject<any>
  onSubmit: (data: T) => Promise<void>
  initialValues: T
}

interface FieldError {
  message: string
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  onSubmit,
  initialValues,
}: UseFormValidationProps<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, FieldError>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = (name: keyof T, value: any) => {
    try {
      // Validate just this field
      const fieldSchema = schema.pick({ [name]: true } as any)
      fieldSchema.parse({ [name]: value })
      
      // Clear error if validation passes
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name]: { message: error.issues[0].message }
        }))
      }
    }
  }

  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Validate field if it's been touched
    if (touched[name]) {
      validateField(name, value)
    }
  }

  const setFieldTouched = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, values[name])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate all fields
      const validatedData = schema.parse(values)
      setErrors({})
      
      // Submit the form
      await onSubmit(validatedData as T)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof T, FieldError>> = {}
        error.issues.forEach(err => {
          if (err.path.length > 0) {
            const fieldName = err.path[0] as keyof T
            fieldErrors[fieldName] = { message: err.message }
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldError = (name: keyof T): string | undefined => {
    return errors[name]?.message
  }

  const hasErrors = Object.keys(errors).length > 0
  const isFieldInvalid = (name: keyof T) => touched[name] && !!errors[name]

  return {
    values,
    errors,
    touched,
    isSubmitting,
    hasErrors,
    setValue,
    setFieldTouched,
    handleSubmit,
    getFieldError,
    isFieldInvalid,
  }
}