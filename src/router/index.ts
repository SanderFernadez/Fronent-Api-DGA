import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'
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
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: 'Iniciar Sesión', public: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: { title: 'Dashboard', requiresAuth: true }
    },
    {
      path: '/clients',
      name: 'clients',
      component: Clients,
      meta: { title: 'Gestión de Clientes', requiresAuth: true }
    },
    {
      path: '/clients/create',
      name: 'client-create',
      component: ClientCreate,
      meta: { title: 'Crear Cliente', requiresAuth: true }
    },
    {
      path: '/clients/:id/edit',
      name: 'client-edit',
      component: ClientEdit,
      meta: { title: 'Editar Cliente', requiresAuth: true }
    },
    {
      path: '/clients/:id/products',
      name: 'client-products',
      component: ClientProducts,
      meta: { title: 'Productos del Cliente', requiresAuth: true }
    },
    {
      path: '/products',
      name: 'products',
      component: Products,
      meta: { title: 'Gestión de Productos', requiresAuth: true }
    },
    {
      path: '/products/create',
      name: 'product-create',
      component: ProductCreate,
      meta: { title: 'Crear Producto', requiresAuth: true }
    },
    {
      path: '/products/:id/edit',
      name: 'product-edit',
      component: ProductEdit,
      meta: { title: 'Editar Producto', requiresAuth: true }
    },
    {
      path: '/sales',
      name: 'sales',
      component: Sales,
      meta: { title: 'Gestión de Ventas', requiresAuth: true }
    },
    {
      path: '/sales/create',
      name: 'sale-create',
      component: SaleCreate,
      meta: { title: 'Crear Venta', requiresAuth: true }
    },
    {
      path: '/sales/:id',
      name: 'sale-details',
      component: SaleDetails,
      meta: { title: 'Detalles de Venta', requiresAuth: true }
    }
  ]
})

// Guardia de navegación para autenticación
router.beforeEach((to, from, next) => {
  // Cambiar el título de la página según la ruta
  document.title = `DGA - ${to.meta.title || 'Panel Administrativo'}`
  
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    // Verificar si hay un token válido
    if (!authService.hasValidToken()) {
      // Redirigir al login si no hay token válido
      next('/login')
      return
    }
  }
  
  // Si el usuario está autenticado y va al login, redirigir al dashboard
  if (to.path === '/login' && authService.hasValidToken()) {
    next('/')
    return
  }
  
  next()
})

export default router
