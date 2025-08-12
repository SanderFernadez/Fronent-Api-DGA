<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Crear Nuevo Producto</h1>
        <p class="text-muted mb-0">Completa la información del producto</p>
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
              <i class="fas fa-box me-2 text-primary"></i>Información del Producto
            </h5>
          </div>
          
          <div class="card-body">
            <form @submit.prevent="saveProduct">
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
                  :disabled="!formIsValid || loading" 
                  class="btn btn-primary"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="fas fa-save me-2"></i>
                  {{ loading ? 'Guardando...' : 'Guardar Producto' }}
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { productService, type CreateProductRequest } from '@/services/productService'
import { validateForm, isFormValid, productValidationRules } from '@/utils/validations'
import { showErrorMessage } from '@/utils/errorHandler'

const router = useRouter()
const form = reactive<CreateProductRequest>({
  name: '',
  description: '',
  price: 0,
  stock: 0
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)

// Validar campo específico
const validateField = (field: string) => {
  const fieldErrors = validateForm({ [field]: form[field as keyof CreateProductRequest] }, { [field]: productValidationRules[field] })
  errors[field] = fieldErrors[field] || ''
}

// Verificar si el formulario es válido
const formIsValid = computed(() => isFormValid(form, productValidationRules))

// Guardar producto
const saveProduct = async () => {
  try {
    loading.value = true
    
    // Validar todo el formulario
    const formErrors = validateForm(form, productValidationRules)
    Object.assign(errors, formErrors)
    
    if (Object.keys(formErrors).length > 0) {
      return
    }

    await productService.create(form)
    router.push('/products')
  } catch (error) {
    showErrorMessage('Error al crear el producto', error)
  } finally {
    loading.value = false
  }
}
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
