<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEchoPublic } from "@laravel/echo-vue";
import { toast } from 'vue3-toastify';

import { useAuthStore } from '@/stores/auth'
import { useTransactions } from '@/composables/useTransactions'

import BalanceCard from '@/components/BalanceCard'
import Header from '@/components/Header.vue'
import TransferForm from '@/components/TransferForm'
import TransactionHistory from '@/components/TransactionHistory'

const authStore = useAuthStore()
const balance = ref(authStore.user?.balance || 0)
const statLoading = ref(false)

const { 
  transactions, 
  pagination, 
  loading: transactionsLoading, 
  hasMore, 
  loadTransactions, 
  addTransaction 
} = useTransactions()


const loadData = async () => {
  await Promise.all([
    loadTransactions(),
  ])
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

  const isSender = transaction.sender_id === authStore.userId
  
  balance.value = isSender 
    ? transaction.sender.balance 
    : transaction.receiver.balance

  addTransaction(transaction)
  
  toast.success(`Transaction complete`)
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

    <TransferForm />

    <TransactionHistory
      :transactions="transactions"
      :loading="transactionsLoading"
      :pagination="pagination"
      @load-more="() => loadTransactions(pagination.next)"
    />
  </div>
</template>
