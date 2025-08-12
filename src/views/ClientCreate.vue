<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Crear Nuevo Cliente</h1>
        <p class="text-muted mb-0">Completa la información del cliente</p>
      </div>
      <router-link to="/clients" class="btn btn-outline-secondary">
        <i class="fas fa-arrow-left me-2"></i>Volver a Clientes
      </router-link>
    </div>

    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent border-bottom">
            <h5 class="card-title mb-0">
              <i class="fas fa-user-plus me-2 text-primary"></i>Información del Cliente
            </h5>
          </div>
          
          <div class="card-body">
            <form @submit.prevent="saveClient">
              <div class="row g-3">
                <div class="col-12">
                  <label for="name" class="form-label">
                    Nombre Completo <span class="text-danger">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.name }"
                    @blur="validateField('name')"
                    placeholder="Ingrese el nombre completo"
                    required
                  />
                  <div v-if="errors.name" class="invalid-feedback">
                    {{ errors.name }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label for="email" class="form-label">
                    Email <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      @blur="validateField('email')"
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label for="phone" class="form-label">
                    Teléfono <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-phone"></i>
                    </span>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      class="form-control"
                      :class="{ 'is-invalid': errors.phone }"
                      @blur="validateField('phone')"
                      placeholder="123-456-7890"
                      required
                    />
                  </div>
                  <div v-if="errors.phone" class="invalid-feedback">
                    {{ errors.phone }}
                  </div>
                </div>

                <div class="col-12">
                  <label for="address" class="form-label">Dirección</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-map-marker-alt"></i>
                    </span>
                    <textarea
                      id="address"
                      v-model="form.address"
                      class="form-control"
                      :class="{ 'is-invalid': errors.address }"
                      @blur="validateField('address')"
                      placeholder="Ingrese la dirección completa"
                      rows="3"
                    ></textarea>
                  </div>
                  <div v-if="errors.address" class="invalid-feedback">
                    {{ errors.address }}
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                <router-link to="/clients" class="btn btn-outline-secondary">
                  <i class="fas fa-times me-2"></i>Cancelar
                </router-link>
                <button 
                  type="submit" 
                  :disabled="!formIsValid || loading" 
                  class="btn btn-primary"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="fas fa-save me-2"></i>
                  {{ loading ? 'Guardando...' : 'Guardar Cliente' }}
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
import { clientService, type CreateClientRequest } from '@/services/clientService'
import { validateForm, isFormValid, clientValidationRules } from '@/utils/validations'
import { showErrorMessage } from '@/utils/errorHandler'

const router = useRouter()
const form = reactive<CreateClientRequest>({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)

// Validar campo específico
const validateField = (field: string) => {
  const fieldErrors = validateForm({ [field]: form[field as keyof CreateClientRequest] }, { [field]: clientValidationRules[field] })
  errors[field] = fieldErrors[field] || ''
}

// Verificar si el formulario es válido
const formIsValid = computed(() => isFormValid(form, clientValidationRules))

// Guardar cliente
const saveClient = async () => {
  try {
    loading.value = true
    
    // Validar todo el formulario
    const formErrors = validateForm(form, clientValidationRules)
    Object.assign(errors, formErrors)
    
    if (Object.keys(formErrors).length > 0) {
      return
    }

    await clientService.create(form)
    router.push('/clients')
  } catch (error) {
    showErrorMessage('Error al crear el cliente', error)
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
