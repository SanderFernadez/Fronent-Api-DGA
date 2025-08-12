<template>
  <div class="sale-create">
    <div class="page-header">
      <h1>Crear Nueva Venta</h1>
      <router-link to="/sales" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver a Ventas
      </router-link>
    </div>

    <div class="form-container">
      <form @submit.prevent="saveSale" class="form">
        <!-- Selección de Cliente -->
        <div class="form-group">
          <label for="clientId">Cliente *</label>
          <select
            id="clientId"
            v-model="form.clientId"
            :class="{ 'error': errors.clientId }"
            @blur="validateField('clientId')"
          >
            <option value="">Seleccione un cliente</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }} - {{ client.email }}
            </option>
          </select>
          <span v-if="errors.clientId" class="error-message">{{ errors.clientId }}</span>
        </div>

        <!-- Productos -->
        <div class="products-section">
          <h3>Productos de la Venta</h3>
          
          <div v-for="(product, index) in form.products" :key="index" class="product-item">
            <div class="product-row">
              <div class="form-group">
                <label :for="`productId-${index}`">Producto *</label>
                <select
                  :id="`productId-${index}`"
                  v-model="product.productId"
                  :class="{ 'error': getProductError(index, 'productId') }"
                  @change="updateProductPrice(index)"
                >
                  <option value="">Seleccione un producto</option>
                  <option v-for="availableProduct in availableProducts" :key="availableProduct.id" :value="availableProduct.id">
                    {{ availableProduct.name }} - Stock: {{ availableProduct.stock }}
                  </option>
                </select>
                <span v-if="getProductError(index, 'productId')" class="error-message">{{ getProductError(index, 'productId') }}</span>
              </div>

              <div class="form-group">
                <label :for="`quantity-${index}`">Cantidad *</label>
                <input
                  :id="`quantity-${index}`"
                  v-model.number="product.quantity"
                  type="number"
                  min="1"
                  :class="{ 'error': getProductError(index, 'quantity') }"
                  @input="updateProductTotal(index)"
                  placeholder="1"
                />
                <span v-if="getProductError(index, 'quantity')" class="error-message">{{ getProductError(index, 'quantity') }}</span>
              </div>

              <div class="form-group">
                <label :for="`price-${index}`">Precio Unitario *</label>
                <input
                  :id="`price-${index}`"
                  v-model.number="product.price"
                  type="number"
                  step="0.01"
                  min="0"
                  :class="{ 'error': getProductError(index, 'price') }"
                  @input="updateProductTotal(index)"
                  placeholder="0.00"
                />
                <span v-if="getProductError(index, 'price')" class="error-message">{{ getProductError(index, 'price') }}</span>
              </div>

              <div class="form-group">
                <label :for="`total-${index}`">Total</label>
                <input
                  :id="`total-${index}`"
                  :value="(product.quantity * product.price).toFixed(2)"
                  type="text"
                  readonly
                  class="readonly"
                />
              </div>

              <button
                type="button"
                @click="removeProduct(index)"
                class="btn btn-danger btn-small"
                :disabled="form.products.length === 1"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <button type="button" @click="addProduct" class="btn btn-secondary btn-add">
            <i class="fas fa-plus"></i> Agregar Producto
          </button>
        </div>

        <!-- Resumen -->
        <div class="summary-section">
          <h3>Resumen de la Venta</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Total de Productos:</span>
              <span class="summary-value">{{ totalProducts }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total de la Venta:</span>
              <span class="summary-value">${{ totalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.push('/sales')" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" :disabled="!formIsValid || loading" class="btn btn-primary">
            <span v-if="loading">Guardando...</span>
            <span v-else>Crear Venta</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { saleService, type CreateSaleRequest, type SaleProduct } from '@/services/saleService'
import { clientService, type Client } from '@/services/clientService'
import { productService, type Product } from '@/services/productService'
import { validateForm, isFormValid, saleValidationRules } from '@/utils/validations'
import { showErrorMessage } from '@/utils/errorHandler'

const router = useRouter()

const form = reactive<CreateSaleRequest>({
  clientId: '',
  products: [
    {
      productId: '',
      quantity: 1,
      price: 0
    }
  ]
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)
const clients = ref<Client[]>([])
const availableProducts = ref<Product[]>([])

// Cargar datos iniciales
const loadInitialData = async () => {
  try {
    const [clientsData, productsData] = await Promise.all([
      clientService.getAll(),
      productService.getAll()
    ])
    
    clients.value = clientsData
    availableProducts.value = productsData
  } catch (error) {
    showErrorMessage('Error al cargar los datos iniciales', error)
  }
}

// Validar campo específico
const validateField = (field: string) => {
  const fieldErrors = validateForm({ [field]: form[field as keyof CreateSaleRequest] }, { [field]: saleValidationRules[field] })
  errors[field] = fieldErrors[field] || ''
}

// Verificar si el formulario es válido
const formIsValid = computed(() => {
  // Validar cliente
  if (!form.clientId) return false
  
  // Validar productos
  if (form.products.length === 0) return false
  
  return form.products.every(product => 
    product.productId && product.quantity > 0 && product.price > 0
  )
})

// Agregar producto
const addProduct = () => {
  form.products.push({
    productId: '',
    quantity: 1,
    price: 0
  })
}

// Remover producto
const removeProduct = (index: number) => {
  if (form.products.length > 1) {
    form.products.splice(index, 1)
  }
}

// Actualizar precio del producto
const updateProductPrice = (index: number) => {
  const product = form.products[index]
  const selectedProduct = availableProducts.value.find(p => p.id === product.productId)
  
  if (selectedProduct) {
    product.price = selectedProduct.price
  }
}

// Actualizar total del producto
const updateProductTotal = (index: number) => {
  const product = form.products[index]
  // El total se calcula automáticamente en el template
}

// Obtener error de un producto específico
const getProductError = (index: number, field: string): string => {
  const product = form.products[index]
  
  if (field === 'productId' && !product.productId) {
    return 'Seleccione un producto'
  }
  
  if (field === 'quantity' && (!product.quantity || product.quantity <= 0)) {
    return 'La cantidad debe ser mayor a 0'
  }
  
  if (field === 'price' && (!product.price || product.price <= 0)) {
    return 'El precio debe ser mayor a 0'
  }
  
  return ''
}

// Total de productos
const totalProducts = computed(() => {
  return form.products.reduce((total, product) => total + product.quantity, 0)
})

// Total de la venta
const totalAmount = computed(() => {
  return form.products.reduce((total, product) => total + (product.quantity * product.price), 0)
})

// Guardar venta
const saveSale = async () => {
  try {
    loading.value = true
    
    // Validar cliente
    if (!form.clientId) {
      errors.clientId = 'Seleccione un cliente'
      return
    }
    
    // Validar productos
    const productErrors = form.products.some(product => 
      !product.productId || product.quantity <= 0 || product.price <= 0
    )
    
    if (productErrors) {
      return
    }

    await saleService.create(form)
    router.push('/sales')
  } catch (error) {
    showErrorMessage('Error al crear la venta', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadInitialData()
})
</script>

<style scoped>
.sale-create {
  max-width: 1000px;
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
  gap: 30px;
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
.form-group select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group input.error,
.form-group select.error {
  border-color: #dc3545;
}

.form-group input.readonly {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.products-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8f9fa;
}

.products-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
}

.product-item {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.product-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 15px;
  align-items: end;
}

.btn-add {
  margin-top: 15px;
  width: 100%;
}

.summary-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8f9fa;
}

.summary-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.summary-label {
  font-weight: 600;
  color: #333;
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #007bff;
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

.btn-small {
  padding: 8px 12px;
  font-size: 14px;
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

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .sale-create {
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
  
  .product-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
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
