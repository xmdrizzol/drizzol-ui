<template>
    <Teleport to="body">
        <Transition name="d-drawer" @after-enter="onOpened" @after-leave="onClosed">
            <div v-show="visible" class="d-drawer" :class="`d-drawer--${direction}`" role="dialog" aria-modal="true" :aria-label="title || '抽屉'">
                <div class="d-drawer__mask" @click="handleMaskClose"></div>
                <div class="d-drawer__panel" :style="panelStyle">
                    <header class="d-drawer__header">
                        <slot name="header">
                            <span class="d-drawer__title">{{ title }}</span>
                        </slot>
                        <button v-if="closable" class="d-drawer__close" aria-label="关闭" @click="handleClose">&times;</button>
                    </header>
                    <div class="d-drawer__body">
                        <slot :opened="opened"></slot>
                    </div>
                    <footer v-if="$slots.footer" class="d-drawer__footer">
                        <slot name="footer"></slot>
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts">
// 模块级：Esc 归属栈必须跨实例共享（嵌套时仅栈顶响应 Esc）
const escStack: number[] = []
let drawerSeq = 0
</script>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { pxToRem } from '@ui/utils/pxToRem'

const props = withDefaults(defineProps<{
    /** 是否可见（v-model:visible） */
    visible: boolean
    /** 标题（可用 header 插槽自定义） */
    title?: string
    /** 面板尺寸：rtl/ltr 为宽度，ttb/btt 为高度；数字按 px，字符串支持 '420px' 与 '30%' */
    size?: string | number
    /** 滑出方向：rtl 右侧（默认）/ ltr 左侧 / ttb 顶部 / btt 底部 */
    direction?: 'rtl' | 'ltr' | 'ttb' | 'btt'
    /** 是否显示关闭按钮 */
    closable?: boolean
    /** 点击遮罩是否关闭 */
    maskClosable?: boolean
    /** 关闭前回调（遮罩/Esc/×触发），调用 done() 才真正关闭；不传则直接关闭 */
    beforeClose?: (done: () => void) => void
}>(), {
    visible: false,
    title: '',
    size: '420px',
    direction: 'rtl',
    closable: true,
    maskClosable: true,
    beforeClose: undefined,
})

const emit = defineEmits<{
    'update:visible': [val: boolean]
    /** 开始打开 */
    open: []
    /** 开始关闭 */
    close: []
    /** 打开动画结束 */
    opened: []
    /** 关闭动画结束 */
    closed: []
}>()

const opened = ref()

// 本实例的归属令牌（模块计数器分配，跨实例唯一）
const drawerToken = ++drawerSeq

// 尺寸随方向映射宽/高；closed 态的滑出位移通过 CSS 变量交给过渡类。
// 百分比尺寸原样透传（pxToRem 只认像素语义）
const normalizeSize = (size: string | number) =>
    typeof size === 'string' && size.trim().endsWith('%') ? size.trim() : pxToRem(size)

const DIRECTION_FROM: Record<string, string> = {
    rtl: 'translateX(100%)',
    ltr: 'translateX(-100%)',
    ttb: 'translateY(-100%)',
    btt: 'translateY(100%)',
}

const panelStyle = computed(() => {
    const horizontal = props.direction === 'rtl' || props.direction === 'ltr'
    return {
        ...(horizontal ? { width: normalizeSize(props.size) } : { height: normalizeSize(props.size) }),
        '--dz-drawer-from': DIRECTION_FROM[props.direction] ?? 'translateX(100%)',
    }
})

// 遮罩/Esc/×统一走 requestClose：有 beforeClose 时由使用方决定何时 done()
function requestClose() {
    const done = () => {
        emit('update:visible', false)
        emit('close')
        opened.value = false
    }
    if (props.beforeClose) props.beforeClose(done)
    else done()
}

function handleClose() {
    requestClose()
}

function handleMaskClose() {
    if (props.maskClosable) requestClose()
}

// Escape 关闭：仅可见期间挂监听，避免常驻全局监听
function onKeydown(e: KeyboardEvent) {
    // 只有栈顶（最后打开）的抽屉响应 Esc
    if (e.key === 'Escape' && escStack[escStack.length - 1] === drawerToken) handleClose()
}

watch(() => props.visible, (val) => {
    console.log('DDW-WATCH', val, 'stack', escStack.length)
    if (val) {
        emit('open')
        escStack.push(drawerToken)
        document.addEventListener('keydown', onKeydown)
    } else {
        escStack.splice(escStack.indexOf(drawerToken), 1)
        document.removeEventListener('keydown', onKeydown)
    }
}, { immediate: true })

onBeforeUnmount(() => {
    escStack.splice(escStack.indexOf(drawerToken), 1)
    document.removeEventListener('keydown', onKeydown)
})

function onOpened() {
    opened.value = true
    emit('opened')
}

function onClosed() {
    opened.value = false
    emit('closed')
}
</script>

<style scoped lang="scss">
.d-drawer {
    @include fixed(0, 0, 0, 0);
    z-index: 2000;

    &__mask {
        @include absolute(0, 0, 0, 0);

        background: var(--dz-mask);
    }

    &__panel {
        @include absolute;

        display: flex;
        flex-direction: column;
        background: var(--dz-bg);
        box-shadow: var(--dz-shadow-lg);
    }

    // 四方向的贴边定位（尺寸在 panelStyle 内联：rtl/ltr 宽、ttb/btt 高）
    &--rtl .d-drawer__panel { top: 0; bottom: 0; right: 0; }
    &--ltr .d-drawer__panel { top: 0; bottom: 0; left: 0; }
    &--ttb .d-drawer__panel { top: 0; left: 0; right: 0; }
    &--btt .d-drawer__panel { bottom: 0; left: 0; right: 0; }

    &__header {
        @include flex(space-between, center);

        padding: 16px 20px;
        border-bottom: 1px solid var(--dz-border);
    }

    &__title {
        font-size: 1.0625rem;
        font-weight: 600;
        color: var(--dz-text-h);
    }

    &__close {
        border: none;
        background: none;
        padding: 0 4px;
        font-size: 22px;
        line-height: 1;
        color: var(--dz-text-l);
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
            color: var(--dz-text);
        }
    }

    &__body {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        color: var(--dz-text-d);
        font-size: 0.875rem;
        line-height: 1.7;
    }

    &__footer {
        @include flex(flex-end, center);

        gap: 12px;
        padding: 14px 20px;
        border-top: 1px solid var(--dz-border);
    }
}

.d-drawer-enter-active,
.d-drawer-leave-active {
    transition: opacity 0.25s ease;

    .d-drawer__panel {
        transition: transform 0.25s ease;
    }
}

.d-drawer-enter-from,
.d-drawer-leave-to {
    opacity: 0;

    .d-drawer__panel {
        // closed 位移由 --dz-drawer-from 按方向注入（rtl/ltr/ttb/btt 各不同）
        transform: var(--dz-drawer-from, translateX(100%));
    }
}
</style>
