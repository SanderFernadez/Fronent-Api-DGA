import api from './api'

// Tipos de datos para clientes
export interface Client {
  id: number
  name: string
  email: string
  phone: string
}

export interface CreateClientRequest {
  name: string
  email: string
  phone: string
}

export interface UpdateClientRequest {
  name: string
  email: string
  phone: string
}

// Servicio de clientes
export const clientService = {
  // Obtener todos los clientes
  async getAll(): Promise<{ success: boolean; data: Client[]; message: string }> {
    return await api.get('/clients')
  },

  // Obtener cliente por ID
  async getById(id: number): Promise<{ success: boolean; data: Client; message: string }> {
    return await api.get(`/clients/${id}`)
  },

  // Crear cliente
  async create(clientData: CreateClientRequest): Promise<{ success: boolean; data: Client; message: string }> {
    return await api.post('/clients', clientData)
  },

  // Actualizar cliente
  async update(id: number, clientData: UpdateClientRequest): Promise<{ success: boolean; data: Client; message: string }> {
    return await api.put(`/clients/${id}`, clientData)
  },

  // Eliminar cliente
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    return await api.delete(`/clients/${id}`)
  },

  // Buscar por email
  async getByEmail(email: string): Promise<{ success: boolean; data: Client; message: string }> {
    return await api.get(`/clients/email/${email}`)
  },

  // Buscar por teléfono
  async getByPhone(phone: string): Promise<{ success: boolean; data: Client; message: string }> {
    return await api.get(`/clients/phone/${phone}`)
  },

  // Buscar por nombre
  async searchByName(name: string): Promise<{ success: boolean; data: Client[]; message: string }> {
    return await api.get(`/clients/search?name=${name}`)
  }
}

