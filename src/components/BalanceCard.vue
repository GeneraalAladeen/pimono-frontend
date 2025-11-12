<script setup>
import { formatAmount } from '@/utils/formatters'

const props = defineProps({
  balance: {
    type: [Number, String],
    default: 0,
  },
  title: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="border border-gray-600 rounded-lg shadow-md p-4 grow">
    <div v-if="loading" class="flex gap-2 flex-col">
      <div class="animate-pulse">
        <div class="h-8 w-2/3 bg-gray-600 rounded"></div>
      </div>
      <div class="animate-pulse">
        <div class="h-8 w-1/3 bg-gray-600 rounded"></div>
      </div>
    </div>
    <div v-else>
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>

      <div class="text-3xl font-semibold tracking-tight text-gray-950 dark:text-white">
        {{ formatAmount(balance) }}
      </div>
    </div>
  </div>
</template>
