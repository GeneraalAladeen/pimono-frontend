import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TransferForm from './TransferForm.vue'
import { useTransferForm } from '@/composables/useTransferForm'

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({ user: { id: 1 }, userId: 1 }))
}))

vi.mock('@/composables/useTransferForm', () => ({
  useTransferForm: vi.fn(() => ({
    form: { receiver_id: '', amount: '' },
    loading: false,
    v$: { 
      receiver_id: { $touch: vi.fn(), $errors: [] },
      amount: { $touch: vi.fn(), $errors: [] },
      $invalid: false 
    },
    commissionFee: 1.5,
    totalAmount: 101.5,
    submitTransfer: vi.fn()
  }))
}))

vi.mock('@/utils/formatters', () => ({
  formatAmount: vi.fn(amount => `$${amount}`)
}))

describe('TransferForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders form correctly', () => {
    const wrapper = mount(TransferForm)
    
    expect(wrapper.find('h2').text()).toBe('Make a Transfer')
    expect(wrapper.find('input[type="number"]').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('shows commission and total amounts', () => {
    const wrapper = mount(TransferForm)
    const text = wrapper.text()
    
    expect(text).toContain('Commission fee:')
    expect(text).toContain('Total debited:')
  })

  it('calls submitTransfer when form is submitted', async () => {
    const mockSubmit = vi.fn()
    vi.mocked(useTransferForm).mockReturnValueOnce({
      form: { receiver_id: '', amount: '' },
      loading: false,
      v$: { 
        receiver_id: { $touch: vi.fn(), $errors: [] },
        amount: { $touch: vi.fn(), $errors: [] },
        $invalid: false 
      },
      commissionFee: 1.5,
      totalAmount: 101.5,
      submitTransfer: mockSubmit
    })

    const wrapper = mount(TransferForm)
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(mockSubmit).toHaveBeenCalled()
  })
})