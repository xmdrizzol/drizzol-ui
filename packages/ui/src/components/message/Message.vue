<template>
    <div class="d-message" :class="[`d-message--${type}`, { 'is-leaving': leaving }]">
        <DIcon :name="iconMap[type]" class="d-message__icon" size="1.05" />
        <span class="d-message__text">{{ text }}</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import DIcon from '@ui/components/icon'

const props = withDefaults(defineProps<{
    /** 消息类型 */
    type?: 'success' | 'error' | 'warning' | 'info'
    /** 文本内容 */
    text?: string
    /** 自动关闭时长（ms），0 表示不自动关 */
    duration?: number
}>(), {
    type: 'info',
    text: '',
    duration: 3000,
})

const emit = defineEmits<{ destroy: [] }>()

// 类型图标（Lucide，随雪碧图 currentColor 着色）
const iconMap: Record<string, string> = {
    success: 'circle-check',
    error: 'circle-close',
    warning: 'circle-alert',
    info: 'info',
}

const leaving = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function startLeave() {
    if (leaving.value) return
    leaving.value = true
    // 离场过渡时长与样式内 transition 保持一致
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
.d-message {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 16px;
    border-radius: 8px;
    border: 1px solid var(--dz-border);
    background: var(--dz-bg);
    // 类型变体把底色/描边换成半透明罩层：clip 到 padding-box 后描边下方不再压着自身底色，
    // 与页面底（= --dz-bg，原 color-mix 的混色对象）的合成结果与 0.6.0 一致
    background-clip: padding-box;
    box-shadow: var(--dz-shadow-sm);
    color: var(--dz-text);
    font-size: 0.875rem;
    line-height: 1.5;
    animation: d-message-in 0.25s ease;
    transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    pointer-events: auto;

    &__icon {
        flex-shrink: 0;
    }

    &.is-leaving {
        opacity: 0;
        transform: translateY(-8px);
    }
}

// 类型差异化：状态图标着色 + 卡片底/边框染类型色
//（最低支持 Chrome 86 无 color-mix()，用 rgba(var(--dz-*-rgb), <alpha>) 等价表达，随深浅主题自适应）
.d-message--success {
    background: rgba(var(--dz-success-rgb), 0.1);
    border-color: rgba(var(--dz-success-rgb), 0.4);

    .d-message__icon { color: var(--dz-success); }
}

.d-message--error {
    background: rgba(var(--dz-danger-rgb), 0.1);
    border-color: rgba(var(--dz-danger-rgb), 0.4);

    .d-message__icon { color: var(--dz-danger); }
}

.d-message--warning {
    background: rgba(var(--dz-warning-rgb), 0.12);
    border-color: rgba(var(--dz-warning-rgb), 0.45);

    .d-message__icon { color: var(--dz-warning); }
}

.d-message--info {
    background: rgba(var(--dz-primary-rgb), 0.08);
    border-color: rgba(var(--dz-primary-rgb), 0.35);

    .d-message__icon { color: var(--dz-primary); }
}

@keyframes d-message-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

<!-- 容器为命令式创建，样式需全局（非 scoped） -->
<style lang="scss">
.d-message-container {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    pointer-events: none;
}
</style>
