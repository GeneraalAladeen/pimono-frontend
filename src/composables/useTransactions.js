import { ref, computed } from 'vue'
import axiosInstance from '@/utils/axios'
import { toast } from 'vue3-toastify'

export function useTransactions() {
  const transactions = ref([])
  const pagination = ref({})
  const loading = ref(false)

  const hasMore = computed(() => !!pagination.value.next)

  const loadTransactions = async (url = 'transactions') => {
    loading.value = true
    try {
      const { data } = await axiosInstance.get(url)
      
      if (url === 'transactions') {
        transactions.value = data.data
      } else {
        transactions.value = [...transactions.value, ...data.data]
      }
      
      pagination.value = data.links
    } catch (error) {
      const message = url === 'transactions' 
        ? 'Failed to load transactions' 
        : 'Failed to load more transactions'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const addTransaction = (transaction) => {
    transactions.value.unshift(transaction)
  }

  return {
    transactions,
    pagination,
    loading,
    hasMore,
    loadTransactions,
    addTransaction
  }
}