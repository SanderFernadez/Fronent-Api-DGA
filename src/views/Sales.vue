<template>
  <div>
    <div class="card-header">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="card-title">Gestión de Ventas</h1>
          <p class="text-gray-600">Registra y administra las ventas del sistema</p>
        </div>
        <button @click="showForm = true" class="btn btn-primary">
          Nueva Venta
        </button>
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
                    Ver Detalles
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

    <!-- Modal de nueva venta -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Nueva Venta</h3>
        
        <form @submit.prevent="saveSale">
          <!-- Selección de cliente -->
          <div class="form-group">
            <label class="form-label">Cliente *</label>
            <select 
              v-model="form.clientId" 
              required 
              class="form-input"
              :class="{ error: errors.clientId }"
            >
              <option value="">Seleccionar cliente</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }} - {{ client.email }}
              </option>
            </select>
            <span v-if="errors.clientId" class="error-message">{{ errors.clientId }}</span>
          </div>
          
          <!-- Fecha de venta -->
          <div class="form-group">
            <label class="form-label">Fecha de Venta *</label>
            <input 
              v-model="form.date" 
              type="datetime-local" 
              required 
              class="form-input"
              :class="{ error: errors.date }"
            >
            <span v-if="errors.date" class="error-message">{{ errors.date }}</span>
          </div>
          
          <!-- Productos de la venta -->
          <div class="form-group">
            <label class="form-label">Productos *</label>
            <div v-for="(item, index) in form.saleProducts" :key="index" class="border p-4 mb-4 rounded">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="form-label">Producto</label>
                  <select 
                    v-model="item.productId" 
                    @change="updateProductPrice(index)"
                    required 
                    class="form-input"
                  >
                    <option value="">Seleccionar producto</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }} - Stock: {{ product.stock }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="form-label">Cantidad</label>
                  <input 
                    v-model="item.quantity" 
                    type="number" 
                    min="1" 
                    required 
                    class="form-input"
                    @input="updateProductPrice(index)"
                  >
                </div>
                <div>
                  <label class="form-label">Precio Unitario</label>
                  <input 
                    v-model="item.unitPrice" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required 
                    class="form-input"
                    readonly
                  >
                </div>
                <div class="flex items-end">
                  <button 
                    @click="removeProduct(index)" 
                    type="button" 
                    class="btn btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              @click="addProduct" 
              type="button" 
              class="btn btn-secondary"
            >
              Agregar Producto
            </button>
          </div>
          
          <!-- Total de la venta -->
          <div class="form-group">
            <label class="form-label">Total de la Venta</label>
            <input 
              :value="totalComputed" 
              type="text" 
              readonly 
              class="form-input bg-gray-100"
            >
          </div>
          
          <div class="flex space-x-2 mt-6">
            <button type="submit" class="btn btn-primary flex-1">
              Registrar Venta
            </button>
            <button type="button" @click="closeForm" class="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de detalles de venta -->
    <div v-if="showDetails" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 class="text-lg font-semibold mb-4">Detalles de la Venta #{{ selectedSale?.id }}</h3>
        
        <div v-if="selectedSale" class="space-y-4">
          <div>
            <strong>Cliente:</strong> {{ getClientName(selectedSale.clientId) }}
          </div>
          <div>
            <strong>Fecha:</strong> {{ formatDate(selectedSale.date) }}
          </div>
          <div>
            <strong>Total:</strong> ${{ selectedSale.total.toFixed(2) }}
          </div>
          
          <div>
            <strong>Productos:</strong>
            <table class="table mt-2">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedSale.saleProducts" :key="item.productId">
                  <td>{{ getProductName(item.productId) }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ item.unitPrice.toFixed(2) }}</td>
                  <td>${{ (item.quantity * item.unitPrice).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button @click="closeDetails" class="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { saleService, type Sale, type CreateSaleRequest, type SaleProduct } from '@/services/saleService'
import { clientService, type Client } from '@/services/clientService'
import { productService, type Product } from '@/services/productService'
import { formatDate, calculateTotal } from '@/utils/helpers'
import { validateForm, isFormValid, saleValidationRules } from '@/utils/validations'

// Estado reactivo
const sales = ref<Sale[]>([])
const clients = ref<Client[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const showForm = ref(false)
const showDetails = ref(false)
const selectedSale = ref<Sale | null>(null)

// Filtros
const filters = ref({
  startDate: '',
  endDate: ''
})

// Formulario
const form = ref<CreateSaleRequest>({
  clientId: 0,
  date: new Date().toISOString().slice(0, 16),
  saleProducts: []
})

// Errores de validación
const errors = ref<Record<string, string>>({})

// Total calculado
const totalComputed = computed(() => {
  return calculateTotal(form.value.saleProducts).toFixed(2)
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

// Agregar producto al formulario
const addProduct = () => {
  form.value.saleProducts.push({
    productId: 0,
    quantity: 1,
    unitPrice: 0
  })
}

// Remover producto del formulario
const removeProduct = (index: number) => {
  form.value.saleProducts.splice(index, 1)
}

// Actualizar precio del producto
const updateProductPrice = (index: number) => {
  const item = form.value.saleProducts[index]
  const product = products.value.find(p => p.id === item.productId)
  if (product) {
    item.unitPrice = product.price
  }
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



// Validar formulario
const validateFormData = (): boolean => {
  errors.value = validateForm(form.value, saleValidationRules)
  return isFormValid(errors.value)
}

// Guardar venta
const saveSale = async () => {
  if (!validateFormData()) return
  
  try {
    const response = await saleService.create(form.value)
    if (response.success) {
      await loadSales()
      closeForm()
    }
  } catch (error) {
    console.error('Error al guardar venta:', error)
  }
}

// Ver detalles de venta
const viewSaleDetails = (sale: Sale) => {
  selectedSale.value = sale
  showDetails.value = true
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

// Cerrar formulario
const closeForm = () => {
  showForm.value = false
  form.value = {
    clientId: 0,
    date: new Date().toISOString().slice(0, 16),
    saleProducts: []
  }
  errors.value = {}
}

// Cerrar detalles
const closeDetails = () => {
  showDetails.value = false
  selectedSale.value = null
}

// Cargar datos al montar el componente
onMounted(() => {
  loadSales()
  loadClients()
  loadProducts()
})
</script>
