import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Clients from '@/views/Clients.vue'
import Products from '@/views/Products.vue'
import Sales from '@/views/Sales.vue'

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
      path: '/products',
      name: 'products',
      component: Products,
      meta: { title: 'Gestión de Productos' }
    },
    {
      path: '/sales',
      name: 'sales',
      component: Sales,
      meta: { title: 'Gestión de Ventas' }
    }
  ]
})

// Cambiar el título de la página según la ruta
router.beforeEach((to, from, next) => {
  document.title = `DGA - ${to.meta.title || 'Panel Administrativo'}`
  next()
})

export default router
