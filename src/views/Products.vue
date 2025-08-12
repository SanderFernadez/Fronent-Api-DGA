<template>
  <div>
    <div class="card-header">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="card-title">Gestión de Productos</h1>
          <p class="text-gray-600">Administra los productos del sistema</p>
        </div>
        <router-link to="/products/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Nuevo Producto
        </router-link>
      </div>
    </div>

    <!-- Búsqueda y filtros -->
    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input 
            v-model="searchTerm" 
            @input="searchProducts"
            type="text" 
            placeholder="Buscar productos por nombre..." 
            class="form-input"
          >
        </div>
        <button @click="loadProducts" class="btn btn-secondary">
          Recargar
        </button>
        <button @click="showLowStock" class="btn btn-danger">
          Bajo Stock
        </button>
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="card">
      <div v-if="loading" class="text-center py-8">
        <p>Cargando productos...</p>
      </div>
      
      <div v-else-if="products.length === 0" class="text-center py-8">
        <p class="text-gray-500">No hay productos registrados</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.description }}</td>
              <td>${{ product.price.toFixed(2) }}</td>
              <td>
                <span :class="getStockInfo(product.stock).textClass">
                  {{ product.stock }}
                </span>
              </td>
              <td>
                <span :class="getStockInfo(product.stock).class + ' px-2 py-1 rounded text-xs'">
                  {{ getStockInfo(product.stock).status }}
                </span>
              </td>
              <td>
                <div class="flex space-x-2">
                  <router-link :to="`/products/${product.id}/edit`" class="btn btn-secondary">
                    <i class="fas fa-edit"></i> Editar
                  </router-link>
                  <button @click="deleteProduct(product.id)" class="btn btn-danger">
                    <i class="fas fa-trash"></i> Eliminar
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
import { productService, type Product } from '@/services/productService'
import { getStockStatus } from '@/utils/helpers'

// Estado reactivo
const products = ref<Product[]>([])
const loading = ref(false)
const searchTerm = ref('')

// Cargar productos
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await productService.getAll()
    if (response.success) {
      products.value = response.data
    }
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    loading.value = false
  }
}

// Buscar productos
const searchProducts = async () => {
  if (!searchTerm.value.trim()) {
    await loadProducts()
    return
  }
  
  try {
    const response = await productService.searchByName(searchTerm.value)
    if (response.success) {
      products.value = response.data
    }
  } catch (error) {
    console.error('Error al buscar productos:', error)
  }
}

// Mostrar productos con bajo stock
const showLowStock = async () => {
  try {
    const response = await productService.getLowStock()
    if (response.success) {
      products.value = response.data
    }
  } catch (error) {
    console.error('Error al cargar productos con bajo stock:', error)
  }
}

// Obtener información del estado del stock
const getStockInfo = (stock: number) => {
  return getStockStatus(stock)
}



// Eliminar producto
const deleteProduct = async (id: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return
  
  try {
    const response = await productService.delete(id)
    if (response.success) {
      await loadProducts()
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error)
  }
}



// Cargar datos al montar el componente
onMounted(() => {
  loadProducts()
})
</script>
