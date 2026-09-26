// 页面顶部加载进度条（nprogress 式命令式服务）
// 说明：本组件是非交互纯展示单例，直接用 DOM 操作而非 Vue 响应式——
// start 与 done 间隔常仅几毫秒，若走 Vue 异步批量渲染，起点（width:0）与终点
// （width:100%）会被合并成一次绘制，过渡无从发生，表现为"瞬间跳满"。
// 因此在起点处用强制回流（offsetHeight）提交初始布局，再改目标宽度，过渡才真实生效。
import { pxToRem } from '@ui/utils/pxToRem'
import './loading-bar.scss'

export interface LoadingBarOptions {
    /** 条高（px，默认 2） */
    height?: number
    /** 填充色（默认 var(--dz-primary)） */
    color?: string
    /**
     * 最短展示时长（ms，默认 400）：SPA 里加载经常瞬间完成，
     * done 早于此时长时延迟到凑满再淡出，并把该时长用作冲刺滑动的过渡窗口
     */
    minDuration?: number
}

let barEl: HTMLElement | null = null
let innerEl: HTMLElement | null = null
let startedAt = 0
let minDuration = 400
let fading = false
let trickleTimer: ReturnType<typeof setInterval> | null = null
let finishTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

function ensureMounted() {
    if (barEl) return
    barEl = document.createElement('div')
    barEl.className = 'd-loading-bar'
    barEl.style.display = 'none'
    // 默认外观必须在挂载时落地：路由钩子调用的是无参 start()，
    // 若仅在传 options 时才设高度，条会因 height:auto + 子元素 height:100% 坍缩为 0 高不可见
    barEl.style.height = pxToRem(2)
    barEl.style.background = 'var(--dz-primary)'
    innerEl = document.createElement('div')
    innerEl.className = 'd-loading-bar__inner'
    innerEl.style.width = '0%'
    barEl.appendChild(innerEl)
    document.body.appendChild(barEl)
}

function clearTimers() {
    if (trickleTimer) {
        clearInterval(trickleTimer)
        trickleTimer = null
    }
    if (finishTimer) {
        clearTimeout(finishTimer)
        finishTimer = null
    }
    if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
    }
}

/**
 * 页面顶部加载进度条（全局单例）：start 开始后自动缓慢自增（封顶 90%），
 * done 以剩余的最短展示时长为过渡窗口滑到 100% 再淡出——过程肉眼可见。
 * 重复 start 会重置重新开始；未 start 直接 done 安全收尾。
 *
 * @example
 * DLoadingBar.start()
 * fetchData().finally(() => DLoadingBar.done())
 */
export const DLoadingBar = {
    /** 开始加载（进行中重复调用会重置进度重新开始） */
    start(options?: LoadingBarOptions) {
        ensureMounted()
        const bar = barEl!
        const inner = innerEl!
        if (options?.height !== undefined) bar.style.height = pxToRem(options.height)
        if (options?.color !== undefined) bar.style.background = options.color
        if (options?.minDuration !== undefined) minDuration = options.minDuration
        clearTimers()
        fading = false
        bar.style.opacity = '1'
        bar.style.display = 'block'
        // 先以无过渡提交 display:block + width:0 的初始布局（强制回流），
        // 再改常规过渡——没有这一步，浏览器一次重排直接画到终点宽度，过程不可见
        inner.style.transition = 'none'
        inner.style.width = '0%'
        void bar.offsetHeight
        inner.style.transition = 'width 0.2s ease-out'
        startedAt = Date.now()
        // 自增封顶 90%：剩余进度留给 done() 冲刺，避免"假完成"
        trickleTimer = setInterval(() => {
            const current = parseInt(inner.style.width, 10) || 0
            inner.style.width = `${Math.min(90, current + Math.ceil(Math.random() * 4))}%`
        }, 250)
    },
    /** 直接设置进度（0-100，自动收敛） */
    set(n: number) {
        if (!innerEl) return
        innerEl.style.width = `${Math.min(100, Math.max(0, Math.round(n)))}%`
    },
    /** 完成加载：以剩余的最短展示时长为过渡窗口，让条从当前位置滑到 100% 再淡出 */
    done() {
        if (!barEl || !innerEl || barEl.style.display === 'none' || fading) return
        const bar = barEl
        const inner = innerEl
        clearTimers()
        const remaining = Math.max(200, minDuration - (Date.now() - startedAt))
        // 提交当前宽度为过渡起点，再滑向 100%
        void bar.offsetHeight
        inner.style.transition = `width ${remaining}ms ease-out`
        inner.style.width = '100%'
        finishTimer = setTimeout(() => {
            finishTimer = null
            fading = true
            bar.style.opacity = '0'
            hideTimer = setTimeout(() => {
                fading = false
                bar.style.display = 'none'
                inner.style.width = '0%'
                inner.style.transition = 'width 0.2s ease-out'
                hideTimer = null
            }, 400)
        }, remaining)
    },
}
