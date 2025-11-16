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

        <Button
          :loading="authStore.isLoading"
          label="Sign in"
          loading-label="Signing in...">
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'

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
