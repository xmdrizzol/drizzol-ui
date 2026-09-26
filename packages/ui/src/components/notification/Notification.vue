<template>
    <div class="d-notification" :class="[`d-notification--${type}`, { 'is-leaving': leaving }, customClass]">
        <div class="d-notification__header">
            <DIcon :name="iconMap[type]" class="d-notification__icon" size="1.05" />
            <span v-if="title" class="d-notification__title">{{ title }}</span>
            <button v-if="showClose" class="d-notification__close" aria-label="关闭" @click="handleHeaderClose">&times;</button>
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
    /** 关闭前拦截：仅头部 ✕ 触发（程序化 close() 不经过）；返回 false 或 Promise reject 阻止关闭 */
    beforeClose?: () => boolean | Promise<boolean>
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
    // 幂等守卫：淡出途中重复 close（如上传通知 ✕ 确认放行后，宿主 catch 兜底再 close）
    // 若不清 startLeave 排下的销毁定时器、startLeave 又因 leaving 早退，emit('destroy') 永不触发，
    // 通知将以 opacity:0 永久占位，把后续通知顶下去
    if (leaving.value) return
    if (timer) clearTimeout(timer)
    startLeave()
}

/** 头部 ✕：传了 beforeClose 先拦截（返回 false 或 reject 阻止关闭），否则直接关闭 */
function handleHeaderClose() {
    if (!props.beforeClose) {
        close()
        return
    }
    Promise.resolve(props.beforeClose())
        .then((ok) => {
            if (ok !== false) close()
        })
        .catch(() => {
            // 拦截方内部失败（如确认框被取消）视为放弃关闭
        })
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

    // 类型差异化：tint-on-bg 不透明合成，等价于旧的 color-mix(X p%, var(--dz-bg))
    //（最低支持 Chrome 86 无 color-mix()；罩层若直接用半透明色会透出下层内容）
    &--success {
        @include tint-on-bg(--dz-success-rgb, 0.1, 0.4, var(--dz-shadow-md));
        .d-notification__icon { color: var(--dz-success); }
    }

    &--error {
        @include tint-on-bg(--dz-danger-rgb, 0.1, 0.4, var(--dz-shadow-md));
        .d-notification__icon { color: var(--dz-danger); }
    }

    &--warning {
        @include tint-on-bg(--dz-warning-rgb, 0.12, 0.45, var(--dz-shadow-md));
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
