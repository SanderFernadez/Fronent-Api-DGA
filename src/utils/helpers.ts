// Utilidades y funciones helper para la aplicación

/**
 * Formatea una fecha a formato legible
 * @param dateString - Fecha en formato string
 * @returns Fecha formateada
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formatea un número como moneda
 * @param amount - Cantidad a formatear
 * @param currency - Moneda (por defecto USD)
 * @returns Cantidad formateada como moneda
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Valida si un email tiene formato válido
 * @param email - Email a validar
 * @returns true si el email es válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida si un teléfono tiene formato válido
 * @param phone - Teléfono a validar
 * @returns true si el teléfono es válido
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/
  return phoneRegex.test(phone)
}

/**
 * Genera un ID único
 * @returns ID único
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Debounce function para optimizar búsquedas
 * @param func - Función a ejecutar
 * @param wait - Tiempo de espera en milisegundos
 * @returns Función debounced
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Capitaliza la primera letra de una cadena
 * @param str - Cadena a capitalizar
 * @returns Cadena capitalizada
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Trunca una cadena si excede la longitud máxima
 * @param str - Cadena a truncar
 * @param maxLength - Longitud máxima
 * @returns Cadena truncada
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

/**
 * Obtiene el estado del stock basado en la cantidad
 * @param stock - Cantidad en stock
 * @returns Objeto con estado y clase CSS
 */
export const getStockStatus = (stock: number) => {
  if (stock === 0) {
    return {
      status: 'Sin Stock',
      class: 'bg-red-100 text-red-800',
      textClass: 'text-red-600 font-bold'
    }
  }
  if (stock <= 5) {
    return {
      status: 'Bajo Stock',
      class: 'bg-orange-100 text-orange-800',
      textClass: 'text-orange-600 font-semibold'
    }
  }
  return {
    status: 'Disponible',
    class: 'bg-green-100 text-green-800',
    textClass: 'text-green-600'
  }
}

/**
 * Calcula el total de una lista de productos
 * @param products - Lista de productos con cantidad y precio
 * @returns Total calculado
 */
export const calculateTotal = (products: Array<{ quantity: number; unitPrice: number }>): number => {
  return products.reduce((total, product) => {
    return total + (product.quantity * product.unitPrice)
  }, 0)
}

