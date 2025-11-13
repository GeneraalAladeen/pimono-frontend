<script setup>
import { ref } from 'vue'

import { useAuthStore } from '@/stores/auth'

import router from '@/router'

import BalanceCard from '@/components/BalanceCard.vue'
import TransferForm from '@/components/TransferForm.vue'
import TransactionHistory from '@/components/TransactionHistory.vue'

const balance = ref(546)
const credit = ref(1040950)
const debit = ref(5416)
const pagination = ref({
  first: null,
  last: null,
  prev: null,
  next: 'https://staging.pimono.com/api/transactions?cursor=eyJpZCI6MTgsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0',
})

const authStore = useAuthStore()

const transactions = ref([
  {
    commission_fee: 100,
    amount: 3000,
    receiver: {
      id: 123,
      name: 'James Bond',
    },
    sender: {
      id: 1,
      name: 'Jane Doe',
    },
    created_at: '2025-10-10 10:10:10',
  },
  {
    commission_fee: 100,
    amount: 3000,
    receiver: {
      id: 1,
      name: 'Jane Doe',
    },
    sender: {
      id: 12,
      name: 'Chris Shawn',
    },

    created_at: '2025-10-10 10:10:10',
  },
])
const transactionsLoading = ref(false)
const statLoading = ref(false)

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    //show toast
    console.error('Logout error:', error)
  }
}

const handleTransferCompleted = () => {
  //show toast
}

const loadMoreTransactions = () => {
  //load more
}
</script>

<template>
  <div class="container mx-auto gap-6 p-4 flex flex-col">
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

    <div class="flex justify-between gap-6 flex-col sm:flex-row">
      <BalanceCard title="Current Balance" :balance="balance" :loading="statLoading" />
      <BalanceCard title="Credit" :balance="credit" :loading="statLoading" />
      <BalanceCard title="Debit" :balance="debit" :loading="statLoading" />
    </div>

    <TransferForm @transfer-completed="handleTransferCompleted" />

    <div>
      <TransactionHistory
        :transactions="transactions"
        :loading="transactionsLoading"
        :pagination="pagination"
        @load-more="loadMoreTransactions"
      />
    </div>
  </div>
</template>
