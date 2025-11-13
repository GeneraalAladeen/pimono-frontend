import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/Login.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('@/pages/Wallet.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/wallet',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const initializeAuth = async () => {
  const authStore = useAuthStore()
  if (authStore.token && !authStore.isAuthenticated) {
    try {
      await authStore.fetchUser()
      return true
    } catch (error) {
      authStore.clearAuth()
      return false
    }
  }
  return authStore.isAuthenticated
}

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  const isAuthenticated = await initializeAuth()

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/wallet')
  }

  return next()
})

export default router
