<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Submit'
  },
  loadingLabel: {
    type: String,
    default: 'Processing...'
  },
  type: {
    type: String,
    default: 'submit'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    @click="emit('click')"
    :class="[
      'inline-flex justify-center items-center border border-transparent rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm',
      {
        'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
        'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500': variant === 'danger'
      },
      {
        'opacity-50 cursor-not-allowed': loading || disabled,
        'w-full': fullWidth
      }
    ]"
  >

    <span>
      {{ loading ? loadingLabel : label }}
    </span>
  </button>
</template>