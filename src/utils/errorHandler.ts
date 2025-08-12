// Manejador global de errores para la aplicación

import { environment } from '@/config/environment'

// Tipos de errores
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

// Interfaz para errores de la aplicación
export interface AppError {
  type: ErrorType
  message: string
  details?: any
  timestamp: Date
}

/**
 * Clase para manejar errores de la aplicación
 */
export class ErrorHandler {
  private static instance: ErrorHandler
  private errors: AppError[] = []

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * Maneja un error de la API
   * @param error - Error de Axios o cualquier otro error
   * @returns Error procesado
   */
  handleApiError(error: any): AppError {
    let appError: AppError

    if (error.response) {
      // Error de respuesta del servidor
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          appError = {
            type: ErrorType.VALIDATION,
            message: data?.message || 'Datos inválidos',
            details: data?.errors,
            timestamp: new Date()
          }
          break
        case 401:
          appError = {
            type: ErrorType.AUTHENTICATION,
            message: 'No autorizado',
            timestamp: new Date()
          }
          break
        case 403:
          appError = {
            type: ErrorType.AUTHORIZATION,
            message: 'Acceso denegado',
            timestamp: new Date()
          }
          break
        case 404:
          appError = {
            type: ErrorType.NOT_FOUND,
            message: 'Recurso no encontrado',
            timestamp: new Date()
          }
          break
        case 500:
          appError = {
            type: ErrorType.SERVER,
            message: 'Error interno del servidor',
            timestamp: new Date()
          }
          break
        default:
          appError = {
            type: ErrorType.UNKNOWN,
            message: data?.message || 'Error desconocido',
            timestamp: new Date()
          }
      }
    } else if (error.request) {
      // Error de red
      appError = {
        type: ErrorType.NETWORK,
        message: 'Error de conexión. Verifica tu conexión a internet.',
        timestamp: new Date()
      }
    } else {
      // Error desconocido
      appError = {
        type: ErrorType.UNKNOWN,
        message: error.message || 'Error desconocido',
        timestamp: new Date()
      }
    }

    // Registrar el error
    this.logError(appError)

    return appError
  }

  /**
   * Registra un error en el historial
   * @param error - Error a registrar
   */
  private logError(error: AppError): void {
    this.errors.push(error)

    // Mantener solo los últimos 100 errores
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100)
    }

    // Log en consola en modo desarrollo
    if (environment.isDevelopment) {
      console.error('Error registrado:', error)
    }
  }

  /**
   * Obtiene el historial de errores
   * @returns Array de errores
   */
  getErrorHistory(): AppError[] {
    return [...this.errors]
  }

  /**
   * Limpia el historial de errores
   */
  clearErrorHistory(): void {
    this.errors = []
  }

  /**
   * Obtiene errores por tipo
   * @param type - Tipo de error
   * @returns Array de errores del tipo especificado
   */
  getErrorsByType(type: ErrorType): AppError[] {
    return this.errors.filter(error => error.type === type)
  }

  /**
   * Obtiene el último error
   * @returns Último error registrado o null
   */
  getLastError(): AppError | null {
    return this.errors.length > 0 ? this.errors[this.errors.length - 1] : null
  }
}

// Instancia global del manejador de errores
export const errorHandler = ErrorHandler.getInstance()

/**
 * Función helper para manejar errores de forma rápida
 * @param error - Error a manejar
 * @returns Error procesado
 */
export const handleError = (error: any): AppError => {
  return errorHandler.handleApiError(error)
}

/**
 * Función para mostrar mensajes de error al usuario
 * @param error - Error a mostrar
 */
export const showErrorMessage = (error: AppError): void => {
  // Aquí podrías integrar con un sistema de notificaciones
  // Por ahora solo usamos alert
  alert(`Error: ${error.message}`)
}

/**
 * Función para manejar errores y mostrar mensaje al usuario
 * @param error - Error a manejar
 */
export const handleAndShowError = (error: any): void => {
  const appError = handleError(error)
  showErrorMessage(appError)
}
