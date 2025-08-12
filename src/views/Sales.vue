<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Gestión de Ventas</h1>
        <p class="text-muted mb-0">Registra y administra las ventas del sistema</p>
      </div>
      <router-link to="/sales/create" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i>Nueva Venta
      </router-link>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-header bg-transparent border-bottom">
        <h5 class="card-title mb-0">
          <i class="fas fa-filter me-2 text-primary"></i>Filtros de Búsqueda
        </h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Fecha Inicio</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-calendar"></i>
              </span>
              <input 
                v-model="filters.startDate" 
                type="date" 
                class="form-control"
              >
            </div>
          </div>
          <div class="col-md-4">
            <label class="form-label">Fecha Fin</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-calendar"></i>
              </span>
              <input 
                v-model="filters.endDate" 
                type="date" 
                class="form-control"
              >
            </div>
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <div class="d-flex gap-2 w-100">
              <button @click="loadSales" class="btn btn-primary flex-fill">
                <i class="fas fa-search me-2"></i>Buscar
              </button>
              <button @click="clearFilters" class="btn btn-outline-secondary">
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
          <i class="fas fa-shopping-cart me-2 text-primary"></i>Historial de Ventas
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
          <p class="text-muted">Comienza registrando tu primera venta</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col" class="border-0">ID</th>
                <th scope="col" class="border-0">Cliente</th>
                <th scope="col" class="border-0">Fecha</th>
                <th scope="col" class="border-0">Total</th>
                <th scope="col" class="border-0">Productos</th>
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
                      <div class="avatar-title bg-primary bg-opacity-10 rounded-circle">
                        <i class="fas fa-user text-primary"></i>
                      </div>
                    </div>
                    <div>
                      <h6 class="mb-0">{{ getClientName(sale.clientId) }}</h6>
                      <small class="text-muted">Cliente</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div class="fw-bold">{{ formatDate(sale.date) }}</div>
                    <small class="text-muted">{{ new Date(sale.date).toLocaleTimeString() }}</small>
                  </div>
                </td>
                <td>
                  <span class="fw-bold text-success">${{ sale.total.toFixed(2) }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <span class="badge bg-info me-2">{{ sale.saleProducts?.length || 0 }}</span>
                    <small class="text-muted">productos</small>
                  </div>
                </td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <button @click="viewSaleDetails(sale)" class="btn btn-sm btn-outline-info">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="deleteSale(sale.id)" class="btn btn-sm btn-outline-danger">
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
              Total: ${{ totalSales.toFixed(2) }} | Última actualización: {{ new Date().toLocaleTimeString() }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { saleService, type Sale } from '@/services/saleService'
import { clientService, type Client } from '@/services/clientService'
import { formatDate } from '@/utils/helpers'

// Estado reactivo
const sales = ref<Sale[]>([])
const clients = ref<Client[]>([])
const loading = ref(false)
const filters = ref({
  startDate: '',
  endDate: ''
})

// Computed properties
const totalSales = computed(() => {
  return sales.value.reduce((total, sale) => total + sale.total, 0)
})

// Cargar ventas
const loadSales = async () => {
  loading.value = true
  try {
    const response = await saleService.getAll()
    sales.value = (response as any).data || response
  } catch (error) {
    console.error('Error al cargar ventas:', error)
  } finally {
    loading.value = false
  }
}

// Cargar clientes
const loadClients = async () => {
  try {
    const response = await clientService.getAll()
    clients.value = (response as any).data || response
  } catch (error) {
    console.error('Error al cargar clientes:', error)
  }
}

// Limpiar filtros
const clearFilters = () => {
  filters.value.startDate = ''
  filters.value.endDate = ''
  loadSales()
}

// Obtener nombre del cliente
const getClientName = (clientId: number) => {
  const client = clients.value.find(c => c.id === clientId)
  return client ? client.name : 'Cliente no encontrado'
}

// Ver detalles de la venta
const viewSaleDetails = (sale: Sale) => {
  console.log('Ver detalles de venta:', sale)
  alert(`Detalles de la venta #${sale.id}\nCliente: ${getClientName(sale.clientId)}\nTotal: $${sale.total.toFixed(2)}\nProductos: ${sale.saleProducts?.length || 0}`)
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

onMounted(() => {
  loadSales()
  loadClients()
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
</style>
