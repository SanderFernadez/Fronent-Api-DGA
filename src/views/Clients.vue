<template>
  <div>
    <div class="card-header">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="card-title">Gestión de Clientes</h1>
          <p class="text-gray-600">Administra los clientes del sistema</p>
        </div>
        <router-link to="/clients/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Nuevo Cliente
        </router-link>
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
                  <router-link :to="`/clients/${client.id}/edit`" class="btn btn-secondary">
                    <i class="fas fa-edit"></i> Editar
                  </router-link>
                  <button @click="deleteClient(client.id)" class="btn btn-danger">
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
import { clientService, type Client } from '@/services/clientService'

// Estado reactivo
const clients = ref<Client[]>([])
const loading = ref(false)
const searchTerm = ref('')

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



// Cargar datos al montar el componente
onMounted(() => {
  loadClients()
})
</script>
