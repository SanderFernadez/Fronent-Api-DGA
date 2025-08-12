<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Gestión de Clientes</h1>
        <p class="text-muted mb-0">Administra los clientes del sistema</p>
      </div>
      <router-link to="/clients/create" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i>Nuevo Cliente
      </router-link>
    </div>

    <!-- Búsqueda -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input 
                v-model="searchTerm" 
                @input="searchClients"
                type="text" 
                class="form-control"
                placeholder="Buscar clientes por nombre..." 
              >
            </div>
          </div>
          <div class="col-md-4">
            <button @click="loadClients" class="btn btn-outline-secondary w-100">
              <i class="fas fa-sync-alt me-2"></i>Recargar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de clientes -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-transparent border-bottom">
        <h5 class="card-title mb-0">
          <i class="fas fa-users me-2 text-primary"></i>Lista de Clientes
        </h5>
      </div>
      
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando clientes...</p>
        </div>
        
        <div v-else-if="(clients as any)?.length === 0" class="text-center py-5">
          <i class="fas fa-users fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No hay clientes registrados</h5>
          <p class="text-muted">Comienza agregando tu primer cliente</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col" class="border-0">ID</th>
                <th scope="col" class="border-0">Nombre</th>
                <th scope="col" class="border-0">Email</th>
                <th scope="col" class="border-0">Teléfono</th>
                <th scope="col" class="border-0 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in clients" :key="client.id">
                <td>
                  <span class="badge bg-secondary">{{ client.id }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-3">
                      <div class="avatar-title bg-primary bg-opacity-10 rounded-circle">
                        <i class="fas fa-user text-primary"></i>
                      </div>
                    </div>
                                         <div>
                       <h6 class="mb-0">{{ client.name }}</h6>
                                               <small class="text-muted">Cliente</small>
                     </div>
                  </div>
                </td>
                <td>
                  <a :href="`mailto:${client.email}`" class="text-decoration-none">
                    <i class="fas fa-envelope me-1 text-muted"></i>
                    {{ client.email }}
                  </a>
                </td>
                <td>
                  <a :href="`tel:${client.phone}`" class="text-decoration-none">
                    <i class="fas fa-phone me-1 text-muted"></i>
                    {{ client.phone }}
                  </a>
                </td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <router-link :to="`/clients/${client.id}/edit`" class="btn btn-sm btn-outline-primary">
                      <i class="fas fa-edit"></i>
                    </router-link>
                    <button @click="deleteClient(client.id)" class="btn btn-sm btn-outline-danger">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Footer con estadísticas -->
      <div class="card-footer bg-transparent border-top">
        <div class="row align-items-center">
          <div class="col-md-6">
            <small class="text-muted">
              Mostrando {{ (clients as any)?.length || 0 }} cliente{{ ((clients as any)?.length || 0) !== 1 ? 's' : '' }}
            </small>
          </div>
          <div class="col-md-6 text-md-end">
            <small class="text-muted">
              Última actualización: {{ new Date().toLocaleTimeString() }}
            </small>
          </div>
        </div>
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
    clients.value = (response as any).data || response
  } catch (error) {
    console.error('Error al cargar clientes:', error)
  } finally {
    loading.value = false
  }
}

// Buscar clientes
const searchClients = async () => {
  if (searchTerm.value.trim() === '') {
    await loadClients()
    return
  }
  
  loading.value = true
  try {
    const response = await clientService.searchByName(searchTerm.value)
    clients.value = (response as any).data || response
  } catch (error) {
    console.error('Error al buscar clientes:', error)
  } finally {
    loading.value = false
  }
}

// Eliminar cliente
const deleteClient = async (id: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
    return
  }
  
  try {
    await clientService.delete(id)
    await loadClients()
  } catch (error) {
    console.error('Error al eliminar cliente:', error)
  }
}

onMounted(() => {
  loadClients()
})
</script>

<style scoped>
.avatar-sm {
  width: 40px;
  height: 40px;
}

.avatar-title {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.table th {
  font-weight: 600;
  color: #495057;
}

.table td {
  vertical-align: middle;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.card {
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
