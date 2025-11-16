<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-amber-50">
          Sign in to your wallet
        </h2>
      </div>
      <form class="mt-8 flex flex-col gap-6" @submit.prevent="handleLogin">
        <Input
          id="email"
          placeholder="Email Address"
          v-model="form.email"
          :required="true"
          :disabled="authStore.isLoading"
        />
        <Input
          id="password"
          type="password"
          placeholder="Password"
          v-model="form.password"
          :required="true"
          :disabled="authStore.isLoading"
        />

        <p v-if="error" class="text-sm text-red-600">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="authStore.isLoading"
          :class="[
            'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            authStore.isLoading ? 'opacity-50 cursor-not-allowed' : '',
          ]"
        >
          {{ authStore.isLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Input from '@/components/common/Input.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const error = ref('')

const handleLogin = async () => {
  error.value = ''

  try {
    await authStore.login(form)
    router.push('/wallet')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  }
}
</script>
