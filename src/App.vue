<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const router = useRouter()

// Estado del menú móvil
const mobileMenuOpen = ref(false)

// Función para alternar el menú móvil
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Verificar si el usuario está autenticado
const isAuthenticated = computed(() => authService.hasValidToken())

// Obtener información del usuario
const currentUser = computed(() => authService.getUser())

// Función para cerrar sesión
const handleLogout = async () => {
  try {
    const { refreshToken } = authService.getTokens()
    if (refreshToken) {
      await authService.revokeToken(refreshToken)
    }
  } catch (error) {
    console.warn('Error al revocar token:', error)
  } finally {
    // Limpiar tokens y redirigir al login
    authService.clearTokens()
    router.push('/login')
  }
}
</script>

<template>
  <div id="app">
    <!-- Header (solo mostrar si está autenticado) -->
    <header v-if="isAuthenticated" class="bg-primary text-white shadow">
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
          <router-link class="navbar-brand fw-bold" to="/">
            DGA - Panel Administrativo
          </router-link>
          
          <!-- Botón del menú móvil -->
          <button 
            class="navbar-toggler" 
            type="button" 
            @click="toggleMobileMenu"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <!-- Menú de navegación -->
          <div class="collapse navbar-collapse" :class="{ 'show': mobileMenuOpen }">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <router-link 
                  to="/" 
                  class="nav-link"
                  :class="{ 'active': $route.name === 'dashboard' }"
                  @click="mobileMenuOpen = false"
                >
                  <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                </router-link>
              </li>
              <li class="nav-item">
                <router-link 
                  to="/clients" 
                  class="nav-link"
                  :class="{ 'active': $route.name === 'clients' }"
                  @click="mobileMenuOpen = false"
                >
                  <i class="fas fa-users me-2"></i>Clientes
                </router-link>
              </li>
              <li class="nav-item">
                <router-link 
                  to="/products" 
                  class="nav-link"
                  :class="{ 'active': $route.name === 'products' }"
                  @click="mobileMenuOpen = false"
                >
                  <i class="fas fa-box me-2"></i>Productos
                </router-link>
              </li>
              <li class="nav-item">
                <router-link 
                  to="/sales" 
                  class="nav-link"
                  :class="{ 'active': $route.name === 'sales' }"
                  @click="mobileMenuOpen = false"
                >
                  <i class="fas fa-shopping-cart me-2"></i>Ventas
                </router-link>
              </li>
            </ul>
            
            <!-- Información del usuario y logout -->
            <ul v-if="isAuthenticated" class="navbar-nav">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-user-circle me-2"></i>
                  <span class="d-none d-md-inline">{{ currentUser?.name || 'Usuario' }}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <div class="dropdown-item-text">
                      <small class="text-muted d-block">{{ currentUser?.email }}</small>
                      <small class="text-muted">{{ currentUser?.roles?.join(', ') }}</small>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <button @click="handleLogout" class="dropdown-item text-danger">
                      <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- Contenido principal -->
    <main class="container py-4">
      <router-view />
    </main>

    <!-- Footer (solo mostrar si está autenticado) -->
    <footer v-if="isAuthenticated" class="bg-light border-top mt-auto">
      <div class="container py-4">
        <p class="text-center text-muted mb-0">
          © 2025 DGA - Sistema de Gestión de Productos y Ventas
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Estilos globales */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

/* Personalización de Bootstrap */
.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  font-weight: 500;
  transition: color 0.15s ease-in-out;
}

.nav-link:hover {
  color: rgba(255, 255, 255, 0.8) !important;
}

.nav-link.active {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 600;
}

/* Mejoras para formularios */
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Mejoras para tablas */
.table th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

/* Mejoras para cards */
.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

/* Mejoras para botones */
.btn {
  font-weight: 500;
  transition: all 0.15s ease-in-out;
}

.btn:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Utilidades adicionales */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive utilities */
@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.25rem;
  }
  
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
