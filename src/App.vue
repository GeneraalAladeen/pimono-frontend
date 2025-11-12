<script setup>
import { ref } from 'vue'

import BalanceCard from './components/BalanceCard.vue'
import TransferForm from './components/TransferForm.vue'

const balance = ref(546)
const credit = ref(1040950)
const debit = ref(5416)

const statLoading = ref(false)

const handleTransferCompleted = () => {
  //show toast
}
</script>

<template>
  <div id="app" class="container mx-auto gap-6 p-4">
    <h1 class="text-3xl font-bold">Wallet System</h1>

    <div class="flex justify-between gap-6 flex-col sm:flex-row">
      <BalanceCard title="Current Balance" :balance="balance" :loading="statLoading" />
      <BalanceCard title="Credit" :balance="credit" :loading="statLoading" />
      <BalanceCard title="Debit" :balance="debit" :loading="statLoading" />
    </div>

    <TransferForm @transfer-completed="handleTransferCompleted" />
  </div>
</template>
