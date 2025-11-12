<script setup>
import { ref, reactive, computed, defineEmits, defineProps } from 'vue'
import { formatAmount } from '@/utils/formatters'

const emit = defineEmits(['transfer-completed'])

const loading = ref(false)
const form = reactive({
  receiver_id: '',
  amount: '',
})

const errors = reactive({
  receiver_id: '',
  amount: '',
})

const commissionFee = computed(() => {
  const amount = parseFloat(form.amount) || 0
  return amount * 0.015
})

const totalAmount = computed(() => {
  const amount = parseFloat(form.amount) || 0
  return amount + commissionFee.value
})

const submitTransfer = async () => {
  loading.value = true

  errors.receiver_id = ''
  errors.amount = ''
}
</script>

<template>
  <div class="border border-gray-600 rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-amber-50">Make a Transfer</h2>
    <form @submit.prevent="submitTransfer">
      <div class="gap-4 flex-col flex">
        <div>
          <label for="receiver_id" class="block text-lg font-medium text-gray-300">
            Recipient User ID
          </label>
          <input
            type="number"
            id="receiver_id"
            v-model="form.receiver_id"
            :class="[
              'mt-1 block w-full border h-10 rounded-md border-gray-300 shadow-sm ',
              errors.receiver_id ? 'border-red-500' : '',
            ]"
            required
          />
          <p v-if="errors.receiver_id" class="mt-1 text-sm text-red-600">
            {{ errors.receiver_id[0] }}
          </p>
        </div>

        <div>
          <label for="amount" class="block text-lg font-medium text-gray-300"> Amount </label>
          <input
            type="number"
            id="amount"
            v-model="form.amount"
            :class="[
              'mt-1 block w-full border  h-10 rounded-md border-gray-300 shadow-sm ',
              errors.amount ? 'border-red-500' : '',
            ]"
            required
          />
          <p v-if="errors.amount" class="mt-1 text-sm text-red-600">
            {{ errors.amount[0] }}
          </p>
          <p class="mt-1 text-sm font-semibold">
            Commission fee: {{ formatAmount(commissionFee) }} (1.5%)
          </p>
          <p class="mt-1 text-sm font-semibold">Total debited: {{ formatAmount(totalAmount) }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          :class="[
            'w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700 ',
            loading ? 'opacity-50 cursor-not-allowed' : '',
          ]"
        >
          <span v-if="loading">Processing...</span>
          <span v-else>Send Money</span>
        </button>
      </div>
    </form>
  </div>
</template>
