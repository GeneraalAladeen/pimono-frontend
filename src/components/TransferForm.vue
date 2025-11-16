<script setup>
import { ref, reactive, computed, defineEmits, defineProps } from 'vue'
import { formatAmount } from '@/utils/formatters'
import axiosInstance from '@/utils/axios'
import { useAuthStore } from '@/stores/auth'
import Input from '@/components/common/Input.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minValue, helpers } from '@vuelidate/validators'
import { toast } from 'vue3-toastify';

const authStore = useAuthStore()

const emit = defineEmits(['transfer-completed'])

const loading = ref(false);

const form = reactive({
  receiver_id: '',
  amount: '',
})

const rules = computed(() => ({
  receiver_id: {
    required: helpers.withMessage('Recipient ID is required', required),
    numeric: helpers.withMessage('Recipient ID must be a number', numeric),
    minValue: helpers.withMessage('Recipient ID must be positive', minValue(1)),
    validUser: helpers.withMessage('You cannot send money to yourself',
      (value) => {
        return parseInt(value) !== authStore.userId
      }
    )
  },
  amount: {
    required: helpers.withMessage('Amount is required', required),
    numeric: helpers.withMessage('Amount must be a valid number', numeric),
    minValue: helpers.withMessage('Amount must be greater or equal to 10', minValue(10)),
    sufficientBalance: helpers.withMessage(
      'Insufficient balance including commission fee',
      (value) => {
        const amount = parseFloat(value) || 0
        const total = amount + (amount * 0.015)
        return total <= authStore.user.balance
      }
    )
  }
}))

const v$ = useVuelidate(rules, form)

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

  const isFormValid = await v$.value.$validate()

  if(!isFormValid) return;

  try {
    await axiosInstance.post('transactions', form)
    
    form.receiver_id = ''
    form.amount = ''
    v$.value.$reset()
    
    emit('transfer-completed')
    
  } catch (error) {
    if (error.response && error.response.status === 422) {

      const { errors } = error.response.data;

      Object.keys(errors).forEach(field => {
        if (v$.value[field]) {
          v$.value[field].$invalid = true
          v$.value[field].$errors.push({
            $message: errors[field][0],
            $validator: 'backend',
            $params: {}
          })
        }
      })

    } else {
      const message = error.response?.data?.message || 'Transfer failed'
      toast.error(message)
    }
  } finally {
    loading.value = false
  }
}
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
