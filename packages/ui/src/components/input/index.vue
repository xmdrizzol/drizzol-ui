<template>
  <div class="d-input">
    <input v-model="val" v-if="type !== 'textarea'" :type="type" :placeholder="placeholder" @input="handleInput"
      @blur="handleBlur" ref="inputRef" />
    <textarea v-else v-model="val" :placeholder="placeholder" :rows="rows" @input="handleInput"
      @blur="handleBlur"></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: 'text' | 'password' | 'textarea' | 'number'
  placeholder?: string,
  rows?: number
}>(), {
  type: 'text',
  placeholder: '请输入',
  rows: 2
})

const emit = defineEmits<{
  'update:modelValue': [val: string]
  blur: []
}>()

const val = ref(props.modelValue as string)
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.modelValue, (v) => {
  val.value = v as string
})

const handleInput = () => {
  emit('update:modelValue', val.value)
}

const handleBlur = () => {
  emit('blur')
}

defineExpose({
  focus: () => {
    inputRef.value?.focus()
  }
})
</script>

<style scoped lang="scss">
.d-input {
  width: 100%;

  input,
  textarea {
    width: 100%;
    height: 2.75rem;
    padding: 0 0.75rem;
    border: 1px solid var(--dz-border);
    border-radius: 6px;
    background: var(--dz-bg);
    color: var(--dz-text);
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--dz-primary);
    }

    &::placeholder {
      color: var(--dz-text-l);
    }
  }

  textarea {
    @include scrollbars;

    padding: 0.75rem;
    line-height: 1.6;
    resize: vertical;
    height: auto;
  }
}
</style>