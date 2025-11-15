<script setup>
import { ref , onMounted } from 'vue'

import { useAuthStore } from '@/stores/auth'

import router from '@/router'
import axiosInstance from '@/utils/axios'

import BalanceCard from '@/components/BalanceCard.vue'
import TransferForm from '@/components/TransferForm.vue'
import TransactionHistory from '@/components/TransactionHistory.vue'

const balance = ref()
const credit = ref(1040950)
const debit = ref(5416)
const pagination = ref({})

const authStore = useAuthStore()

const transactions = ref([])
const transactionsLoading = ref(false)
const statLoading = ref(false)


const loadData = async () => {
  await Promise.all([
    loadTransactions(),
  ])
}

const loadTransactions = async () => {
  transactionsLoading.value = true
  try {
    const response = await axiosInstance.get('transactions')

    balance.value = authStore.user.balance
    transactions.value = response.data.data
    pagination.value = response.data.links
  } catch (error) {
    // Show toast
    alert('Failed to load transactions')
  } finally {
    transactionsLoading.value = false
  }
}

const loadMoreTransactions = async () => {
  if (!pagination.value.next) return
  
  try {
    const response = await axiosInstance.get(pagination.value.next)
    transactions.value = [...transactions.value, ...response.data.data]
    pagination.value = response.data.links
  } catch (error) {
    console.error('Failed to load more transactions:', error)
    alert('Failed to load more transactions')
  }
}

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

onMounted(async () => {
  await loadData()
})


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
