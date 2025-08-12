// Validaciones centralizadas para formularios

import { isValidEmail, isValidPhone } from './helpers'

// Tipos de validación
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

// Reglas de validación para clientes
export const clientValidationRules: ValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    custom: (value: string) => {
      if (!isValidEmail(value)) {
        return 'El email no tiene un formato válido'
      }
      return null
    }
  },
  phone: {
    required: true,
    custom: (value: string) => {
      if (!isValidPhone(value)) {
        return 'El teléfono no tiene un formato válido'
      }
      return null
    }
  }
}

// Reglas de validación para productos
export const productValidationRules: ValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500
  },
  price: {
    required: true,
    custom: (value: number) => {
      if (value <= 0) {
        return 'El precio debe ser mayor a 0'
      }
      return null
    }
  },
  stock: {
    required: true,
    custom: (value: number) => {
      if (value < 0) {
        return 'El stock no puede ser negativo'
      }
      return null
    }
  }
}

// Reglas de validación para ventas
export const saleValidationRules: ValidationRules = {
  clientId: {
    required: true,
    custom: (value: number) => {
      if (!value || value === 0) {
        return 'Debe seleccionar un cliente'
      }
      return null
    }
  },
  date: {
    required: true
  },
  saleProducts: {
    required: true,
    custom: (value: any[]) => {
      if (!value || value.length === 0) {
        return 'Debe agregar al menos un producto'
      }
      return null
    }
  }
}

/**
 * Valida un campo según las reglas especificadas
 * @param value - Valor a validar
 * @param rules - Reglas de validación
 * @returns Mensaje de error o null si es válido
 */
export const validateField = (value: any, rules: ValidationRule): string | null => {
  // Validación requerida
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return 'Este campo es obligatorio'
  }

  // Si no hay valor y no es requerido, es válido
  if (!value) {
    return null
  }

  // Validación de longitud mínima
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    return `Debe tener al menos ${rules.minLength} caracteres`
  }

  // Validación de longitud máxima
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `Debe tener máximo ${rules.maxLength} caracteres`
  }

  // Validación de patrón
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return 'El formato no es válido'
  }

  // Validación personalizada
  if (rules.custom) {
    return rules.custom(value)
  }

  return null
}

/**
 * Valida un formulario completo
 * @param data - Datos del formulario
 * @param rules - Reglas de validación
 * @returns Objeto con errores por campo
 */
export const validateForm = (data: any, rules: ValidationRules): Record<string, string> => {
  const errors: Record<string, string> = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[field], fieldRules)
    if (error) {
      errors[field] = error
    }
  }

  return errors
}

/**
 * Valida si un formulario es válido
 * @param errors - Objeto de errores
 * @returns true si no hay errores
 */
export const isFormValid = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length === 0
}

