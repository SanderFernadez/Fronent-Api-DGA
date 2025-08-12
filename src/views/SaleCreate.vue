<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1">Crear Nueva Venta</h1>
        <p class="text-muted mb-0">Registra una nueva venta en el sistema</p>
      </div>
      <router-link to="/sales" class="btn btn-outline-secondary">
        <i class="fas fa-arrow-left me-2"></i>Volver a Ventas
      </router-link>
    </div>

    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent border-bottom">
            <h5 class="card-title mb-0">
              <i class="fas fa-shopping-cart me-2 text-primary"></i>Información de la Venta
            </h5>
          </div>
          
          <div class="card-body">
            <form @submit.prevent="saveSale">
              <!-- Selección de Cliente -->
              <div class="row g-3 mb-4">
                <div class="col-12">
                  <label for="clientId" class="form-label">
                    Cliente <span class="text-danger">*</span>
                  </label>
                  <select 
                    id="clientId" 
                    v-model="form.clientId" 
                    class="form-select"
                    :class="{ 'is-invalid': errors.clientId }"
                    @blur="validateField('clientId')"
                    required
                  >
                    <option value="">Seleccione un cliente</option>
                    <option v-for="client in clients" :key="client.id" :value="client.id">
                      {{ client.name }} - {{ client.email }}
                    </option>
                  </select>
                  <div v-if="errors.clientId" class="invalid-feedback">
                    {{ errors.clientId }}
                  </div>
                </div>
              </div>

              <!-- Productos de la Venta -->
              <div class="products-section mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="mb-0">
                    <i class="fas fa-box me-2 text-success"></i>Productos de la Venta
                  </h6>
                  <button type="button" @click="addProduct" class="btn btn-sm btn-outline-success">
                    <i class="fas fa-plus me-1"></i>Agregar Producto
                  </button>
                </div>

                <div v-for="(product, index) in form.products" :key="index" class="card border mb-3">
                  <div class="card-body">
                    <div class="row g-3">
                      <div class="col-md-4">
                        <label :for="`productId-${index}`" class="form-label">
                          Producto <span class="text-danger">*</span>
                        </label>
                        <select 
                          :id="`productId-${index}`" 
                          v-model="product.productId" 
                          class="form-select"
                          :class="{ 'is-invalid': getProductError(index, 'productId') }"
                          @change="updateProductPrice(index)"
                        >
                          <option value="">Seleccione un producto</option>
                          <option v-for="availableProduct in availableProducts" :key="availableProduct.id" :value="availableProduct.id">
                            {{ availableProduct.name }} - Stock: {{ availableProduct.stock }}
                          </option>
                        </select>
                        <div v-if="getProductError(index, 'productId')" class="invalid-feedback">
                          {{ getProductError(index, 'productId') }}
                        </div>
                      </div>

                      <div class="col-md-2">
                        <label :for="`quantity-${index}`" class="form-label">
                          Cantidad <span class="text-danger">*</span>
                        </label>
                        <input 
                          :id="`quantity-${index}`" 
                          v-model.number="product.quantity" 
                          type="number" 
                          min="1" 
                          class="form-control"
                          :class="{ 'is-invalid': getProductError(index, 'quantity') }"
                          @input="updateProductTotal(index)"
                          placeholder="1"
                        />
                        <div v-if="getProductError(index, 'quantity')" class="invalid-feedback">
                          {{ getProductError(index, 'quantity') }}
                        </div>
                      </div>

                      <div class="col-md-2">
                        <label :for="`price-${index}`" class="form-label">
                          Precio Unit. <span class="text-danger">*</span>
                        </label>
                        <div class="input-group">
                          <span class="input-group-text">$</span>
                          <input 
                            :id="`price-${index}`" 
                            v-model.number="product.price" 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            class="form-control"
                            :class="{ 'is-invalid': getProductError(index, 'price') }"
                            @input="updateProductTotal(index)"
                            placeholder="0.00"
                          />
                        </div>
                        <div v-if="getProductError(index, 'price')" class="invalid-feedback">
                          {{ getProductError(index, 'price') }}
                        </div>
                      </div>

                      <div class="col-md-2">
                        <label :for="`total-${index}`" class="form-label">Total</label>
                        <input 
                          :id="`total-${index}`" 
                          :value="(product.quantity * product.price).toFixed(2)" 
                          type="text" 
                          class="form-control" 
                          readonly
                        />
                      </div>

                      <div class="col-md-2 d-flex align-items-end">
                        <button 
                          type="button" 
                          @click="removeProduct(index)" 
                          class="btn btn-outline-danger w-100"
                          :disabled="form.products.length === 1"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Resumen de la Venta -->
              <div class="summary-section mb-4">
                <div class="card bg-light">
                  <div class="card-body">
                    <h6 class="card-title mb-3">
                      <i class="fas fa-calculator me-2 text-info"></i>Resumen de la Venta
                    </h6>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="d-flex justify-content-between">
                          <span class="fw-bold">Total de Productos:</span>
                          <span class="badge bg-primary fs-6">{{ totalProducts }}</span>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="d-flex justify-content-between">
                          <span class="fw-bold">Total de la Venta:</span>
                          <span class="fs-5 fw-bold text-success">${{ totalAmount.toFixed(2) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="d-flex justify-content-end gap-3 pt-3 border-top">
                <router-link to="/sales" class="btn btn-outline-secondary">
                  <i class="fas fa-times me-2"></i>Cancelar
                </router-link>
                <button 
                  type="submit" 
                  :disabled="!formIsValid || loading" 
                  class="btn btn-primary"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="fas fa-save me-2"></i>
                  {{ loading ? 'Guardando...' : 'Crear Venta' }}
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
    clients.value = (clientsData as any).data || clientsData
    availableProducts.value = (productsData as any).data || productsData
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
  if (!form.clientId || form.clientId === '') return false
  
  // Validar productos
  if (form.products.length === 0) return false
  
  // Validar que todos los productos tengan datos válidos
  return form.products.every(product =>
    product.productId && 
    product.productId !== '' && 
    product.quantity > 0 && 
    product.price > 0
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
  const selectedProduct = availableProducts.value.find(p => p.id === parseInt(product.productId as string))
  if (selectedProduct) {
    product.price = selectedProduct.price
  }
}

// Actualizar total del producto
const updateProductTotal = (index: number) => {
  // Total calculado automáticamente en el template
}

// Obtener error de producto específico
const getProductError = (index: number, field: string): string => {
  const product = form.products[index]
  if (field === 'productId' && (!product.productId || product.productId === '')) {
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
    
    // Validar formulario completo
    const formErrors = validateForm(form, saleValidationRules)
    Object.assign(errors, formErrors)
    
    if (Object.keys(formErrors).length > 0) {
      return
    }
    
    // Validar productos individualmente
    const productErrors = form.products.some(product =>
      !product.productId || product.productId === '' || product.quantity <= 0 || product.price <= 0
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
.card {
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.form-control:focus,
.form-select:focus {
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

.products-section .card {
  border: 1px solid #dee2e6;
}

.summary-section .card {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}
</style>
