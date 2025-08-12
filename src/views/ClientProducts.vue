<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Productos del Cliente</h1>
        <p class="text-muted mb-0" v-if="client">
          Productos comprados por: <strong>{{ client.name }}</strong>
        </p>
      </div>
      <div class="d-flex gap-2">
        <router-link :to="`/clients/${clientId}/edit`" class="btn btn-outline-primary">
          <i class="fas fa-edit me-2"></i>Editar Cliente
        </router-link>
        <router-link to="/clients" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i>Volver a Clientes
        </router-link>
      </div>
    </div>

    <!-- Información del cliente -->
    <div v-if="client" class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h5 class="card-title">
              <i class="fas fa-user me-2 text-primary"></i>Información del Cliente
            </h5>
            <div class="mt-3">
              <p class="mb-1"><strong>Nombre:</strong> {{ client.name }}</p>
              <p class="mb-1"><strong>Email:</strong> <a :href="`mailto:${client.email}`">{{ client.email }}</a></p>
              <p class="mb-0"><strong>Teléfono:</strong> <a :href="`tel:${client.phone}`">{{ client.phone }}</a></p>
            </div>
          </div>
          <div class="col-md-6">
            <h5 class="card-title">
              <i class="fas fa-chart-bar me-2 text-success"></i>Resumen de Compras
            </h5>
            <div class="mt-3">
              <p class="mb-1"><strong>Total de ventas:</strong> {{ sales.length }}</p>
              <p class="mb-1"><strong>Total gastado:</strong> <span class="text-success fw-bold">${{ totalSpent.toFixed(2) }}</span></p>
              <p class="mb-0"><strong>Última compra:</strong> {{ lastPurchaseDate || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de productos comprados -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-transparent border-bottom">
        <h5 class="card-title mb-0">
          <i class="fas fa-shopping-bag me-2 text-primary"></i>Productos Comprados
        </h5>
      </div>
      
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando productos...</p>
        </div>
        
        <div v-else-if="error" class="text-center py-5">
          <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h5 class="text-warning">{{ error }}</h5>
          <button @click="loadClientProducts" class="btn btn-primary mt-3">
            <i class="fas fa-redo me-2"></i>Reintentar
          </button>
        </div>
        
                 <div v-else-if="clientProducts.length === 0" class="text-center py-5">
           <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
           <h5 class="text-muted">No hay productos comprados</h5>
           <p class="text-muted">Este cliente aún no ha realizado ninguna compra</p>
           <div class="mt-3">
             <small class="text-muted">
               Ventas encontradas: {{ sales.length }} | 
               Productos cargados: {{ products.length }}
             </small>
           </div>
         </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col" class="border-0">Producto</th>
                <th scope="col" class="border-0">Cantidad</th>
                <th scope="col" class="border-0">Precio Unitario</th>
                <th scope="col" class="border-0">Total</th>
                <th scope="col" class="border-0">Fecha de Compra</th>
                <th scope="col" class="border-0">Venta #</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in clientProducts" :key="`${item.saleId}-${item.productId}`">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-3">
                      <div class="avatar-title bg-success bg-opacity-10 rounded-circle">
                        <i class="fas fa-box text-success"></i>
                      </div>
                    </div>
                    <div>
                      <h6 class="mb-0">{{ item.productName }}</h6>
                      <small class="text-muted">ID: {{ item.productId }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge bg-info">{{ item.quantity }}</span>
                </td>
                <td>
                  <span class="fw-bold">${{ item.unitPrice.toFixed(2) }}</span>
                </td>
                                 <td>
                   <span class="fw-bold text-success">${{ item.subtotal.toFixed(2) }}</span>
                 </td>
                <td>
                  <div>
                    <div class="fw-bold">{{ formatDate(item.saleDate) }}</div>
                    <small class="text-muted">{{ new Date(item.saleDate).toLocaleTimeString() }}</small>
                  </div>
                </td>
                <td>
                  <router-link :to="`/sales/${item.saleId}`" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-eye me-1"></i>{{ item.saleId }}
                  </router-link>
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
              Mostrando {{ clientProducts.length }} producto{{ clientProducts.length !== 1 ? 's' : '' }} comprado{{ clientProducts.length !== 1 ? 's' : '' }}
            </small>
          </div>
          <div class="col-md-6 text-md-end">
            <small class="text-muted">
              Total: ${{ totalSpent.toFixed(2) }} | Última actualización: {{ new Date().toLocaleTimeString() }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { clientService, type Client } from '@/services/clientService'
import { saleService, type Sale } from '@/services/saleService'
import { productService, type Product } from '@/services/productService'
import { formatDate } from '@/utils/helpers'
import { showErrorMessage } from '@/utils/errorHandler'

const route = useRoute()

// Estado reactivo
const client = ref<Client | null>(null)
const sales = ref<Sale[]>([])
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')

const clientId = computed(() => parseInt(route.params.id as string))

// Productos del cliente con información completa
const clientProducts = computed(() => {
  if (!sales.value || !Array.isArray(sales.value)) {
    return []
  }
  
  const productsList: Array<{
    productId: number
    productName: string
    quantity: number
    unitPrice: number
    saleId: number
    saleDate: string
    subtotal: number
  }> = []

  sales.value.forEach(sale => {
    // Manejar la estructura del endpoint with-products
    if (sale.products && Array.isArray(sale.products)) {
      sale.products.forEach(productItem => {
        productsList.push({
          productId: productItem.productId,
          productName: productItem.product.name,
          quantity: productItem.quantity,
          unitPrice: productItem.unitPrice,
          saleId: sale.id,
          saleDate: sale.date,
          subtotal: productItem.subtotal
        })
      })
    }
    // Manejar la estructura del endpoint básico (fallback)
    else if (sale.saleProducts && Array.isArray(sale.saleProducts)) {
      sale.saleProducts.forEach(saleProduct => {
        let productName = `Producto #${saleProduct.productId}`
        
        if (saleProduct.product?.name) {
          productName = saleProduct.product.name
        } else if (products.value.length > 0) {
          const product = products.value.find(p => p.id === saleProduct.productId)
          productName = product ? product.name : `Producto #${saleProduct.productId}`
        }
        
        const subtotal = saleProduct.quantity * saleProduct.unitPrice
        
        productsList.push({
          productId: saleProduct.productId,
          productName: productName,
          quantity: saleProduct.quantity,
          unitPrice: saleProduct.unitPrice,
          saleId: sale.id,
          saleDate: sale.date,
          subtotal: subtotal
        })
      })
    }
  })

  return productsList.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
})

// Total gastado por el cliente
const totalSpent = computed(() => {
  return sales.value.reduce((total, sale) => total + sale.total, 0)
})

// Fecha de la última compra
const lastPurchaseDate = computed(() => {
  if (sales.value.length === 0) return null
  const sortedSales = [...sales.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return formatDate(sortedSales[0].date)
})

// Cargar datos del cliente y sus ventas
const loadClientProducts = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Cargar ventas del cliente con productos detallados
    const salesResponse = await saleService.getByClientWithProducts(clientId.value)
    sales.value = (salesResponse as any).data || salesResponse
    
    // Usar la información del cliente que viene en la primera venta
    if (sales.value && sales.value.length > 0 && sales.value[0].client) {
      client.value = sales.value[0].client
    } else {
      // Si no hay ventas o no viene la información del cliente, cargarla por separado
      const clientResponse = await clientService.getById(clientId.value)
      client.value = (clientResponse as any).data || clientResponse
    }
    
  } catch (err) {
    error.value = 'Error al cargar los datos del cliente. Verifique que el ID sea válido.'
    showErrorMessage('Error al cargar los productos del cliente', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadClientProducts()
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
