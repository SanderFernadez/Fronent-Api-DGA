import axios from 'axios'
import { environment } from '@/config/environment'
import { handleError } from '@/utils/errorHandler'
import { authService } from './authService'

// Configuración de la API
const api = axios.create({
  baseURL: environment.apiBaseUrl,
  timeout: environment.requestTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    console.log('Interceptor de request - URL:', config.url)
    console.log('Interceptor de request - Método:', config.method)
    
    const { accessToken } = authService.getTokens()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      console.log('Token agregado al header')
    } else {
      console.log('No hay token disponible')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y renovación de tokens
api.interceptors.response.use(
  (response) => {
    console.log('Interceptor de response - URL:', response.config.url)
    console.log('Interceptor de response - Status:', response.status)
    
    // Para endpoints de autenticación, devolver la respuesta completa
    if (response.config.url?.includes('/Auth/')) {
      console.log('Endpoint de Auth detectado, devolviendo respuesta completa')
      return response
    }
    // Para otros endpoints, devolver solo los datos
    console.log('Endpoint normal, devolviendo solo data')
    return response.data
  },
  async (error) => {
    const originalRequest = error.config

    // Si el error es 401 (no autorizado) y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken } = authService.getTokens()
        if (refreshToken) {
          // Intentar renovar el token
          const response = await authService.refreshToken(refreshToken)
          if (response.accessToken) {
            // Guardar nuevos tokens
            authService.saveTokens(
              response.accessToken,
              response.refreshToken || refreshToken,
              response.expiresAt || new Date(Date.now() + 60 * 60 * 1000).toISOString()
            )
            
            // Reintentar la petición original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        // Si falla la renovación, limpiar tokens y redirigir al login
        authService.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Manejar el error usando el manejador global
    const appError = handleError(error)
    console.error('Error en la API:', appError.message)
    return Promise.reject(error)
  }
)

export default api
