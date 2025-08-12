<template>
  <div>
    <div class="card-header">
      <h1 class="card-title">Dashboard</h1>
      <p class="text-gray-600">Resumen general del sistema</p>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <div class="card">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-blue-600">{{ stats.clients }}</h3>
          <p class="text-gray-600">Clientes</p>
        </div>
      </div>
      
      <div class="card">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-green-600">{{ stats.products }}</h3>
          <p class="text-gray-600">Productos</p>
        </div>
      </div>
      
      <div class="card">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-purple-600">{{ stats.sales }}</h3>
          <p class="text-gray-600">Ventas</p>
        </div>
      </div>
      
      <div class="card">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-orange-600">{{ stats.lowStock }}</h3>
          <p class="text-gray-600">Bajo Stock</p>
        </div>
      </div>
    </div>

    <!-- Acciones rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Acciones Rápidas</h3>
        </div>
        <div class="space-y-3">
          <router-link to="/clients" class="btn btn-primary w-full">
            Gestionar Clientes
          </router-link>
          <router-link to="/products" class="btn btn-success w-full">
            Gestionar Productos
          </router-link>
          <router-link to="/sales" class="btn btn-secondary w-full">
            Registrar Venta
          </router-link>
        </div>
      </div>

      <!-- Productos con bajo stock -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Productos con Bajo Stock</h3>
        </div>
        <div v-if="lowStockProducts.length > 0">
          <div v-for="product in lowStockProducts.slice(0, 5)" :key="product.id" class="mb-3 p-3 bg-red-50 border-l-4 border-red-400">
            <h4 class="font-semibold">{{ product.name }}</h4>
            <p class="text-sm text-gray-600">Stock: {{ product.stock }}</p>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-4">
          No hay productos con bajo stock
        </div>
      </div>

      <!-- Últimas ventas -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Últimas Ventas</h3>
        </div>
        <div v-if="recentSales.length > 0">
          <div v-for="sale in recentSales.slice(0, 5)" :key="sale.id" class="mb-3 p-3 bg-blue-50 border-l-4 border-blue-400">
            <h4 class="font-semibold">Venta #{{ sale.id }}</h4>
            <p class="text-sm text-gray-600">Total: ${{ sale.total.toFixed(2) }}</p>
            <p class="text-sm text-gray-600">{{ formatDate(sale.date) }}</p>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-4">
          No hay ventas recientes
        </div>
      </div>
    </div>

    <!-- Estado de la API -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Estado del Sistema</h3>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <div :class="apiStatus ? 'bg-green-500' : 'bg-red-500'" class="w-3 h-3 rounded-full mr-2"></div>
          <span>{{ apiStatus ? 'API Conectada' : 'API Desconectada' }}</span>
        </div>
        <button @click="checkApiStatus" class="btn btn-secondary">
          Verificar Conexión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { clientService } from '@/services/clientService'
import { productService } from '@/services/productService'
import { saleService } from '@/services/saleService'
import api from '@/services/api'
import { formatDate } from '@/utils/helpers'

// Estado reactivo
const stats = ref({
  clients: 0,
  products: 0,
  sales: 0,
  lowStock: 0
})

const lowStockProducts = ref([])
const recentSales = ref([])
const apiStatus = ref(false)

// Cargar estadísticas
const loadStats = async () => {
  try {
    // Cargar clientes
    const clientsResponse = await clientService.getAll()
    if (clientsResponse.success) {
      stats.value.clients = clientsResponse.data.length
    }

    // Cargar productos
    const productsResponse = await productService.getAll()
    if (productsResponse.success) {
      stats.value.products = productsResponse.data.length
    }

    // Cargar productos con bajo stock
    const lowStockResponse = await productService.getLowStock()
    if (lowStockResponse.success) {
      lowStockProducts.value = lowStockResponse.data
      stats.value.lowStock = lowStockResponse.data.length
    }

    // Cargar ventas
    const salesResponse = await saleService.getAll()
    if (salesResponse.success) {
      stats.value.sales = salesResponse.data.length
      recentSales.value = salesResponse.data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
}

// Verificar estado de la API
const checkApiStatus = async () => {
  try {
    await api.get('/health')
    apiStatus.value = true
  } catch (error) {
    apiStatus.value = false
  }
}



// Cargar datos al montar el componente
onMounted(() => {
  loadStats()
  checkApiStatus()
})
</script>
