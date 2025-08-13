// Configuración del entorno de la aplicación
export const environment = {
  // URL base de la API
  apiBaseUrl: 'https://localhost:7067/api',
  
  // Configuración de la aplicación
  appTitle: 'DGA - Panel Administrativo',
  appVersion: '1.0.0',
  
  // Configuración de desarrollo
  isDevelopment: import.meta.env.DEV,
  
  // Timeout para peticiones HTTP (en milisegundos)
  requestTimeout: 10000,
  
  // Configuración de paginación
  defaultPageSize: 10,
  
  // Configuración de validación
  validation: {
    minPasswordLength: 6,
    maxNameLength: 100,
    maxDescriptionLength: 500
  }
}

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${environment.apiBaseUrl}${endpoint}`
}

// Función para verificar si estamos en modo desarrollo
export const isDevelopment = (): boolean => {
  return environment.isDevelopment
}


