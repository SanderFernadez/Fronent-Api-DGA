<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <!-- Card de Login -->
          <div class="card border-0 shadow-lg">
            <div class="card-body p-5">
              <!-- Header -->
              <div class="text-center mb-4">
                <div class="avatar-lg mx-auto mb-3">
                  <div class="avatar-title bg-primary bg-opacity-10 rounded-circle">
                    <i class="fas fa-lock fa-2x text-primary"></i>
                  </div>
                </div>
                <h4 class="fw-bold text-dark mb-1">Iniciar Sesión</h4>
                <p class="text-muted">Ingresa tus credenciales para acceder</p>
              </div>

              <!-- Formulario de Login -->
              <form @submit.prevent="handleLogin">
                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label fw-semibold">Email</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="fas fa-envelope text-muted"></i>
                    </span>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-control border-start-0"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="admin@api-dga.com"
                      required
                      autocomplete="email"
                    />
                  </div>
                  <div v-if="errors.email" class="invalid-feedback d-block">
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Contraseña -->
                <div class="mb-4">
                  <label for="password" class="form-label fw-semibold">Contraseña</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="fas fa-lock text-muted"></i>
                    </span>
                    <input
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control border-start-0"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="••••••••"
                      required
                      autocomplete="current-password"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary border-start-0"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.password" class="invalid-feedback d-block">
                    {{ errors.password }}
                  </div>
                </div>

                <!-- Botón de Login -->
                <div class="d-grid mb-3">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i v-else class="fas fa-sign-in-alt me-2"></i>
                    {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                  </button>
                </div>

                <!-- Enlaces adicionales -->
                <div class="text-center">
                  <p class="text-muted mb-0">
                    ¿No tienes cuenta?
                    <a href="#" @click.prevent="showRegister = true" class="text-decoration-none">
                      Regístrate aquí
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <!-- Información de credenciales por defecto -->
          <div class="text-center mt-4">
            <div class="alert alert-info border-0" role="alert">
              <h6 class="alert-heading mb-2">
                <i class="fas fa-info-circle me-2"></i>Credenciales por defecto
              </h6>
              <p class="mb-1 small">
                <strong>Email:</strong> admin@api-dga.com<br>
                <strong>Contraseña:</strong> Admin123!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Registro -->
    <div v-if="showRegister" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              <i class="fas fa-user-plus me-2 text-primary"></i>Registrar Usuario
            </h5>
            <button type="button" class="btn-close" @click="showRegister = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleRegister">
              <!-- Nombre -->
              <div class="mb-3">
                <label for="registerName" class="form-label fw-semibold">Nombre completo</label>
                <input
                  id="registerName"
                  v-model="registerForm.name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': registerErrors.name }"
                  placeholder="Tu nombre completo"
                  required
                />
                <div v-if="registerErrors.name" class="invalid-feedback">
                  {{ registerErrors.name }}
                </div>
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label for="registerEmail" class="form-label fw-semibold">Email</label>
                <input
                  id="registerEmail"
                  v-model="registerForm.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': registerErrors.email }"
                  placeholder="tu@email.com"
                  required
                />
                <div v-if="registerErrors.email" class="invalid-feedback">
                  {{ registerErrors.email }}
                </div>
              </div>

              <!-- Contraseña -->
              <div class="mb-3">
                <label for="registerPassword" class="form-label fw-semibold">Contraseña</label>
                <input
                  id="registerPassword"
                  v-model="registerForm.password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': registerErrors.password }"
                  placeholder="••••••••"
                  required
                />
                <div v-if="registerErrors.password" class="invalid-feedback">
                  {{ registerErrors.password }}
                </div>
              </div>

              <!-- Confirmar Contraseña -->
              <div class="mb-4">
                <label for="confirmPassword" class="form-label fw-semibold">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  v-model="registerForm.confirmPassword"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': registerErrors.confirmPassword }"
                  placeholder="••••••••"
                  required
                />
                <div v-if="registerErrors.confirmPassword" class="invalid-feedback">
                  {{ registerErrors.confirmPassword }}
                </div>
              </div>

              <!-- Botones -->
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-secondary flex-fill" @click="showRegister = false">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary flex-fill" :disabled="registerLoading">
                  <span v-if="registerLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ registerLoading ? 'Registrando...' : 'Registrar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authService, type LoginRequest, type RegisterRequest } from '@/services/authService'
import { showErrorMessage } from '@/utils/errorHandler'

const router = useRouter()

// Estado reactivo
const loading = ref(false)
const registerLoading = ref(false)
const showPassword = ref(false)
const showRegister = ref(false)

// Formulario de login
const form = reactive<LoginRequest>({
  email: '',
  password: ''
})

// Formulario de registro
const registerForm = reactive<RegisterRequest>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Errores
const errors = reactive({
  email: '',
  password: ''
})

const registerErrors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Validaciones
const validateLoginForm = () => {
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'El email no es válido'
  }

  if (!form.password) {
    errors.password = 'La contraseña es requerida'
  } else if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  return !errors.email && !errors.password
}

const validateRegisterForm = () => {
  registerErrors.name = ''
  registerErrors.email = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''

  if (!registerForm.name.trim()) {
    registerErrors.name = 'El nombre es requerido'
  }

  if (!registerForm.email) {
    registerErrors.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    registerErrors.email = 'El email no es válido'
  }

  if (!registerForm.password) {
    registerErrors.password = 'La contraseña es requerida'
  } else if (registerForm.password.length < 6) {
    registerErrors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Confirma tu contraseña'
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Las contraseñas no coinciden'
  }

  return !registerErrors.name && !registerErrors.email && !registerErrors.password && !registerErrors.confirmPassword
}

// Handlers
const handleLogin = async () => {
  if (!validateLoginForm()) return

  try {
    loading.value = true
    console.log('Intentando login con credenciales:', { email: form.email, password: '***' })
    console.log('URL de la API:', import.meta.env.VITE_API_URL || 'https://localhost:7067/api')
    const response = await authService.login(form)
    console.log('Respuesta completa del login:', response)
    console.log('Datos de la respuesta:', response.data)
    
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

      // Redirigir al dashboard
      router.push('/')
    } else {
      console.error('Respuesta inválida:', response.data)
      showErrorMessage('Error de autenticación', 'Respuesta inválida del servidor')
    }
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al iniciar sesión'
    showErrorMessage('Error de autenticación', message)
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!validateRegisterForm()) return

  try {
    registerLoading.value = true
    const response = await authService.register(registerForm)
    
    if (response.data?.success) {
      showErrorMessage('Registro exitoso', 'Usuario registrado correctamente. Ahora puedes iniciar sesión.')
      showRegister.value = false
      
      // Limpiar formulario de registro
      Object.assign(registerForm, {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
    }
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al registrar usuario'
    showErrorMessage('Error de registro', message)
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped>
.avatar-lg {
  width: 80px;
  height: 80px;
}

.avatar-title {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-group-text {
  border-color: #dee2e6;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}

.modal.show {
  backdrop-filter: blur(5px);
}
</style>
