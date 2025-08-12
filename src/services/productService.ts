import api from './api'

// Tipos de datos para productos
export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  stock: number
}

export interface UpdateProductRequest {
  name: string
  description: string
  price: number
  stock: number
}

// Servicio de productos
export const productService = {
  // Obtener todos los productos
  async getAll(): Promise<{ success: boolean; data: Product[]; message: string }> {
    return await api.get('/products')
  },

  // Obtener producto por ID
  async getById(id: number): Promise<{ success: boolean; data: Product; message: string }> {
    return await api.get(`/products/${id}`)
  },

  // Crear producto
  async create(productData: CreateProductRequest): Promise<{ success: boolean; data: Product; message: string }> {
    return await api.post('/products', productData)
  },

  // Actualizar producto
  async update(id: number, productData: UpdateProductRequest): Promise<{ success: boolean; data: Product; message: string }> {
    return await api.put(`/products/${id}`, productData)
  },

  // Eliminar producto
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    return await api.delete(`/products/${id}`)
  },

  // Buscar por nombre
  async searchByName(name: string): Promise<{ success: boolean; data: Product[]; message: string }> {
    return await api.get(`/products/search?name=${name}`)
  },

  // Obtener productos con bajo stock
  async getLowStock(): Promise<{ success: boolean; data: Product[]; message: string }> {
    return await api.get('/products/low-stock')
  }
}
