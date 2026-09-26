// 页面顶部加载进度条（nprogress 式命令式服务）：start 开始自增，done 冲刺收尾
// 样式为全局（渲染在 body，同 confirm.scss 做法）
import { createVNode, defineComponent, h, ref, render, type VNode } from 'vue'
import { pxToRem } from '@ui/utils/pxToRem'
import './loading-bar.scss'

export interface LoadingBarOptions {
    /** 条高（px，默认 2） */
    height?: number
    /** 填充色（默认 var(--dz-primary)） */
    color?: string
}

const visible = ref(false)
const fading = ref(false)
const percent = ref(0)
const height = ref(2)
const color = ref('var(--dz-primary)')

let host: HTMLElement | null = null
let vnode: VNode | null = null
let trickleTimer: ReturnType<typeof setInterval> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const LoadingBarComp = defineComponent({
    setup() {
        return () => h('div', {
            class: 'd-loading-bar',
            style: {
                display: visible.value ? 'block' : 'none',
                opacity: fading.value ? '0' : '1',
                height: pxToRem(height.value),
                background: color.value,
            },
        }, [
            h('div', { class: 'd-loading-bar__inner', style: { width: `${percent.value}%` } }),
        ])
    },
})

function ensureMounted() {
    if (host) return
    host = document.createElement('div')
    document.body.appendChild(host)
    vnode = createVNode(LoadingBarComp)
    render(vnode, host)
}

function clearTrickle() {
    if (trickleTimer) {
        clearInterval(trickleTimer)
        trickleTimer = null
    }
}

/**
 * 页面顶部加载进度条（全局单例）：start 开始后自动缓慢自增（封顶 90%），
 * done 冲刺到 100% 并淡出。重复 start 不会叠加；done 未 start 时安全收尾。
 *
 * @example
 * DLoadingBar.start()
 * fetchData().finally(() => DLoadingBar.done())
 */
export const DLoadingBar = {
    /** 开始加载（已在进行中则忽略） */
    start(options?: LoadingBarOptions) {
        ensureMounted()
        if (options?.height !== undefined) height.value = options.height
        if (options?.color !== undefined) color.value = options.color
        if (hideTimer) {
            clearTimeout(hideTimer)
            hideTimer = null
        }
        // 已在进行中（未进入淡出）则忽略重复 start
        if (visible.value && !fading.value) return
        clearTrickle()
        fading.value = false
        visible.value = true
        percent.value = 0
        // 自增封顶 90%：剩余进度留给 done() 冲刺，避免"假完成"
        trickleTimer = setInterval(() => {
            percent.value = Math.min(90, percent.value + Math.ceil(Math.random() * 4))
        }, 250)
    },
    /** 直接设置进度（0-100，自动收敛） */
    set(n: number) {
        if (!visible.value) return
        percent.value = Math.min(100, Math.max(0, Math.round(n)))
    },
    /** 完成加载：冲刺到 100% 后淡出隐藏 */
    done() {
        if (!visible.value) return
        clearTrickle()
        percent.value = 100
        fading.value = true
        hideTimer = setTimeout(() => {
            visible.value = false
            fading.value = false
            percent.value = 0
            hideTimer = null
        }, 400)
    },
}
