<template>
  <div class="product-edit">
    <div class="page-header">
      <h1>Editar Producto</h1>
      <router-link to="/products" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver a Productos
      </router-link>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading">Cargando producto...</div>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-message">{{ error }}</div>
      <button @click="loadProduct" class="btn btn-primary">Reintentar</button>
    </div>

    <div v-else class="form-container">
      <form @submit.prevent="updateProduct" class="form">
        <div class="form-group">
          <label for="name">Nombre del Producto *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            :class="{ 'error': errors.name }"
            @blur="validateField('name')"
            placeholder="Ingrese el nombre del producto"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea
            id="description"
            v-model="form.description"
            :class="{ 'error': errors.description }"
            @blur="validateField('description')"
            placeholder="Descripción detallada del producto"
            rows="3"
          ></textarea>
          <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price">Precio *</label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              :class="{ 'error': errors.price }"
              @blur="validateField('price')"
              placeholder="0.00"
            />
            <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
          </div>

          <div class="form-group">
            <label for="stock">Stock *</label>
            <input
              id="stock"
              v-model.number="form.stock"
              type="number"
              min="0"
              :class="{ 'error': errors.stock }"
              @blur="validateField('stock')"
              placeholder="0"
            />
            <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="category">Categoría</label>
          <input
            id="category"
            v-model="form.category"
            type="text"
            :class="{ 'error': errors.category }"
            @blur="validateField('category')"
            placeholder="Categoría del producto"
          />
          <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.push('/products')" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" :disabled="!formIsValid || saving" class="btn btn-primary">
            <span v-if="saving">Guardando...</span>
            <span v-else>Actualizar Producto</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productService, type UpdateProductRequest } from '@/services/productService'
import { validateForm, isFormValid, productValidationRules } from '@/utils/validations'
import { showErrorMessage } from '@/utils/errorHandler'

const router = useRouter()
const route = useRoute()

const form = reactive<UpdateProductRequest>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: ''
})

const errors = reactive<Record<string, string>>({})
const loading = ref(true)
const saving = ref(false)
const error = ref('')

const productId = computed(() => route.params.id as string)

// Validar campo específico
const validateField = (field: string) => {
  const fieldErrors = validateForm({ [field]: form[field as keyof UpdateProductRequest] }, { [field]: productValidationRules[field] })
  errors[field] = fieldErrors[field] || ''
}

// Verificar si el formulario es válido
const formIsValid = computed(() => isFormValid(form, productValidationRules))

// Cargar producto
const loadProduct = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const product = await productService.getById(productId.value)
    
    // Llenar el formulario con los datos del producto
    form.name = product.name
    form.description = product.description || ''
    form.price = product.price
    form.stock = product.stock
    form.category = product.category || ''
    
  } catch (err) {
    error.value = 'Error al cargar el producto. Verifique que el ID sea válido.'
    showErrorMessage('Error al cargar el producto', err)
  } finally {
    loading.value = false
  }
}

// Actualizar producto
const updateProduct = async () => {
  try {
    saving.value = true
    
    // Validar todo el formulario
    const formErrors = validateForm(form, productValidationRules)
    Object.assign(errors, formErrors)
    
    if (Object.keys(formErrors).length > 0) {
      return
    }

    await productService.update(productId.value, form)
    router.push('/products')
  } catch (err) {
    showErrorMessage('Error al actualizar el producto', err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-edit {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading {
  font-size: 18px;
  color: #666;
}

.error-message {
  color: #dc3545;
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form {
  display: grid;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

@media (max-width: 768px) {
  .product-edit {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
