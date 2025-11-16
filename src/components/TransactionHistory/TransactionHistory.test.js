import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TransactionHistory from './TransactionHistory.vue'

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    userId: 1
  }))
}))

vi.mock('@/utils/formatters', () => ({
  formatAmount: vi.fn((amount) => `$${amount.toFixed(2)}`),
  formatDate: vi.fn((date) => new Date(date).toLocaleDateString())
}))

vi.mock('@/components/common/Button.vue', () => ({
  default: {
    name: 'Button',
    template: '<button :disabled="disabled"><slot>{{ loading ? loadingLabel : label }}</slot></button>',
    props: ['loading', 'disabled', 'label', 'loadingLabel']
  }
}))

describe('TransactionHistory', () => {
  let wrapper
  let mockAuthStore

  const mockTransactions = [
    {
      id: 1,
      amount: 100,
      commission_fee: 1.5,
      created_at: '2023-10-01T10:00:00Z',
      sender: { id: 1, name: 'John Doe' },
      receiver: { id: 2, name: 'Jane Smith' }
    },
    {
      id: 2,
      amount: 50,
      commission_fee: 0.75,
      created_at: '2023-10-02T11:00:00Z',
      sender: { id: 2, name: 'Jane Smith' },
      receiver: { id: 1, name: 'John Doe' }
    }
  ]

  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    mockAuthStore = (await import('@/stores/auth')).useAuthStore
    mockAuthStore.mockReturnValue({
      userId: 1
    })
  })

  describe('Rendering', () => {
    it('renders the component with title', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [],
          loading: false,
          pagination: {}
        }
      })

      expect(wrapper.find('h2').text()).toBe('Transaction History')
    })

    it('shows loading state when loading is true', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [],
          loading: true,
          pagination: {}
        }
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
      expect(wrapper.findAll('.animate-pulse').length).toBe(5) // 5 skeleton items
    })

    it('shows empty state when no transactions', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [],
          loading: false,
          pagination: {}
        }
      })

      expect(wrapper.text()).toContain('No transactions found.')
    })
  })

  describe('Transaction Display', () => {
    it('displays transactions when provided', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: mockTransactions,
          loading: false,
          pagination: {}
        }
      })

      const transactionItems = wrapper.findAll('[class*="p-4 border rounded-lg"]')
      expect(transactionItems.length).toBe(2)
    })

    it('shows sent transaction correctly', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [mockTransactions[0]], // Sent transaction (sender is current user)
          loading: false,
          pagination: {}
        }
      })

      const transactionText = wrapper.text()
      expect(transactionText).toContain('Sent to Jane Smith')
      expect(transactionText).toContain('-$100.00') // Negative amount for sent
    })

    it('shows received transaction correctly', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [mockTransactions[1]], // Received transaction
          loading: false,
          pagination: {}
        }
      })

      const transactionText = wrapper.text()
      expect(transactionText).toContain('Received from Jane Smith')
      expect(transactionText).toContain('+$50.00') // Positive amount for received
    })

    it('displays commission fee for each transaction', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: mockTransactions,
          loading: false,
          pagination: {}
        }
      })

      const transactionText = wrapper.text()
      expect(transactionText).toContain('Fee: $1.50')
      expect(transactionText).toContain('Fee: $0.75')
    })

    it('displays formatted dates', async () => {
      const formatDate = (await import('@/utils/formatters')).formatDate
      
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: mockTransactions,
          loading: false,
          pagination: {}
        }
      })

      expect(formatDate).toHaveBeenCalledWith('2023-10-01T10:00:00Z')
      expect(formatDate).toHaveBeenCalledWith('2023-10-02T11:00:00Z')
    })
  })

  describe('Styling', () => {
    it('applies correct styles for sent transactions', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [mockTransactions[0]], // Sent transaction
          loading: false,
          pagination: {}
        }
      })

      const transactionDiv = wrapper.find('[class*="p-4 border rounded-lg"]')
      const amountElement = wrapper.find('.text-lg')
      
      expect(amountElement.classes()).toContain('text-red-600')
    })

    it('applies correct styles for received transactions', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [mockTransactions[1]], // Received transaction
          loading: false,
          pagination: {}
        }
      })

      const amountElement = wrapper.find('.text-lg')
      expect(amountElement.classes()).toContain('text-green-600')
    })
  })

  describe('Load More Functionality', () => {
    it('shows load more button when pagination has next page', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: mockTransactions,
          loading: false,
          pagination: { next: 'http://api.com/transactions?page=2' }
        }
      })

      const loadMoreButton = wrapper.findComponent({ name: 'Button' })
      expect(loadMoreButton.exists()).toBe(true)
      expect(loadMoreButton.props('label')).toBe('Load More')
    })

    it('hides load more button when no next page', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: mockTransactions,
          loading: false,
          pagination: { next: null }
        }
      })

      const loadMoreButton = wrapper.findComponent({ name: 'Button' })
      expect(loadMoreButton.exists()).toBe(false)
    })

    it('emits load-more event when load more button is clicked', async () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: mockTransactions,
          loading: false,
          pagination: { next: 'http://api.com/transactions?page=2' }
        }
      })

      const loadMoreButton = wrapper.findComponent({ name: 'Button' })
      await loadMoreButton.trigger('click')

      expect(wrapper.emitted('load-more')).toBeTruthy()
      expect(wrapper.emitted('load-more').length).toBe(1)
    })


  })

  describe('Utility Functions', () => {
    it('getTransactionDescription returns correct description for sent transactions', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [],
          loading: false,
          pagination: {}
        }
      })

      const sentTransaction = mockTransactions[0] // sender is current user
      const description = wrapper.vm.getTransactionDescription(sentTransaction)
      
      expect(description).toBe('Sent to Jane Smith')
    })

    it('getTransactionDescription returns correct description for received transactions', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [],
          loading: false,
          pagination: {}
        }
      })

      const receivedTransaction = mockTransactions[1] // receiver is current user
      const description = wrapper.vm.getTransactionDescription(receivedTransaction)
      
      expect(description).toBe('Received from Jane Smith')
    })

    it('getAmountDisplay formats sent amount with negative sign', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [],
          loading: false,
          pagination: {}
        }
      })

      const sentTransaction = mockTransactions[0]
      const amountDisplay = wrapper.vm.getAmountDisplay(sentTransaction)
      
      expect(amountDisplay).toBe('-$100.00')
    })

    it('getAmountDisplay formats received amount with positive sign', () => {
      wrapper = mount(TransactionHistory, {
        props: {
          transactions: [],
          loading: false,
          pagination: {}
        }
      })

      const receivedTransaction = mockTransactions[1]
      const amountDisplay = wrapper.vm.getAmountDisplay(receivedTransaction)
      
      expect(amountDisplay).toBe('+$50.00')
    })
  })
})