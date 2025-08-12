<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Dashboard</h1>
        <p class="text-muted mb-0">Resumen general del sistema</p>
      </div>
      <div class="d-flex align-items-center">
        <div :class="apiStatus ? 'bg-success' : 'bg-danger'" class="rounded-circle me-2" style="width: 12px; height: 12px;"></div>
        <small class="text-muted">{{ apiStatus ? 'API Conectada' : 'API Desconectada' }}</small>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="row g-4 mb-4">
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style="width: 60px; height: 60px;">
              <i class="fas fa-users fa-2x text-primary"></i>
            </div>
            <h3 class="h2 fw-bold text-primary mb-1">{{ stats.clients }}</h3>
            <p class="text-muted mb-0">Clientes</p>
          </div>
        </div>
      </div>
      
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-3" style="width: 60px; height: 60px;">
              <i class="fas fa-box fa-2x text-success"></i>
            </div>
            <h3 class="h2 fw-bold text-success mb-1">{{ stats.products }}</h3>
            <p class="text-muted mb-0">Productos</p>
          </div>
        </div>
      </div>
      
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="d-inline-flex align-items-center justify-content-center bg-info bg-opacity-10 rounded-circle mb-3" style="width: 60px; height: 60px;">
              <i class="fas fa-shopping-cart fa-2x text-info"></i>
            </div>
            <h3 class="h2 fw-bold text-info mb-1">{{ stats.sales }}</h3>
            <p class="text-muted mb-0">Ventas</p>
          </div>
        </div>
      </div>
      
      <div class="col-12 col-md-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <div class="d-inline-flex align-items-center justify-content-center bg-warning bg-opacity-10 rounded-circle mb-3" style="width: 60px; height: 60px;">
              <i class="fas fa-exclamation-triangle fa-2x text-warning"></i>
            </div>
            <h3 class="h2 fw-bold text-warning mb-1">{{ stats.lowStock }}</h3>
            <p class="text-muted mb-0">Bajo Stock</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="row g-4">
      <!-- Acciones rápidas -->
      <div class="col-12 col-lg-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-header bg-transparent border-bottom">
            <h5 class="card-title mb-0">
              <i class="fas fa-bolt me-2 text-primary"></i>Acciones Rápidas
            </h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-3">
              <router-link to="/clients" class="btn btn-primary">
                <i class="fas fa-users me-2"></i>Gestionar Clientes
              </router-link>
              <router-link to="/products" class="btn btn-success">
                <i class="fas fa-box me-2"></i>Gestionar Productos
              </router-link>
              <router-link to="/sales" class="btn btn-info">
                <i class="fas fa-shopping-cart me-2"></i>Registrar Venta
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos con bajo stock -->
      <div class="col-12 col-lg-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-header bg-transparent border-bottom">
            <h5 class="card-title mb-0">
              <i class="fas fa-exclamation-triangle me-2 text-warning"></i>Bajo Stock
            </h5>
          </div>
          <div class="card-body">
            <div v-if="lowStockProducts.length > 0">
              <div v-for="product in lowStockProducts.slice(0, 5)" :key="product.id" class="alert alert-warning alert-sm mb-2">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="alert-heading mb-1">{{ product.name }}</h6>
                    <small class="text-muted">Stock: {{ product.stock }}</small>
                  </div>
                  <span class="badge bg-warning text-dark">{{ product.stock }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-muted py-4">
              <i class="fas fa-check-circle fa-2x mb-3 text-success"></i>
              <p class="mb-0">No hay productos con bajo stock</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Últimas ventas -->
      <div class="col-12 col-lg-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-header bg-transparent border-bottom">
            <h5 class="card-title mb-0">
              <i class="fas fa-chart-line me-2 text-info"></i>Últimas Ventas
            </h5>
          </div>
          <div class="card-body">
            <div v-if="recentSales.length > 0">
              <div v-for="sale in recentSales.slice(0, 5)" :key="sale.id" class="alert alert-info alert-sm mb-2">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="alert-heading mb-1">Venta #{{ sale.id }}</h6>
                    <small class="text-muted">{{ formatDate(sale.date) }}</small>
                  </div>
                  <span class="badge bg-info">${{ sale.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-muted py-4">
              <i class="fas fa-chart-bar fa-2x mb-3 text-muted"></i>
              <p class="mb-0">No hay ventas recientes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { clientService } from '@/services/clientService'
import { productService } from '@/services/productService'
import { saleService } from '@/services/saleService'
import { formatDate } from '@/utils/helpers'
import api from '@/services/api'

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
    const [clients, products, sales, lowStock] = await Promise.all([
      clientService.getAll(),
      productService.getAll(),
      saleService.getAll(),
      productService.getLowStock()
    ])

    stats.value = {
      clients: clients.length,
      products: products.length,
      sales: sales.length,
      lowStock: lowStock.length
    }

    lowStockProducts.value = lowStock
    recentSales.value = sales.slice(0, 5)
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

onMounted(() => {
  loadStats()
  checkApiStatus()
})
</script>

<style scoped>
.alert-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.alert-sm .alert-heading {
  font-size: 0.875rem;
  font-weight: 600;
}

.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

.bg-opacity-10 {
  background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
}

.text-primary {
  color: var(--bs-primary) !important;
}

.text-success {
  color: var(--bs-success) !important;
}

.text-info {
  color: var(--bs-info) !important;
}

.text-warning {
  color: var(--bs-warning) !important;
}
</style>
