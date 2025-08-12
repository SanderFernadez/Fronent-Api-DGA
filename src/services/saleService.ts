import api from './api'

// Tipos de datos para ventas
export interface SaleProduct {
  productId: number
  quantity: number
  unitPrice: number
  product?: {
    id: number
    name: string
    description: string
    price: number
    stock: number
  }
}

export interface Sale {
  id: number
  clientId: number
  date: string
  total: number
  saleProducts: SaleProduct[]
  // Para el endpoint with-products
  client?: {
    id: number
    name: string
    email: string
    phone: string
  }
  products?: Array<{
    saleId: number
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
    product: {
      id: number
      name: string
      description: string
      price: number
      stock: number
    }
  }>
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
    return await api.get('/Sales')
  },

  // Obtener venta por ID
  async getById(id: number): Promise<{ success: boolean; data: Sale; message: string }> {
    return await api.get(`/Sales/${id}`)
  },

  // Obtener venta con detalles
  async getByIdWithDetails(id: number): Promise<{ success: boolean; data: Sale; message: string }> {
    return await api.get(`/Sales/${id}/details`)
  },

  // Crear venta
  async create(saleData: CreateSaleRequest): Promise<{ success: boolean; data: Sale; message: string }> {
    return await api.post('/Sales', saleData)
  },

  // Actualizar venta
  async update(id: number, saleData: UpdateSaleRequest): Promise<{ success: boolean; data: Sale; message: string }> {
    return await api.put(`/Sales/${id}`, saleData)
  },

  // Eliminar venta
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    return await api.delete(`/Sales/${id}`)
  },

  // Obtener ventas por cliente
  async getByClient(clientId: number): Promise<{ success: boolean; data: Sale[]; message: string }> {
    return await api.get(`/Sales/client/${clientId}`)
  },

  // Obtener ventas por cliente con productos detallados
  async getByClientWithProducts(clientId: number): Promise<{ success: boolean; data: Sale[]; message: string }> {
    return await api.get(`/Sales/client/${clientId}/with-products`)
  },

  // Obtener ventas por rango de fechas
  async getByDateRange(startDate: string, endDate: string): Promise<{ success: boolean; data: Sale[]; message: string }> {
    return await api.get(`/Sales/date-range?startDate=${startDate}&endDate=${endDate}`)
  },

  // Obtener reporte de ventas
  async getReport(startDate?: string, endDate?: string): Promise<{ success: boolean; data: any; message: string }> {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    return await api.get(`/Sales/report?${params.toString()}`)
  }
}
