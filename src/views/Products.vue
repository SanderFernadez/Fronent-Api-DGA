<template>
  <div>
    <div class="card-header">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="card-title">Gestión de Productos</h1>
          <p class="text-gray-600">Administra los productos del sistema</p>
        </div>
        <button @click="showForm = true" class="btn btn-primary">
          Nuevo Producto
        </button>
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
                  <button @click="editProduct(product)" class="btn btn-secondary">
                    Editar
                  </button>
                  <button @click="deleteProduct(product.id)" class="btn btn-danger">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de formulario -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">
          {{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}
        </h3>
        
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label class="form-label">Nombre *</label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              class="form-input"
              :class="{ error: errors.name }"
            >
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>
          
          <div class="form-group">
            <label class="form-label">Descripción *</label>
            <textarea 
              v-model="form.description" 
              required 
              rows="3"
              class="form-input"
              :class="{ error: errors.description }"
            ></textarea>
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
          </div>
          
          <div class="form-group">
            <label class="form-label">Precio *</label>
            <input 
              v-model="form.price" 
              type="number" 
              step="0.01" 
              min="0" 
              required 
              class="form-input"
              :class="{ error: errors.price }"
            >
            <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
          </div>
          
          <div class="form-group">
            <label class="form-label">Stock *</label>
            <input 
              v-model="form.stock" 
              type="number" 
              min="0" 
              required 
              class="form-input"
              :class="{ error: errors.stock }"
            >
            <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
          </div>
          
          <div class="flex space-x-2 mt-6">
            <button type="submit" class="btn btn-primary flex-1">
              {{ isEditing ? 'Actualizar' : 'Crear' }}
            </button>
            <button type="button" @click="closeForm" class="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService, type Product, type CreateProductRequest, type UpdateProductRequest } from '@/services/productService'
import { getStockStatus } from '@/utils/helpers'
import { validateForm, isFormValid, productValidationRules } from '@/utils/validations'

// Estado reactivo
const products = ref<Product[]>([])
const loading = ref(false)
const showForm = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const searchTerm = ref('')

// Formulario
const form = ref<CreateProductRequest>({
  name: '',
  description: '',
  price: 0,
  stock: 0
})

// Errores de validación
const errors = ref<Record<string, string>>({})

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

// Validar formulario
const validateFormData = (): boolean => {
  errors.value = validateForm(form.value, productValidationRules)
  return isFormValid(errors.value)
}

// Guardar producto
const saveProduct = async () => {
  if (!validateFormData()) return
  
  try {
    if (isEditing.value && editingId.value) {
      const response = await productService.update(editingId.value, form.value as UpdateProductRequest)
      if (response.success) {
        await loadProducts()
        closeForm()
      }
    } else {
      const response = await productService.create(form.value)
      if (response.success) {
        await loadProducts()
        closeForm()
      }
    }
  } catch (error) {
    console.error('Error al guardar producto:', error)
  }
}

// Editar producto
const editProduct = (product: Product) => {
  form.value = { ...product }
  isEditing.value = true
  editingId.value = product.id
  showForm.value = true
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

// Cerrar formulario
const closeForm = () => {
  showForm.value = false
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', description: '', price: 0, stock: 0 }
  errors.value = {}
}

// Cargar datos al montar el componente
onMounted(() => {
  loadProducts()
})
</script>
