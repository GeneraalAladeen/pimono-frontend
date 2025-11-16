<script setup>
import { computed } from 'vue'
import { formatAmount } from '@/utils/formatters'
import { useAuthStore } from '@/stores/auth'
import { useTransferForm } from '@/composables/useTransferForm'
import Input from '@/components/common/Input.vue'

const authStore = useAuthStore()
const emit = defineEmits(['transfer-completed'])

const {
  form,
  loading,
  v$,
  commissionFee,
  totalAmount,
  submitTransfer
} = useTransferForm(authStore, emit)

</script>

<template>
  <div class="border border-gray-600 rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-amber-50">Make a Transfer</h2>
    <form @submit.prevent="submitTransfer">
      <div class="gap-4 flex-col flex">

        <Input
          type="number"
          id="receiver_id"
          placeholder="Recipient User ID"
          v-model="form.receiver_id"
          :required="true"
          :disabled="loading"
          validate-on="blur"
          @validation="v$.receiver_id.$touch()"
          :error="v$.receiver_id.$errors[0]?.$message"
        />

        <Input
          type="number"
          id="amount"
          placeholder="Amount"
          v-model="form.amount"
          :required="true"
          :disabled="loading"
          validate-on="input"
          @validation="v$.amount.$touch()"
          :error="v$.amount.$errors[0]?.$message"
        />

        <p class="mt-1 text-sm font-semibold">
            Commission fee: {{ formatAmount(commissionFee) }} (1.5%)
          </p>
          <p class="mt-1 text-sm font-semibold">Total debited: {{ formatAmount(totalAmount) }}</p>

        <button
          type="submit"
          :disabled="loading || v$.$invalid"
          :class="[
            'w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700 ',
            loading || v$.$invalid ? 'opacity-50 cursor-not-allowed' : '',
          ]"
        >
          <span v-if="loading">Processing...</span>
          <span v-else>Send Money</span>
        </button>
      </div>
    </form>
  </div>
</template>
