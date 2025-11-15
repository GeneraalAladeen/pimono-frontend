<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import { formatAmount, formatDate } from '@/utils/formatters'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['load-more'])

const authStore = useAuthStore()

const getTransactionClass = (transaction) => {
  return transaction.sender.id === authStore.userId
    ? 'border-red-200 bg-red-50'
    : 'border-green-200 bg-green-50'
}

const getTransactionDescription = (transaction) => {
  if (transaction.sender.id === authStore.userId) {
    return `Sent to ${transaction.receiver.name}`
  }
  return `Received from ${transaction.sender.name}`
}

const getAmountClass = (transaction) => {
  return transaction.sender.id === authStore.userId ? 'text-red-600' : 'text-green-600'
}

const getAmountDisplay = (transaction) => {
  const prefix = transaction.sender.id === authStore.userId ? '-' : '+'
  return prefix + formatAmount(transaction.amount)
}
</script>

<template>
  <div class="border border-gray-600 rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-semibold mb-4 text-amber-50">Transaction History</h2>

    <div v-if="loading" class="flex flex-col gap-6">
      <div v-for="n in 5" :key="n" class="animate-pulse gap-6">
        <div class="h-12 bg-gray-800 rounded"></div>
      </div>
    </div>

    <div v-else>
      <div v-if="transactions.length === 0" class="text-center py-8 text-gray-500">
        No transactions found.
      </div>

      <div v-else class="flex flex-col gap-6">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          :class="['p-4 border rounded-lg']"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-semibold">
                {{ getTransactionDescription(transaction) }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatDate(transaction.created_at) }}
              </p>
            </div>
            <div class="text-right">
              <p :class="['text-lg font-bold', getAmountClass(transaction)]">
                {{ getAmountDisplay(transaction) }}
              </p>
              <p class="text-sm text-gray-500">
                Fee: {{ formatAmount(transaction.commission_fee) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pagination.next" class="mt-4">
        <button
          @click="$emit('load-more')"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Load More
        </button>
      </div>
    </div>
  </div>
</template>
