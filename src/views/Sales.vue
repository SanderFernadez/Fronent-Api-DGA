<template>
  <div>
    <div class="card-header">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="card-title">Gestión de Ventas</h1>
          <p class="text-gray-600">Registra y administra las ventas del sistema</p>
        </div>
        <router-link to="/sales/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Nueva Venta
        </router-link>
      </div>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="form-label">Fecha Inicio</label>
          <input 
            v-model="filters.startDate" 
            type="date" 
            class="form-input"
          >
        </div>
        <div>
          <label class="form-label">Fecha Fin</label>
          <input 
            v-model="filters.endDate" 
            type="date" 
            class="form-input"
          >
        </div>
        <div class="flex items-end space-x-2">
          <button @click="loadSales" class="btn btn-secondary">
            Buscar
          </button>
          <button @click="clearFilters" class="btn btn-secondary">
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de ventas -->
    <div class="card">
      <div v-if="loading" class="text-center py-8">
        <p>Cargando ventas...</p>
      </div>
      
      <div v-else-if="sales.length === 0" class="text-center py-8">
        <p class="text-gray-500">No hay ventas registradas</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in sales" :key="sale.id">
              <td>{{ sale.id }}</td>
              <td>{{ getClientName(sale.clientId) }}</td>
              <td>{{ formatDate(sale.date) }}</td>
              <td>${{ sale.total.toFixed(2) }}</td>
              <td>{{ sale.saleProducts.length }} productos</td>
              <td>
                <div class="flex space-x-2">
                  <button @click="viewSaleDetails(sale)" class="btn btn-secondary">
                    <i class="fas fa-eye"></i> Ver Detalles
                  </button>
                  <button @click="deleteSale(sale.id)" class="btn btn-danger">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { saleService, type Sale } from '@/services/saleService'
import { clientService, type Client } from '@/services/clientService'
import { productService, type Product } from '@/services/productService'
import { formatDate } from '@/utils/helpers'

// Estado reactivo
const sales = ref<Sale[]>([])
const clients = ref<Client[]>([])
const products = ref<Product[]>([])
const loading = ref(false)

// Filtros
const filters = ref({
  startDate: '',
  endDate: ''
})

// Cargar ventas
const loadSales = async () => {
  loading.value = true
  try {
    let response
    if (filters.value.startDate && filters.value.endDate) {
      response = await saleService.getReport(filters.value.startDate, filters.value.endDate)
    } else {
      response = await saleService.getAll()
    }
    
    if (response.success) {
      sales.value = response.data
    }
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
    if (response.success) {
      clients.value = response.data
    }
  } catch (error) {
    console.error('Error al cargar clientes:', error)
  }
}

// Cargar productos
const loadProducts = async () => {
  try {
    const response = await productService.getAll()
    if (response.success) {
      products.value = response.data
    }
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

// Limpiar filtros
const clearFilters = () => {
  filters.value = { startDate: '', endDate: '' }
  loadSales()
}



// Obtener nombre del cliente
const getClientName = (clientId: number): string => {
  const client = clients.value.find(c => c.id === clientId)
  return client ? client.name : 'Cliente no encontrado'
}

// Obtener nombre del producto
const getProductName = (productId: number): string => {
  const product = products.value.find(p => p.id === productId)
  return product ? product.name : 'Producto no encontrado'
}

// Ver detalles de venta
const viewSaleDetails = (sale: Sale) => {
  // Por ahora solo mostrar en consola, se puede implementar una vista separada después
  console.log('Detalles de la venta:', sale)
  alert(`Venta #${sale.id}\nCliente: ${getClientName(sale.clientId)}\nTotal: $${sale.total.toFixed(2)}`)
}





// Eliminar venta
const deleteSale = async (id: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta venta?')) return
  
  try {
    const response = await saleService.delete(id)
    if (response.success) {
      await loadSales()
    }
  } catch (error) {
    console.error('Error al eliminar venta:', error)
  }
}



// Cargar datos al montar el componente
onMounted(() => {
  loadSales()
  loadClients()
  loadProducts()
})
</script>
