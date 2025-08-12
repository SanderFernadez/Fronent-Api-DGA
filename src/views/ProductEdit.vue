<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Editar Producto</h1>
        <p class="text-muted mb-0">Modifica la información del producto</p>
      </div>
      <router-link to="/products" class="btn btn-outline-secondary">
        <i class="fas fa-arrow-left me-2"></i>Volver a Productos
      </router-link>
    </div>

    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent border-bottom">
            <h5 class="card-title mb-0">
              <i class="fas fa-edit me-2 text-primary"></i>Información del Producto
            </h5>
          </div>
          
          <div class="card-body">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-3 text-muted">Cargando producto...</p>
            </div>

            <div v-else-if="error" class="text-center py-5">
              <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
              <h5 class="text-warning">{{ error }}</h5>
              <button @click="loadProduct" class="btn btn-primary mt-3">
                <i class="fas fa-redo me-2"></i>Reintentar
              </button>
            </div>

            <form v-else @submit.prevent="updateProduct">
              <div class="row g-3">
                <div class="col-12">
                  <label for="name" class="form-label">
                    Nombre del Producto <span class="text-danger">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.name }"
                    @blur="validateField('name')"
                    placeholder="Ingrese el nombre del producto"
                    required
                  />
                  <div v-if="errors.name" class="invalid-feedback">
                    {{ errors.name }}
                  </div>
                </div>

                <div class="col-12">
                  <label for="description" class="form-label">Descripción</label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    class="form-control"
                    :class="{ 'is-invalid': errors.description }"
                    @blur="validateField('description')"
                    placeholder="Descripción detallada del producto"
                    rows="3"
                  ></textarea>
                  <div v-if="errors.description" class="invalid-feedback">
                    {{ errors.description }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label for="price" class="form-label">
                    Precio <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      id="price"
                      v-model.number="form.price"
                      type="number"
                      step="0.01"
                      min="0"
                      class="form-control"
                      :class="{ 'is-invalid': errors.price }"
                      @blur="validateField('price')"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div v-if="errors.price" class="invalid-feedback">
                    {{ errors.price }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label for="stock" class="form-label">
                    Stock <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-cubes"></i>
                    </span>
                    <input
                      id="stock"
                      v-model.number="form.stock"
                      type="number"
                      min="0"
                      class="form-control"
                      :class="{ 'is-invalid': errors.stock }"
                      @blur="validateField('stock')"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div v-if="errors.stock" class="invalid-feedback">
                    {{ errors.stock }}
                  </div>
                </div>


              </div>

              <div class="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                <router-link to="/products" class="btn btn-outline-secondary">
                  <i class="fas fa-times me-2"></i>Cancelar
                </router-link>
                <button 
                  type="submit" 
                  :disabled="!formIsValid || saving" 
                  class="btn btn-primary"
                >
                  <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="fas fa-save me-2"></i>
                  {{ saving ? 'Guardando...' : 'Actualizar Producto' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productService, type UpdateProductRequest } from '@/services/productService'
import { validateForm, validateField as validateFieldUtil, productValidationRules } from '@/utils/validations'
import { showErrorMessage } from '@/utils/errorHandler'

const router = useRouter()
const route = useRoute()

const form = reactive<UpdateProductRequest>({
  name: '',
  description: '',
  price: 0,
  stock: 0
})

const errors = reactive<Record<string, string>>({})
const loading = ref(true)
const saving = ref(false)
const error = ref('')

const productId = computed(() => route.params.id as string)

// Validar campo específico
const validateField = (field: string) => {
  const fieldValue = form[field as keyof UpdateProductRequest]
  const fieldRules = productValidationRules[field]
  if (fieldRules) {
    const error = validateFieldUtil(fieldValue, fieldRules)
    errors[field] = error || ''
  }
}

// Verificar si el formulario es válido
const formIsValid = computed(() => {
  const formErrors = validateForm(form, productValidationRules)
  return Object.keys(formErrors).length === 0
})

// Cargar producto
const loadProduct = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await productService.getById(parseInt(productId.value))
    const product = (response as any).data || response
    
    // Llenar el formulario con los datos del producto
    form.name = product.name
    form.description = product.description || ''
    form.price = product.price
    form.stock = product.stock
    
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

    await productService.update(parseInt(productId.value), form)
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
.card {
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
