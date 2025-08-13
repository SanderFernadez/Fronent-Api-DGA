import { ref, computed } from 'vue'
import { authService, type User } from '@/services/authService'

// Estado reactivo de autenticación
const isAuthenticated = ref(authService.hasValidToken())
const currentUser = ref<User | null>(authService.getUser())

// Store de autenticación
export const useAuthStore = () => {
  // Actualizar estado de autenticación
  const updateAuthState = () => {
    isAuthenticated.value = authService.hasValidToken()
    currentUser.value = authService.getUser()
  }

  // Login
  const login = async (credentials: { email: string; password: string }) => {
    const response = await authService.login(credentials)
    
    if (response.data?.success && response.data?.accessToken) {
      // Guardar tokens y usuario
      authService.saveTokens(
        response.data.accessToken,
        response.data.refreshToken || '',
        response.data.expiresAt || new Date(Date.now() + 60 * 60 * 1000).toISOString()
      )
      
      if (response.data.user) {
        authService.saveUser(response.data.user)
      }

      // Actualizar estado reactivo
      updateAuthState()
      return true
    }
    return false
  }

  // Logout
  const logout = async () => {
    try {
      const { refreshToken } = authService.getTokens()
      if (refreshToken) {
        await authService.revokeToken(refreshToken)
      }
    } catch (error) {
      console.warn('Error al revocar token:', error)
    } finally {
      // Limpiar tokens
      authService.clearTokens()
      
      // Actualizar estado reactivo
      updateAuthState()
    }
  }

  // Verificar autenticación
  const checkAuth = () => {
    updateAuthState()
  }

  return {
    // Estado
    isAuthenticated: computed(() => isAuthenticated.value),
    currentUser: computed(() => currentUser.value),
    
    // Métodos
    login,
    logout,
    checkAuth,
    updateAuthState
  }
}
