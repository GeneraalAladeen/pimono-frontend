<script setup>
import { ref , onMounted } from 'vue'
import { useEchoPublic } from "@laravel/echo-vue";
import { toast } from 'vue3-toastify';

import { useAuthStore } from '@/stores/auth'

import router from '@/router'
import axiosInstance from '@/utils/axios'

import BalanceCard from '@/components/BalanceCard.vue'
import Header from '@/components/Header.vue'
import TransferForm from '@/components/TransferForm.vue'
import TransactionHistory from '@/components/TransactionHistory.vue'

const authStore = useAuthStore()

const balance = ref(authStore.user?.balance)
const pagination = ref({})

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

    transactions.value = response.data.data
    pagination.value = response.data.links
  } catch (error) {
    toast.error('Failed to load transactions')
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

    toast.error('Failed to load more transactions')
  }
}

useEchoPublic(
    `users.${authStore.userId}`,
    ".transaction.completed",
    (e) => {
      handleRealtimeTransaction(e);
    },
);

const handleRealtimeTransaction = (event) => {
  const { transaction } = event;

  if (transaction.sender_id === authStore.userId) {
    balance.value = transaction.sender.balance
  } else {
    balance.value = transaction.receiver.balance
  }

  transactions.value.unshift(transaction)
  
  toast.success(`Transaction complete`)
}


const handleTransferCompleted = () => {
  toast.success(`Transaction sent successfuly`)
}

onMounted(async () => {
  await loadData()
})


</script>

<template>
  <div class="container mx-auto gap-6 p-4 flex flex-col">
    <Header />

    <div class="flex justify-between gap-6 flex-col sm:flex-row">
      <BalanceCard title="Current Balance" :balance="balance" :loading="statLoading" />
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
