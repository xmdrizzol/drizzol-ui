<template>
    <div class="d-notification" :class="[`d-notification--${type}`, { 'is-leaving': leaving }, customClass]">
        <div class="d-notification__header">
            <DIcon :name="iconMap[type]" class="d-notification__icon" size="1.05" />
            <span v-if="title" class="d-notification__title">{{ title }}</span>
            <button v-if="showClose" class="d-notification__close" aria-label="关闭" @click="close">&times;</button>
        </div>
        <div class="d-notification__body">
            <component v-if="isVNode(message)" :is="message" />
            <span v-else>{{ message }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isVNode, onMounted, onUnmounted, ref, type VNode } from 'vue'
import DIcon from '@ui/components/icon'

const iconMap: Record<string, string> = {
    success: 'circle-check',
    error: 'circle-close',
    warning: 'circle-alert',
    info: 'info',
}

const props = withDefaults(defineProps<{
    /** 标题 */
    title?: string
    /** 正文：文本或渲染函数产生的 VNode（如上传进度条） */
    message?: string | VNode
    /** 类型（决定状态点颜色） */
    type?: 'success' | 'error' | 'warning' | 'info'
    /** 自动关闭时长（ms），0 表示不自动关 */
    duration?: number
    /** 是否显示右上角关闭按钮 */
    showClose?: boolean
    /** 附加到根节点的自定义类 */
    customClass?: string
}>(), {
    title: '',
    message: '',
    type: 'info',
    duration: 4500,
    showClose: true,
    customClass: '',
})

const emit = defineEmits<{ destroy: [] }>()

const leaving = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function startLeave() {
    if (leaving.value) return
    leaving.value = true
    timer = setTimeout(() => emit('destroy'), 240)
}

function close() {
    if (timer) clearTimeout(timer)
    startLeave()
}

onMounted(() => {
    if (props.duration > 0) timer = setTimeout(startLeave, props.duration)
})

onUnmounted(() => {
    if (timer) clearTimeout(timer)
})

defineExpose({ close })
</script>

<style scoped lang="scss">
.d-notification {
    width: 320px;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid var(--dz-border);
    background: var(--dz-bg);
    // 类型变体把底色/描边换成半透明罩层：clip 到 padding-box 后描边下方不再压着自身底色，
    // 与页面底（= --dz-bg，原 color-mix 的混色对象）的合成结果与 0.6.0 一致
    background-clip: padding-box;
    box-shadow: var(--dz-shadow-md);
    color: var(--dz-text);
    font-size: 0.875rem;
    animation: d-notification-in 0.25s ease;
    transition: opacity 0.2s ease, transform 0.2s ease;

    &__header {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    &__title {
        flex: 1;
        font-weight: 500;
        color: var(--dz-text-h);
    }

    &__icon {
        flex-shrink: 0;
    }

    // 类型差异化：最低支持 Chrome 86 无 color-mix()，
    // 用 rgba(var(--dz-*-rgb), <alpha>) 等价表达，随深浅主题自适应
    &--success {
        background: rgba(var(--dz-success-rgb), 0.1);
        border-color: rgba(var(--dz-success-rgb), 0.4);
        .d-notification__icon { color: var(--dz-success); }
    }

    &--error {
        background: rgba(var(--dz-danger-rgb), 0.1);
        border-color: rgba(var(--dz-danger-rgb), 0.4);
        .d-notification__icon { color: var(--dz-danger); }
    }

    &--warning {
        background: rgba(var(--dz-warning-rgb), 0.12);
        border-color: rgba(var(--dz-warning-rgb), 0.45);
        .d-notification__icon { color: var(--dz-warning); }
    }

    &__close {
        border: none;
        background: none;
        padding: 0 2px;
        font-size: 16px;
        line-height: 1;
        color: var(--dz-text-l);
        cursor: pointer;

        &:hover {
            color: var(--dz-text);
        }
    }

    &--info .d-notification__icon { color: var(--dz-primary); }

    &__body {
        margin-top: 6px;
        color: var(--dz-text-d);
        line-height: 1.6;
    }

    &.is-leaving {
        opacity: 0;
        transform: translateX(12px);
    }
}

@keyframes d-notification-in {
    from {
        opacity: 0;
        transform: translateX(16px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>

<!-- 容器为命令式创建，样式需全局（非 scoped） -->
<style lang="scss">
.d-notification-container {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 3000;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
