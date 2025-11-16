import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BalanceCard from './BalanceCard.vue'

describe('BalanceCard', () => {
  it('displays the balance correctly', () => {
    const wrapper = mount(BalanceCard, {
      props: {
        title: 'Current Balance',
        balance: 1500,
        loading: false
      }
    })
    
    expect(wrapper.text()).toContain('Current Balance')
    expect(wrapper.text()).toContain('$1,500.00')
  })
  
  it('shows loading state', () => {
    const wrapper = mount(BalanceCard, {
      props: {
        title: 'Current Balance',
        balance: 1500,
        loading: true
      }
    })
    
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })
})