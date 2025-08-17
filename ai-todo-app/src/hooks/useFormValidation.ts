import { useState } from 'react'
import { z } from 'zod'

interface UseFormValidationProps<T extends Record<string, any>> { // Props for the useFormValidation hook
  schema: z.ZodObject<any>
  onSubmit: (data: T) => Promise<void> // Function to call on form submission
  initialValues: T // Initial values for the form fields
}

interface FieldError { // Type for field errors
  message: string
}

export function useFormValidation<T extends Record<string, any>>({ // Custom hook for form validation
  schema,
  onSubmit,
  initialValues,
}: UseFormValidationProps<T>) { 
  const [values, setValues] = useState<T>(initialValues) // State to hold form values
  const [errors, setErrors] = useState<Partial<Record<keyof T, FieldError>>>({}) // State to hold validation errors
  const [isSubmitting, setIsSubmitting] = useState(false) // State to indicate if the form is being submitted
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({}) // State to track if fields have been touched

  const validateField = (name: keyof T, value: any) => { // Function to validate a single field
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
    } catch (error) { // If validation fails, set the error
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name]: { message: error.issues[0].message }
        }))
      }
    }
  }

  const setValue = (name: keyof T, value: any) => { // Function to set a field value
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Validate field if it's been touched
    if (touched[name]) {
      validateField(name, value)
    }
  }

  const setFieldTouched = (name: keyof T) => { // Function to mark a field as touched
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, values[name])
  }

  const handleSubmit = async (e: React.FormEvent) => { // Function to handle form submission
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate all fields
      const validatedData = schema.parse(values)
      setErrors({}) // Clear any previous errors
      
      // Submit the form
      await onSubmit(validatedData as T)
    } catch (error) { // If validation fails, set the errors
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof T, FieldError>> = {} // Create an object to store field errors
        error.issues.forEach(err => { // Iterate over validation issues
          if (err.path.length > 0) { // If the error has a path, it corresponds to a field
            const fieldName = err.path[0] as keyof T // Get the field name from the error path
            fieldErrors[fieldName] = { message: err.message } // Set the error message for the field
          }
        })
        setErrors(fieldErrors) // Update the errors state with the field errors
      }
    } finally { // Reset submitting state
      setIsSubmitting(false)
    }
  }

  const getFieldError = (name: keyof T): string | undefined => { // Function to get the error message for a specific field
    return errors[name]?.message
  }

  const hasErrors = Object.keys(errors).length > 0 // Check if there are any validation errors
  const isFieldInvalid = (name: keyof T) => touched[name] && !!errors[name] // Check if a specific field is invalid

  return { // Return the form state and methods
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