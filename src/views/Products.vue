<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Gestión de Productos</h1>
        <p class="text-muted mb-0">Administra los productos del sistema</p>
      </div>
      <router-link to="/products/create" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i>Nuevo Producto
      </router-link>
    </div>

    <!-- Búsqueda y filtros -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input 
                v-model="searchTerm" 
                @input="searchProducts"
                type="text" 
                class="form-control"
                placeholder="Buscar productos por nombre..." 
              >
            </div>
          </div>
          <div class="col-md-3">
            <button @click="loadProducts" class="btn btn-outline-secondary w-100">
              <i class="fas fa-sync-alt me-2"></i>Recargar
            </button>
          </div>
          <div class="col-md-3">
            <button @click="showLowStock" class="btn btn-outline-warning w-100">
              <i class="fas fa-exclamation-triangle me-2"></i>Bajo Stock
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-transparent border-bottom">
        <h5 class="card-title mb-0">
          <i class="fas fa-box me-2 text-primary"></i>Lista de Productos
        </h5>
      </div>
      
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando productos...</p>
        </div>
        
        <div v-else-if="(products as any)?.length === 0" class="text-center py-5">
          <i class="fas fa-box fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No hay productos registrados</h5>
          <p class="text-muted">Comienza agregando tu primer producto</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col" class="border-0">ID</th>
                <th scope="col" class="border-0">Producto</th>
                <th scope="col" class="border-0">Precio</th>
                <th scope="col" class="border-0">Stock</th>
                <th scope="col" class="border-0">Estado</th>
                <th scope="col" class="border-0 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>
                  <span class="badge bg-secondary">{{ product.id }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-3">
                      <div class="avatar-title bg-success bg-opacity-10 rounded-circle">
                        <i class="fas fa-box text-success"></i>
                      </div>
                    </div>
                    <div>
                      <h6 class="mb-0">{{ product.name }}</h6>
                      <small class="text-muted">{{ product.description || 'Sin descripción' }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="fw-bold text-success">${{ product.price.toFixed(2) }}</span>
                </td>
                <td>
                  <span :class="getStockInfo(product.stock).textClass">
                    {{ product.stock }}
                  </span>
                </td>
                <td>
                  <span :class="getStockInfo(product.stock).badgeClass">
                    {{ getStockInfo(product.stock).status }}
                  </span>
                </td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <router-link :to="`/products/${product.id}/edit`" class="btn btn-sm btn-outline-primary">
                      <i class="fas fa-edit"></i>
                    </router-link>
                    <button @click="deleteProduct(product.id)" class="btn btn-sm btn-outline-danger">
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
              Mostrando {{ (products as any)?.length || 0 }} producto{{ ((products as any)?.length || 0) !== 1 ? 's' : '' }}
            </small>
          </div>
          <div class="col-md-6 text-md-end">
            <small class="text-muted">
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
import { productService, type Product } from '@/services/productService'

// Estado reactivo
const products = ref<Product[]>([])
const loading = ref(false)
const searchTerm = ref('')

// Cargar productos
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await productService.getAll()
    products.value = (response as any).data || response
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    loading.value = false
  }
}

// Buscar productos
const searchProducts = async () => {
  if (searchTerm.value.trim() === '') {
    await loadProducts()
    return
  }
  
  loading.value = true
  try {
    const response = await productService.searchByName(searchTerm.value)
    products.value = (response as any).data || response
  } catch (error) {
    console.error('Error al buscar productos:', error)
  } finally {
    loading.value = false
  }
}

// Mostrar productos con bajo stock
const showLowStock = async () => {
  loading.value = true
  try {
    const response = await productService.getLowStock()
    products.value = (response as any).data || response
  } catch (error) {
    console.error('Error al cargar productos con bajo stock:', error)
  } finally {
    loading.value = false
  }
}

// Eliminar producto
const deleteProduct = async (id: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    return
  }
  
  try {
    await productService.delete(id)
    await loadProducts()
  } catch (error) {
    console.error('Error al eliminar producto:', error)
  }
}

// Obtener información del stock
const getStockInfo = (stock: number) => {
  if (stock === 0) {
    return {
      status: 'Agotado',
      textClass: 'text-danger fw-bold',
      badgeClass: 'badge bg-danger'
    }
  } else if (stock <= 5) {
    return {
      status: 'Bajo Stock',
      textClass: 'text-warning fw-bold',
      badgeClass: 'badge bg-warning text-dark'
    }
  } else {
    return {
      status: 'Disponible',
      textClass: 'text-success fw-bold',
      badgeClass: 'badge bg-success'
    }
  }
}

onMounted(() => {
  loadProducts()
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

