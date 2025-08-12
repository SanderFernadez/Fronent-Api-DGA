<script setup lang="ts">
import { ref } from 'vue'

// Estado del menú móvil
const mobileMenuOpen = ref(false)

// Función para alternar el menú móvil
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <div id="app">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">DGA - Panel Administrativo</h1>
          <nav class="hidden md:flex space-x-6">
            <router-link 
              to="/" 
              class="hover:text-blue-200 transition-colors"
              :class="{ 'text-blue-200': $route.name === 'dashboard' }"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/clients" 
              class="hover:text-blue-200 transition-colors"
              :class="{ 'text-blue-200': $route.name === 'clients' }"
            >
              Clientes
            </router-link>
            <router-link 
              to="/products" 
              class="hover:text-blue-200 transition-colors"
              :class="{ 'text-blue-200': $route.name === 'products' }"
            >
              Productos
            </router-link>
            <router-link 
              to="/sales" 
              class="hover:text-blue-200 transition-colors"
              :class="{ 'text-blue-200': $route.name === 'sales' }"
            >
              Ventas
            </router-link>
          </nav>
          
          <!-- Menú móvil -->
          <button 
            @click="toggleMobileMenu" 
            class="md:hidden text-white focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        
        <!-- Menú móvil desplegable -->
        <nav v-if="mobileMenuOpen" class="md:hidden mt-4 pb-4">
          <div class="flex flex-col space-y-2">
            <router-link 
              to="/" 
              @click="mobileMenuOpen = false"
              class="hover:text-blue-200 transition-colors py-2"
              :class="{ 'text-blue-200': $route.name === 'dashboard' }"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/clients" 
              @click="mobileMenuOpen = false"
              class="hover:text-blue-200 transition-colors py-2"
              :class="{ 'text-blue-200': $route.name === 'clients' }"
            >
              Clientes
            </router-link>
            <router-link 
              to="/products" 
              @click="mobileMenuOpen = false"
              class="hover:text-blue-200 transition-colors py-2"
              :class="{ 'text-blue-200': $route.name === 'products' }"
            >
              Productos
            </router-link>
            <router-link 
              to="/sales" 
              @click="mobileMenuOpen = false"
              class="hover:text-blue-200 transition-colors py-2"
              :class="{ 'text-blue-200': $route.name === 'sales' }"
            >
              Ventas
            </router-link>
          </div>
        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 border-t mt-auto">
      <div class="container mx-auto px-4 py-6">
        <p class="text-center text-gray-600">
          © 2025 DGA - Sistema de Gestión de Productos y Ventas
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
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

/* Estilos para formularios */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

/* Tablas */
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.table th {
  background-color: #f9fafb;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.table tr:hover {
  background-color: #f9fafb;
}

/* Cards */
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

/* Grid responsivo */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Utilidades */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}
</style>
