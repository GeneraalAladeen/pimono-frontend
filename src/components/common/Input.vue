<template>
    <div>
      <input
        :type="type"
        :id="id"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        :class="[
          'mt-1 block w-full border px-3 py-2 h-10 rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error ? 'border-red-500 ring-2 ring-red-200' : '',
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        ]"
        :required="required"
        :disabled="disabled"
      />
      <p v-if="error" class="mt-1 text-sm text-red-600">
        {{ error }}
      </p>
    </div>
</template>
  
<script setup>
    const props = defineProps({
        modelValue: [String, Number],
        type: {
        type: String,
        default: 'text'
        },
        id: String,
        placeholder: String,
        error: String,
        required: Boolean,
        disabled: Boolean,
        validation: Function,
        validateOn: {
        type: String,
        default: 'blur', // 'input', 'blur', 'both'
        validator: (value) => ['input', 'blur', 'both'].includes(value)
        }
    })
  
    const emit = defineEmits(['update:modelValue', 'validation'])
    
    const handleInput = (event) => {
        const value = event.target.value
        emit('update:modelValue', value)
        
        if (props.validateOn === 'input' || props.validateOn === 'both') {
            emit('validation')
        }
    }

    const handleBlur = () => {
        if (props.validateOn === 'blur' || props.validateOn === 'both') {
            emit('validation')
        }
    }
  

  </script>