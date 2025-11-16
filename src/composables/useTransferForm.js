import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minValue, helpers } from '@vuelidate/validators'
import { toast } from 'vue3-toastify'
import axiosInstance from '@/utils/axios'

const COMMISSION_RATE = 0.015
const MIN_AMOUNT = 10

export function useTransferForm(authStore, emit) {
    const loading = ref(false)
    
    const form = reactive({
        receiver_id: '',
        amount: '',
    })

    const rules = computed(() => ({
        receiver_id: {
        required: helpers.withMessage('Recipient ID is required', required),
        numeric: helpers.withMessage('Recipient ID must be a number', numeric),
        minValue: helpers.withMessage('Recipient ID must be positive', minValue(1)),
        validUser: helpers.withMessage(
            'You cannot send money to yourself',
            (value) => parseInt(value) !== authStore.userId
        )
        },
        amount: {
        required: helpers.withMessage('Amount is required', required),
        numeric: helpers.withMessage('Amount must be a valid number', numeric),
        minValue: helpers.withMessage(
            `Amount must be greater or equal to ${MIN_AMOUNT}`,
            minValue(MIN_AMOUNT)
        ),
        sufficientBalance: helpers.withMessage(
            'Insufficient balance including commission fee',
            (value) => {
            const amount = parseFloat(value) || 0
            const total = amount + calculateCommission(amount)
            return total <= authStore.user.balance
            }
        )
        }
    }))

    const v$ = useVuelidate(rules, form)
    const amountValue = computed(() => parseFloat(form.amount) || 0)
    const commissionFee = computed(() => calculateCommission(amountValue.value))
    const totalAmount = computed(() => amountValue.value + commissionFee.value)

    const calculateCommission = (amount) => amount * COMMISSION_RATE

    const resetForm = () => {
        form.receiver_id = ''
        form.amount = ''
        v$.value.$reset()
    }

    const handleBackendErrors = (errors) => {
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
    }

    const handleSuccess = () => {
        resetForm()
        toast.success('Transaction sent successfully')
        emit('transfer-completed')
    }

    const handleError = (error) => {
        if (error.response?.status === 422) {
            handleBackendErrors(error.response.data.errors)
        } else {
            const message = error.response?.data?.message || 'Transfer failed'
            toast.error(message)
        }
    }

    const submitTransfer = async () => {
        loading.value = true
        
        const isFormValid = await v$.value.$validate()
        if (!isFormValid) {
            loading.value = false
            return
        }

        try {
            await axiosInstance.post('transactions', form)
            handleSuccess()
        } catch (error) {
            handleError(error)
        } finally {
            loading.value = false
        }
    }

    return {
        form,
        loading,
        v$,
        commissionFee,
        totalAmount,
        submitTransfer
    }
}