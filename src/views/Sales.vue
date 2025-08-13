<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Gestión de Ventas</h1>
        <p class="text-muted mb-0">Administra las ventas del sistema</p>
      </div>
      <router-link to="/sales/create" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i>Nueva Venta
      </router-link>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Fecha desde</label>
            <input 
              v-model="filters.startDate" 
              type="date" 
              class="form-control"
              @change="filterSales"
            >
          </div>
          <div class="col-md-4">
            <label class="form-label">Fecha hasta</label>
            <input 
              v-model="filters.endDate" 
              type="date" 
              class="form-control"
              @change="filterSales"
            >
          </div>
          <div class="col-md-4">
            <label class="form-label">&nbsp;</label>
            <div class="d-flex gap-2">
              <button @click="loadSales" class="btn btn-outline-secondary flex-fill">
                <i class="fas fa-sync-alt me-2"></i>Recargar
              </button>
              <button @click="clearFilters" class="btn btn-outline-info">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de ventas -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-transparent border-bottom">
        <h5 class="card-title mb-0">
          <i class="fas fa-shopping-cart me-2 text-primary"></i>Lista de Ventas
        </h5>
      </div>
      
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando ventas...</p>
        </div>
        
        <div v-else-if="(sales as any)?.length === 0" class="text-center py-5">
          <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No hay ventas registradas</h5>
          <p class="text-muted">Comienza agregando tu primera venta</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col" class="border-0">ID</th>
                <th scope="col" class="border-0">Cliente</th>
                <th scope="col" class="border-0">Fecha</th>
                <th scope="col" class="border-0">Productos</th>
                <th scope="col" class="border-0">Total</th>
                <th scope="col" class="border-0 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in sales" :key="sale.id">
                <td>
                  <span class="badge bg-secondary">{{ sale.id }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-3">
                      <div class="avatar-title bg-info bg-opacity-10 rounded-circle">
                        <i class="fas fa-user text-info"></i>
                      </div>
                    </div>
                    <div>
                      <h6 class="mb-0">{{ getClientInfo(sale)?.name || 'Cliente no disponible' }}</h6>
                      <small class="text-muted">{{ getClientInfo(sale)?.email || 'Email no disponible' }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div class="fw-medium">{{ formatDate(sale.date) }}</div>
                    <small class="text-muted">{{ formatTime(sale.date) }}</small>
                  </div>
                </td>
                <td>
                  <div>
                    <span class="badge bg-light text-dark me-1">
                      {{ getProductCount(sale) }} productos
                    </span>
                    <small class="text-muted d-block">
                      {{ getTotalItems(sale) }} unidades
                    </small>
                  </div>
                </td>
                <td>
                  <div class="fw-bold text-success">
                    ${{ formatCurrency(sale.total) }}
                  </div>
                </td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <router-link :to="`/sales/${sale.id}`" class="btn btn-sm btn-outline-info" title="Ver detalles">
                      <i class="fas fa-eye"></i>
                    </router-link>
                    <button @click="deleteSale(sale.id)" class="btn btn-sm btn-outline-danger" title="Eliminar">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Footer con estadísticas -->
      <div class="card-footer bg-transparent border-top">
        <div class="row align-items-center">
          <div class="col-md-6">
            <small class="text-muted">
              Mostrando {{ (sales as any)?.length || 0 }} venta{{ ((sales as any)?.length || 0) !== 1 ? 's' : '' }}
            </small>
          </div>
          <div class="col-md-6 text-md-end">
            <small class="text-muted">
              Total: ${{ formatCurrency(getTotalSales()) }} | 
              Última actualización: {{ new Date().toLocaleTimeString() }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { saleService, type Sale } from '@/services/saleService'

// Estado reactivo
const sales = ref<Sale[]>([])
const loading = ref(false)
const filters = ref({
  startDate: '',
  endDate: ''
})

// Cargar ventas con productos y clientes
const loadSales = async () => {
  loading.value = true
  try {
    // Cargar ventas con productos usando el método que funciona
    const response = await saleService.getAllSalesWithProducts()
    sales.value = (response as any).data || response
  } catch (error) {
    console.error('Error al cargar ventas:', error)
  } finally {
    loading.value = false
  }
}

// Filtrar ventas por fecha
const filterSales = async () => {
  if (!filters.value.startDate && !filters.value.endDate) {
    await loadSales()
    return
  }
  
  loading.value = true
  try {
    const startDate = filters.value.startDate || new Date(0).toISOString().split('T')[0]
    const endDate = filters.value.endDate || new Date().toISOString().split('T')[0]
    
    // Cargar todas las ventas con productos
    const response = await saleService.getAllSalesWithProducts()
    const allSales = (response as any).data || response
    
    // Filtrar por fecha en el frontend
    sales.value = allSales.filter((sale: Sale) => {
      const saleDate = new Date(sale.date).toISOString().split('T')[0]
      return saleDate >= startDate && saleDate <= endDate
    })
  } catch (error) {
    console.error('Error al filtrar ventas:', error)
  } finally {
    loading.value = false
  }
}

// Limpiar filtros
const clearFilters = () => {
  filters.value.startDate = ''
  filters.value.endDate = ''
  loadSales()
}

// Eliminar venta
const deleteSale = async (id: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
    return
  }
  
  try {
    await saleService.delete(id)
    await loadSales()
  } catch (error) {
    console.error('Error al eliminar venta:', error)
  }
}

// Formatear fecha
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Formatear hora
const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear moneda
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Obtener información del cliente para una venta
const getClientInfo = (sale: Sale) => {
  return sale.client || null
}

// Obtener productos de una venta
const getSaleProducts = (sale: Sale) => {
  return sale.products || sale.saleProducts || []
}

// Obtener total de items en una venta
const getTotalItems = (sale: Sale): number => {
  const saleProducts = getSaleProducts(sale)
  return saleProducts.reduce((total, item) => total + (item.quantity || 0), 0)
}

// Obtener cantidad de productos en una venta
const getProductCount = (sale: Sale): number => {
  const saleProducts = getSaleProducts(sale)
  return saleProducts.length
}

// Obtener total de todas las ventas
const getTotalSales = (): number => {
  return sales.value.reduce((total, sale) => total + sale.total, 0)
}

onMounted(() => {
  loadSales()
})
</script>

<style scoped>
.avatar-sm {
  width: 40px;
  height: 40px;
}

.avatar-title {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.table th {
  font-weight: 600;
  color: #495057;
}

.table td {
  vertical-align: middle;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.card {
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.badge {
  font-size: 0.75rem;
}

.text-success {
  color: #198754 !important;
}
</style>
