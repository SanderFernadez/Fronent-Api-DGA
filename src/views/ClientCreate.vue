<template>
  <div class="client-create">
    <div class="page-header">
      <h1>Crear Nuevo Cliente</h1>
      <router-link to="/clients" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver a Clientes
      </router-link>
    </div>

    <div class="form-container">
      <form @submit.prevent="saveClient" class="form">
        <div class="form-group">
          <label for="name">Nombre *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            :class="{ 'error': errors.name }"
            @blur="validateField('name')"
            placeholder="Ingrese el nombre completo"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :class="{ 'error': errors.email }"
            @blur="validateField('email')"
            placeholder="ejemplo@correo.com"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="phone">Teléfono *</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            :class="{ 'error': errors.phone }"
            @blur="validateField('phone')"
            placeholder="123-456-7890"
          />
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label for="address">Dirección</label>
          <textarea
            id="address"
            v-model="form.address"
            :class="{ 'error': errors.address }"
            @blur="validateField('address')"
            placeholder="Ingrese la dirección completa"
            rows="3"
          ></textarea>
          <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.push('/clients')" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" :disabled="!formIsValid || loading" class="btn btn-primary">
            <span v-if="loading">Guardando...</span>
            <span v-else>Guardar Cliente</span>
          </button>
        </div>
      </form>
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
.client-create {
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
  .client-create {
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
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
