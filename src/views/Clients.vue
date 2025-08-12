<template>
  <div>
    <div class="card-header">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="card-title">Gestión de Clientes</h1>
          <p class="text-gray-600">Administra los clientes del sistema</p>
        </div>
        <button @click="showForm = true" class="btn btn-primary">
          Nuevo Cliente
        </button>
      </div>
    </div>

    <!-- Búsqueda -->
    <div class="card mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input 
            v-model="searchTerm" 
            @input="searchClients"
            type="text" 
            placeholder="Buscar clientes por nombre..." 
            class="form-input"
          >
        </div>
        <button @click="loadClients" class="btn btn-secondary">
          Recargar
        </button>
      </div>
    </div>

    <!-- Tabla de clientes -->
    <div class="card">
      <div v-if="loading" class="text-center py-8">
        <p>Cargando clientes...</p>
      </div>
      
      <div v-else-if="clients.length === 0" class="text-center py-8">
        <p class="text-gray-500">No hay clientes registrados</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients" :key="client.id">
              <td>{{ client.id }}</td>
              <td>{{ client.name }}</td>
              <td>{{ client.email }}</td>
              <td>{{ client.phone }}</td>
              <td>
                <div class="flex space-x-2">
                  <button @click="editClient(client)" class="btn btn-secondary">
                    Editar
                  </button>
                  <button @click="deleteClient(client.id)" class="btn btn-danger">
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
          {{ isEditing ? 'Editar Cliente' : 'Nuevo Cliente' }}
        </h3>
        
        <form @submit.prevent="saveClient">
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
            <label class="form-label">Email *</label>
            <input 
              v-model="form.email" 
              type="email" 
              required 
              class="form-input"
              :class="{ error: errors.email }"
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
          
          <div class="form-group">
            <label class="form-label">Teléfono *</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              required 
              class="form-input"
              :class="{ error: errors.phone }"
            >
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
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
import { clientService, type Client, type CreateClientRequest, type UpdateClientRequest } from '@/services/clientService'
import { validateForm, isFormValid, clientValidationRules } from '@/utils/validations'

// Estado reactivo
const clients = ref<Client[]>([])
const loading = ref(false)
const showForm = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const searchTerm = ref('')

// Formulario
const form = ref<CreateClientRequest>({
  name: '',
  email: '',
  phone: ''
})

// Errores de validación
const errors = ref<Record<string, string>>({})

// Cargar clientes
const loadClients = async () => {
  loading.value = true
  try {
    const response = await clientService.getAll()
    if (response.success) {
      clients.value = response.data
    }
  } catch (error) {
    console.error('Error al cargar clientes:', error)
  } finally {
    loading.value = false
  }
}

// Buscar clientes
const searchClients = async () => {
  if (!searchTerm.value.trim()) {
    await loadClients()
    return
  }
  
  try {
    const response = await clientService.searchByName(searchTerm.value)
    if (response.success) {
      clients.value = response.data
    }
  } catch (error) {
    console.error('Error al buscar clientes:', error)
  }
}

// Validar formulario
const validateFormData = (): boolean => {
  errors.value = validateForm(form.value, clientValidationRules)
  return isFormValid(errors.value)
}

// Guardar cliente
const saveClient = async () => {
  if (!validateFormData()) return
  
  try {
    if (isEditing.value && editingId.value) {
      const response = await clientService.update(editingId.value, form.value as UpdateClientRequest)
      if (response.success) {
        await loadClients()
        closeForm()
      }
    } else {
      const response = await clientService.create(form.value)
      if (response.success) {
        await loadClients()
        closeForm()
      }
    }
  } catch (error) {
    console.error('Error al guardar cliente:', error)
  }
}

// Editar cliente
const editClient = (client: Client) => {
  form.value = { ...client }
  isEditing.value = true
  editingId.value = client.id
  showForm.value = true
}

// Eliminar cliente
const deleteClient = async (id: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) return
  
  try {
    const response = await clientService.delete(id)
    if (response.success) {
      await loadClients()
    }
  } catch (error) {
    console.error('Error al eliminar cliente:', error)
  }
}

// Cerrar formulario
const closeForm = () => {
  showForm.value = false
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', email: '', phone: '' }
  errors.value = {}
}

// Cargar datos al montar el componente
onMounted(() => {
  loadClients()
})
</script>
