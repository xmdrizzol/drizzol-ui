<template>
    <div class="d-form-item">
        <label v-if="label">{{ label }}</label>
        <slot></slot>
        <div v-if="errorMsg" class="d-form-item__error">{{ errorMsg }}</div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'

/** 单字段校验规则 */
interface FormRule {
    required?: boolean
    min?: number
    max?: number
    /** 兜底错误文案（未提供分规则文案时使用） */
    message?: string
    requiredMessage?: string
    minMessage?: string
    maxMessage?: string
    /** 返回 true 表示通过，返回字符串作为错误文案 */
    validator?: (value: any) => true | string
}

/** DForm 通过 provide 注入的上下文 */
interface FormContext {
    model: Record<string, any>
    rules: Record<string, FormRule>
    addFormItem: (item: { validate: () => boolean; reset: () => void }) => void
    removeFormItem: (item: { validate: () => boolean; reset: () => void }) => void
}

const props = defineProps<{
    /** 验证字段 */
    prop: string,
    /** 标签 */
    label?: string
}>()

// 未置于 DForm 内时为 null，此时仅作展示容器，validate 直接通过
const form = inject<FormContext | null>('form', null)
const fieldError = inject<Ref<{ prop: string; message: string } | null>>('fieldError', ref(null))
const errorMsg = ref('')

/** 视为空值：undefined / null / 空字符串 / 空数组（0、false 等合法值不算空） */
const isEmpty = (v: any) =>
    v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)

/** 安全取长度：字符串/数组取 length，数字按字面长度，其余（布尔等）视为 0 */
const safeLength = (v: any) => {
    if (typeof v === 'string' || Array.isArray(v)) return v.length
    if (typeof v === 'number') return String(v).length
    return 0
}

// 验证当前字段
const validate = () => {
    if (!form) return true

    const rule = form.rules[props.prop]
    if (!rule) return true

    const value = form.model[props.prop]

    // 必填
    if (rule.required && isEmpty(value)) {
        errorMsg.value = rule.requiredMessage || rule.message || '该项为必填项'
        return false
    }

    // 最小长度
    if (rule.min && safeLength(value) < rule.min) {
        errorMsg.value = rule.minMessage || rule.message || `长度不能少于 ${rule.min} 个字符`
        return false
    }

    // 最大长度
    if (rule.max && safeLength(value) > rule.max) {
        errorMsg.value = rule.maxMessage || rule.message || `长度不能超过 ${rule.max} 个字符`
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
watch(() => form?.model[props.prop], () => {
    errorMsg.value = ''
})

// 监听全局字段错误
watch(() => fieldError?.value, (val) => {
    if (val?.prop === props.prop) {
        errorMsg.value = val.message
    }
}, { deep: true, immediate: true })

onMounted(() => {
    form?.addFormItem({ validate, reset })
})

onBeforeUnmount(() => {
    form?.removeFormItem({ validate, reset })
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
        color: var(--dz-danger);
    }
}
</style>