import api from './api'

// Interfaces para autenticación
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  message: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: string
  user?: {
    id: number
    name: string
    email: string
    roles: string[]
  }
}

export interface User {
  id: number
  name: string
  email: string
  roles: string[]
}

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Enviando petición de login a:', '/Auth/login')
      console.log('Datos enviados:', credentials)
      const response = await api.post('/Auth/login', credentials)
      console.log('Respuesta del login:', response)
      return response
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  },

  // Registrar usuario
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/Auth/register', userData)
      return response
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  },

  // Renovar token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/Auth/refresh-token', { refreshToken })
      return response
    } catch (error) {
      console.error('Error al renovar token:', error)
      throw error
    }
  },

  // Validar token
  async validateToken(): Promise<{ message: string }> {
    try {
      const response = await api.get('/Auth/validate')
      return response
    } catch (error) {
      console.error('Error al validar token:', error)
      throw error
    }
  },

  // Revocar token
  async revokeToken(refreshToken: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/Auth/revoke-token', refreshToken)
      return response
    } catch (error) {
      console.error('Error al revocar token:', error)
      throw error
    }
  },

  // Guardar tokens en localStorage
  saveTokens(accessToken: string, refreshToken: string, expiresAt: string) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('tokenExpiresAt', expiresAt)
  },

  // Obtener tokens del localStorage
  getTokens() {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      expiresAt: localStorage.getItem('tokenExpiresAt')
    }
  },

  // Limpiar tokens
  clearTokens() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiresAt')
    localStorage.removeItem('user')
  },

  // Verificar si el token está expirado
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('tokenExpiresAt')
    if (!expiresAt) return true
    
    const expirationDate = new Date(expiresAt)
    const now = new Date()
    
    return now >= expirationDate
  },

  // Verificar si hay un token válido
  hasValidToken(): boolean {
    const { accessToken } = this.getTokens()
    return !!accessToken && !this.isTokenExpired()
  },

  // Guardar información del usuario
  saveUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
  },

  // Obtener información del usuario
  getUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}
