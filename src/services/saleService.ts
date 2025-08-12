import api from './api'

// Tipos de datos para ventas
export interface SaleProduct {
  productId: number
  quantity: number
  unitPrice: number
}

export interface Sale {
  id: number
  clientId: number
  date: string
  total: number
  saleProducts: SaleProduct[]
}

export interface CreateSaleRequest {
  clientId: number
  date: string
  saleProducts: SaleProduct[]
}

export interface UpdateSaleRequest {
  clientId: number
  date: string
  saleProducts: SaleProduct[]
}

// Servicio de ventas
export const saleService = {
  // Obtener todas las ventas
  async getAll(): Promise<{ success: boolean; data: Sale[]; message: string }> {
    return await api.get('/sales')
  },

  // Obtener venta por ID
  async getById(id: number): Promise<{ success: boolean; data: Sale; message: string }> {
    return await api.get(`/sales/${id}`)
  },

  // Obtener venta con detalles
  async getByIdWithDetails(id: number): Promise<{ success: boolean; data: Sale; message: string }> {
    return await api.get(`/sales/${id}/details`)
  },

  // Crear venta
  async create(saleData: CreateSaleRequest): Promise<{ success: boolean; data: Sale; message: string }> {
    return await api.post('/sales', saleData)
  },

  // Actualizar venta
  async update(id: number, saleData: UpdateSaleRequest): Promise<{ success: boolean; data: Sale; message: string }> {
    return await api.put(`/sales/${id}`, saleData)
  },

  // Eliminar venta
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    return await api.delete(`/sales/${id}`)
  },

  // Obtener ventas por cliente
  async getByClient(clientId: number): Promise<{ success: boolean; data: Sale[]; message: string }> {
    return await api.get(`/sales/client/${clientId}`)
  },

  // Obtener reporte de ventas
  async getReport(startDate?: string, endDate?: string): Promise<{ success: boolean; data: any; message: string }> {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    return await api.get(`/sales/report?${params.toString()}`)
  }
}
