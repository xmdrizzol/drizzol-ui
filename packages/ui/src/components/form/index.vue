<template>
  <form class="d-form" @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'

const props = withDefaults(defineProps<{
  model: Record<string, any>
  rules: Record<string, any>
}>(), {
  rules: () => ({})
})

const emit = defineEmits(['submit'])
const handleSubmit = () => {
  emit('submit')
}

const formItems = ref<any[]>([])

// 收集子组件
const addFormItem = (item: any) => {
  formItems.value.push(item)
}

// 移除子组件
const removeFormItem = (item: any) => {
  formItems.value = formItems.value.filter(i => i !== item)
}

// 提供给子组件
// model/rules 用 getter 动态取当前值：父组件整体替换 model 对象时，子组件 validate 才能读到新值
// （若直接固化 props.model 引用，replace 式赋值后表单校验会一直读到旧对象）
provide('form', {
  get model() { return props.model },
  get rules() { return props.rules },
  addFormItem,
  removeFormItem
})

// 【对外方法】验证整个表单
const validate = async (): Promise<boolean> => {
  let valid = true
  for (const item of formItems.value) {
    const res = await item.validate()
    if (!res) valid = false
  }
  return valid
}

// 【对外方法】重置表单
const resetFields = () => {
  formItems.value.forEach(item => item.reset())
}

defineExpose({ validate, resetFields })
</script>

<style scoped lang="scss">
.d-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>