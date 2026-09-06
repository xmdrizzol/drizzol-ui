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

// 类型差异化：状态图标着色 + 卡片底/边框染类型色（color-mix 随深浅主题自适应）
.d-message--success {
    background: color-mix(in srgb, var(--dz-success) 10%, var(--dz-bg));
    border-color: color-mix(in srgb, var(--dz-success) 40%, var(--dz-bg));

    .d-message__icon { color: var(--dz-success); }
}

.d-message--error {
    background: color-mix(in srgb, var(--dz-danger) 10%, var(--dz-bg));
    border-color: color-mix(in srgb, var(--dz-danger) 40%, var(--dz-bg));

    .d-message__icon { color: var(--dz-danger); }
}

.d-message--warning {
    background: color-mix(in srgb, var(--dz-warning) 12%, var(--dz-bg));
    border-color: color-mix(in srgb, var(--dz-warning) 45%, var(--dz-bg));

    .d-message__icon { color: var(--dz-warning); }
}

.d-message--info {
    background: color-mix(in srgb, var(--dz-primary) 8%, var(--dz-bg));
    border-color: color-mix(in srgb, var(--dz-primary) 35%, var(--dz-bg));

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
