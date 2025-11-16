<template>
    <h1 class="text-3xl font-bold text-amber-50">Wallet System</h1>
    <div class="flex items-center space-x-4">
        <span class="text-gray-700">Welcome, {{ authStore?.user?.id }}</span>
        <button
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
            Logout
        </button>
    </div>
 </template>

<script setup>

import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {

    toast.error('Logout error')
  }
}
</script>