import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axiosInstance from '@/utils/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userId = computed(() => user.value?.id)

  const setAuth = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete axiosInstance.defaults.headers.common['Authorization']
  }

  const login = async (credentials) => {
    isLoading.value = true
    try {
      const response = await axiosInstance.post('login', credentials)
      setAuth(response.data.data.user, response.data.data.token)
      return response.data
    } catch (error) {
      clearAuth()
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
    }
  }

  const fetchUser = async () => {
    if (!token.value) return

    try {
      const response = await axiosInstance.get('user')
      user.value = response.data
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  if (token.value) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    user,
    token,
    isLoading,

    isAuthenticated,
    userId,

    login,
    logout,
    fetchUser,
    clearAuth,
  }
})
