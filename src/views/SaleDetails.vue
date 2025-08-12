<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Detalles de Venta</h1>
        <p class="text-muted mb-0">Venta #{{ saleId }}</p>
      </div>
      <div class="d-flex gap-2">
        <router-link to="/sales" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i>Volver a Ventas
        </router-link>
      </div>
    </div>

    <!-- Información de la venta -->
    <div v-if="sale" class="card border-0 shadow-sm mb-4">
      <div class="card-header bg-transparent border-bottom">
        <h5 class="card-title mb-0">
          <i class="fas fa-receipt me-2 text-primary"></i>Información de la Venta
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Datos de la Venta</h6>
            <p class="mb-1"><strong>ID de Venta:</strong> #{{ sale.id }}</p>
            <p class="mb-1"><strong>Fecha:</strong> {{ formatDate(sale.date) }}</p>
            <p class="mb-1"><strong>Hora:</strong> {{ new Date(sale.date).toLocaleTimeString() }}</p>
            <p class="mb-0"><strong>Total:</strong> <span class="text-success fw-bold fs-5">${{ sale.total.toFixed(2) }}</span></p>
          </div>
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Información del Cliente</h6>
            <p class="mb-1"><strong>Nombre:</strong> {{ client?.name || 'Cliente no encontrado' }}</p>
            <p class="mb-1"><strong>Email:</strong> <a :href="`mailto:${client?.email}`">{{ client?.email || 'N/A' }}</a></p>
            <p class="mb-0"><strong>Teléfono:</strong> <a :href="`tel:${client?.phone}`">{{ client?.phone || 'N/A' }}</a></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de productos -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-transparent border-bottom">
        <h5 class="card-title mb-0">
          <i class="fas fa-shopping-cart me-2 text-primary"></i>Productos de la Venta
        </h5>
      </div>
      
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando detalles de la venta...</p>
        </div>
        
        <div v-else-if="error" class="text-center py-5">
          <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h5 class="text-warning">{{ error }}</h5>
          <button @click="loadSaleDetails" class="btn btn-primary mt-3">
            <i class="fas fa-redo me-2"></i>Reintentar
          </button>
        </div>
        
        <div v-else-if="!sale" class="text-center py-5">
          <i class="fas fa-search fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Venta no encontrada</h5>
          <p class="text-muted">La venta con ID #{{ saleId }} no existe</p>
        </div>
        
                 <div v-else-if="(sale.products?.length || sale.saleProducts?.length || 0) === 0" class="text-center py-5">
          <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No hay productos en esta venta</h5>
          <p class="text-muted">Esta venta no contiene ningún producto</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col" class="border-0">Producto</th>
                <th scope="col" class="border-0">Cantidad</th>
                <th scope="col" class="border-0">Precio Unitario</th>
                <th scope="col" class="border-0">Subtotal</th>
                <th scope="col" class="border-0">Acciones</th>
              </tr>
            </thead>
                         <tbody>
               <tr v-for="saleProduct in (sale.products || sale.saleProducts)" :key="`${sale.id}-${saleProduct.productId}`">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-3">
                      <div class="avatar-title bg-success bg-opacity-10 rounded-circle">
                        <i class="fas fa-box text-success"></i>
                      </div>
                    </div>
                    <div>
                      <h6 class="mb-0">{{ saleProduct.product?.name || `Producto #${saleProduct.productId}` }}</h6>
                      <small class="text-muted">{{ saleProduct.product?.description || 'Sin descripción' }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge bg-info fs-6">{{ saleProduct.quantity }}</span>
                </td>
                <td>
                  <span class="fw-bold">${{ saleProduct.unitPrice.toFixed(2) }}</span>
                </td>
                <td>
                  <span class="fw-bold text-success">${{ (saleProduct.quantity * saleProduct.unitPrice).toFixed(2) }}</span>
                </td>
                <td>
                  <router-link :to="`/products/${saleProduct.productId}/edit`" class="btn btn-sm btn-outline-primary" title="Ver producto">
                    <i class="fas fa-eye"></i>
                  </router-link>
                </td>
              </tr>
            </tbody>
            <tfoot class="table-light">
              <tr>
                <td colspan="3" class="text-end fw-bold">Total de la Venta:</td>
                <td class="fw-bold text-success fs-5">${{ sale.total.toFixed(2) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Resumen de la venta -->
    <div class="card border-0 shadow-sm mt-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <div class="text-center">
              <h6 class="text-muted mb-2">Total de Productos</h6>
                             <h3 class="text-primary">{{ (sale?.products?.length || sale?.saleProducts?.length || 0) }}</h3>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center">
              <h6 class="text-muted mb-2">Cantidad Total</h6>
              <h3 class="text-info">{{ totalQuantity }}</h3>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center">
              <h6 class="text-muted mb-2">Valor Total</h6>
              <h3 class="text-success">${{ sale?.total.toFixed(2) || '0.00' }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { saleService, type Sale } from '@/services/saleService'
import { clientService, type Client } from '@/services/clientService'
import { formatDate } from '@/utils/helpers'
import { showErrorMessage } from '@/utils/errorHandler'

const route = useRoute()

// Estado reactivo
const sale = ref<Sale | null>(null)
const client = ref<Client | null>(null)
const loading = ref(true)
const error = ref('')

const saleId = computed(() => parseInt(route.params.id as string))

// Cantidad total de productos
const totalQuantity = computed(() => {
  const products = sale.value?.products || sale.value?.saleProducts
  if (!products) return 0
  return products.reduce((total, product) => total + product.quantity, 0)
})

// Cargar detalles de la venta
const loadSaleDetails = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Cargar venta con detalles completos
    const saleResponse = await saleService.getByIdWithDetails(saleId.value)
    sale.value = (saleResponse as any).data || saleResponse
    
    // Si la venta tiene información del cliente, cargarla
    if (sale.value?.clientId) {
      const clientResponse = await clientService.getById(sale.value.clientId)
      client.value = (clientResponse as any).data || clientResponse
    }
    
  } catch (err) {
    error.value = 'Error al cargar los detalles de la venta. Verifique que el ID sea válido.'
    showErrorMessage('Error al cargar los detalles de la venta', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSaleDetails()
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

.table tfoot {
  border-top: 2px solid #dee2e6;
}

.table tfoot td {
  font-weight: 600;
}
</style>
