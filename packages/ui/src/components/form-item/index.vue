<template>
    <div class="d-form-item">
        <label v-if="label">{{ label }}</label>
        <slot></slot>
        <div v-if="errorMsg" class="d-form-item__error">{{ errorMsg }}</div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'

const props = defineProps<{
    /** 验证字段 */
    prop: string,
    /** 标签 */
    label?: string
}>()

const form: any = inject('form')
const fieldError = inject<Ref<{ prop: string; message: string } | null>>('fieldError', ref(null))
const errorMsg = ref('')

// 验证当前字段
const validate = () => {
    const rule = form.rules[props.prop]
    const value = form.model[props.prop]

    if (!rule) return true

    // 必填
    if (rule.required && !value) {
        errorMsg.value = rule.message
        return false
    }

    // 最小长度
    if (rule.min && value.length < rule.min) {
        errorMsg.value = rule.message
        return false
    }

    // 最大长度
    if (rule.max && value.length > rule.max) {
        errorMsg.value = rule.message
        return false
    }

    // 自定义验证
    if (rule.validator) {
        const msg = rule.validator(value)
        if (msg !== true) {
            errorMsg.value = msg || '验证失败'
            return false
        }
    }

    errorMsg.value = ''
    return true
}

// 清空错误
const reset = () => {
    errorMsg.value = ''
}

// 值变化时清除错误
watch(() => form.model[props.prop], () => {
    errorMsg.value = ''
})

// 监听全局字段错误
watch(() => fieldError?.value, (val) => {
    if (val?.prop === props.prop) {
        errorMsg.value = val.message
    }
}, { deep: true, immediate: true })

onMounted(() => {
    form.addFormItem({ validate, reset })
})

onBeforeUnmount(() => {
    form.removeFormItem({ validate, reset })
})

defineExpose({ validate, reset })
</script>

<style scoped lang="scss">
.d-form-item {
    display: flex;
    flex-direction: column;
    gap: 7px;

    label {
        font-size: .875rem;
        color: var(--dz-text-d);
    }

    &__error {
        font-size: .75rem;
        color: #f43f5e;
    }
}
</style>