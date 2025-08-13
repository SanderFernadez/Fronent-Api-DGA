import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Clients from '@/views/Clients.vue'
import Products from '@/views/Products.vue'
import Sales from '@/views/Sales.vue'
import ClientCreate from '@/views/ClientCreate.vue'
import ClientEdit from '@/views/ClientEdit.vue'
import ClientProducts from '@/views/ClientProducts.vue'
import ProductCreate from '@/views/ProductCreate.vue'
import ProductEdit from '@/views/ProductEdit.vue'
import SaleCreate from '@/views/SaleCreate.vue'
import SaleDetails from '@/views/SaleDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: { title: 'Dashboard' }
    },
    {
      path: '/clients',
      name: 'clients',
      component: Clients,
      meta: { title: 'Gestión de Clientes' }
    },
    {
      path: '/clients/create',
      name: 'client-create',
      component: ClientCreate,
      meta: { title: 'Crear Cliente' }
    },
    {
      path: '/clients/:id/edit',
      name: 'client-edit',
      component: ClientEdit,
      meta: { title: 'Editar Cliente' }
    },
    {
      path: '/clients/:id/products',
      name: 'client-products',
      component: ClientProducts,
      meta: { title: 'Productos del Cliente' }
    },
    {
      path: '/products',
      name: 'products',
      component: Products,
      meta: { title: 'Gestión de Productos' }
    },
    {
      path: '/products/create',
      name: 'product-create',
      component: ProductCreate,
      meta: { title: 'Crear Producto' }
    },
    {
      path: '/products/:id/edit',
      name: 'product-edit',
      component: ProductEdit,
      meta: { title: 'Editar Producto' }
    },
    {
      path: '/sales',
      name: 'sales',
      component: Sales,
      meta: { title: 'Gestión de Ventas' }
    },
    {
      path: '/sales/create',
      name: 'sale-create',
      component: SaleCreate,
      meta: { title: 'Crear Venta' }
    },
    {
      path: '/sales/:id',
      name: 'sale-details',
      component: SaleDetails,
      meta: { title: 'Detalles de Venta' }
    }
  ]
})

// Cambiar el título de la página según la ruta
router.beforeEach((to, from, next) => {
  document.title = `DGA - ${to.meta.title || 'Panel Administrativo'}`
  next()
})

export default router
