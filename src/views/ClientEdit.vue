<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Editar Cliente</h1>
        <p class="text-muted mb-0">Modifica la información del cliente</p>
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
              <i class="fas fa-user-edit me-2 text-primary"></i>Información del Cliente
            </h5>
          </div>
          
          <div class="card-body">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-3 text-muted">Cargando cliente...</p>
            </div>

            <div v-else-if="error" class="text-center py-5">
              <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
              <h5 class="text-warning">{{ error }}</h5>
              <button @click="loadClient" class="btn btn-primary mt-3">
                <i class="fas fa-redo me-2"></i>Reintentar
              </button>
            </div>

            <form v-else @submit.prevent="updateClient">
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


              </div>

              <div class="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                <router-link to="/clients" class="btn btn-outline-secondary">
                  <i class="fas fa-times me-2"></i>Cancelar
                </router-link>
                <button 
                  type="submit" 
                  :disabled="!formIsValid || saving" 
                  class="btn btn-primary"
                >
                  <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="fas fa-save me-2"></i>
                  {{ saving ? 'Guardando...' : 'Actualizar Cliente' }}
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
import { clientService, type UpdateClientRequest } from '@/services/clientService'
import { validateForm, validateField as validateFieldUtil, clientValidationRules } from '@/utils/validations'
import { showErrorMessage } from '@/utils/errorHandler'

const router = useRouter()
const route = useRoute()

const form = reactive<UpdateClientRequest>({
  name: '',
  email: '',
  phone: ''
})

const errors = reactive<Record<string, string>>({})
const loading = ref(true)
const saving = ref(false)
const error = ref('')


const clientId = computed(() => route.params.id as string)

// Validar campo específico
const validateField = (field: string) => {
  const fieldValue = form[field as keyof UpdateClientRequest]
  const fieldRules = clientValidationRules[field]
  if (fieldRules) {
    const error = validateFieldUtil(fieldValue, fieldRules)
    errors[field] = error || ''
  }
}

// Verificar si el formulario es válido
const formIsValid = computed(() => {
  const formErrors = validateForm(form, clientValidationRules)
  return Object.keys(formErrors).length === 0
})

// Cargar cliente
const loadClient = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await clientService.getById(parseInt(clientId.value))
    const client = (response as any).data || response
    
    // Llenar el formulario con los datos del cliente
    form.name = client.name
    form.email = client.email
    form.phone = client.phone
    
  } catch (err) {
    error.value = 'Error al cargar el cliente. Verifique que el ID sea válido.'
    showErrorMessage('Error al cargar el cliente', err)
  } finally {
    loading.value = false
  }
}

// Actualizar cliente
const updateClient = async () => {
  try {
    saving.value = true
    
    // Validar todo el formulario
    const formErrors = validateForm(form, clientValidationRules)
    Object.assign(errors, formErrors)
    
    if (Object.keys(formErrors).length > 0) {
      return
    }

    await clientService.update(parseInt(clientId.value), form)
    router.push('/clients')
  } catch (err) {
    showErrorMessage('Error al actualizar el cliente', err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadClient()
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
