import axios from 'axios'
import { environment } from '@/config/environment'
import { handleError } from '@/utils/errorHandler'

// Configuración de la API
const api = axios.create({
  baseURL: environment.apiBaseUrl,
  timeout: environment.requestTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    // La API devuelve los datos en response.data.data
    return response.data
  },
  (error) => {
    // Manejar el error usando el manejador global
    const appError = handleError(error)
    console.error('Error en la API:', appError.message)
    return Promise.reject(error)
  }
)

export default api
