<template>
    <h1 class="text-3xl font-bold text-amber-50">Wallet System</h1>
    <div class="flex items-center space-x-4">
        <span class="text-gray-700">Welcome, {{ authStore?.user?.id }}</span>
        <Button
            @click="handleLogout"
            variant="danger"
            label="Logout"
        >
        </Button>
    </div>
 </template>

<script setup>

import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import Button from '@/components/common/Button.vue'

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