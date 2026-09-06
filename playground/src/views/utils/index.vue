<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">工具函数<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">
                库随组件一并导出的工具与组合式函数，宿主可直接 <code>import &#123; … &#125; from '@xmdrizzol/drizzol-ui'</code>。
                本页演示纯函数、防抖/节流、主题与组合式函数；网络层（request/文件契约）另见 README。
            </p>
        </header>

        <!-- pxToRem / formatDate -->
        <demo-block title="pxToRem" anchor-id="pxtorem" desc="像素按 16 基准转 rem，接受 number 或带 px 的字符串。"
            code="import { pxToRem } from '@xmdrizzol/drizzol-ui'
pxToRem(24)      // '1.5rem'
pxToRem('40px')  // '2.5rem'">
            <div class="demo-block__stack utils-row">
                <d-input v-model="pxInput" placeholder="输入像素，如 24 或 40px" style="max-width: 260px" />
                <span class="utils-out">= {{ remResult }}</span>
            </div>
        </demo-block>

        <demo-block title="formatDate" anchor-id="formatdate" desc="UTC 字符串转本地 YYYY-MM-DD HH:mm，缺时缀按 UTC 解析，非法值原样返回。"
            code="import { formatDate } from '@xmdrizzol/drizzol-ui'
formatDate('2026-05-29T12:00:00')  // 本地时区格式化
formatDate('')                     // ''
formatDate('not-a-date')           // 'not-a-date'（原样）">
            <div class="demo-block__stack utils-row">
                <d-input v-model="dateInput" placeholder="2026-05-29T12:00:00" style="max-width: 320px" />
                <span class="utils-out">→ {{ formatted }}</span>
            </div>
        </demo-block>

        <!-- debounce / throttle -->
        <demo-block title="debounce / throttle" anchor-id="debounce"
            desc="快速点击对比：debounce 停止触发 delay 后只执行一次（immediate 则只首触发、不尾重复）；throttle 每 interval 至多一次。"
            code="import { debounce, throttle } from '@xmdrizzol/drizzol-ui'
const d = debounce(fn, 500)         // 尾部执行
const dLeading = debounce(fn, 500, true) // 仅首触发一次
const t = throttle(fn, 500)         // 每 500ms 至多一次
d.cancel()                          // 可取消">
            <div class="utils-dbwrap">
                <div class="utils-col">
                    <d-button type="primary" @click="onPlainClick">原始点击</d-button>
                    <span class="utils-count">触发 <b>{{ plainCount }}</b> 次</span>
                </div>
                <div class="utils-col">
                    <d-button @click="onDebouncedClick">debounce 500ms</d-button>
                    <span class="utils-count">执行 <b>{{ debouncedCount }}</b> 次</span>
                </div>
                <div class="utils-col">
                    <d-button @click="onThrottledClick">throttle 500ms</d-button>
                    <span class="utils-count">执行 <b>{{ throttledCount }}</b> 次</span>
                </div>
            </div>
        </demo-block>

        <!-- theme -->
        <demo-block title="theme" anchor-id="theme"
            desc="applyTheme 三态切换，只在 &lt;html&gt; 上 toggle dark 类、保留宿主其它类；结果持久化到 localStorage。"
            code="import { applyTheme, initTheme, watchSystemTheme, Theme } from '@xmdrizzol/drizzol-ui'
applyTheme(Theme.Dark)   // 'auto' | 'light' | 'dark'
initTheme()              // 启动时读取已存偏好，否则跟随系统
const stop = watchSystemTheme()  // auto 下随系统变化，返回销毁函数">
            <div class="demo-block__stack utils-row">
                <d-button v-for="opt in themeOptions" :key="opt.value"
                    :type="currentTheme === opt.value ? 'primary' : 'default'" @click="pickTheme(opt.value)">
                    {{ opt.label }}
                </d-button>
                <span class="utils-out">当前：{{ currentTheme }} · &lt;html&gt; class="{{ htmlClass }}"</span>
            </div>
        </demo-block>

        <!-- composables -->
        <demo-block title="useIsMobile" anchor-id="useismobile"
            desc="响应式移动端判定（innerWidth ≤ 768，随 resize 自动更新，卸载即解绑）。拖动窗口宽度可看变化。"
            code="import { useIsMobile } from '@xmdrizzol/drizzol-ui'
const isMobile = useIsMobile()  // Ref<boolean>，响应式">
            <div class="demo-block__stack utils-row">
                <span class="utils-out">isMobile =</span>
                <d-tag :type="isMobile ? 'warning' : 'success'">{{ isMobile ? 'true（窄屏）' : 'false（宽屏）' }}</d-tag>
                <span class="utils-hint">当前 innerWidth：{{ winWidth }}px</span>
            </div>
        </demo-block>

        <demo-block title="useInView" anchor-id="useinview"
            desc="元素进入视口时返回 true（仅首次）。滚动到下方让卡片进入视口即可点亮。"
            code="import { useInView } from '@xmdrizzol/drizzol-ui'
const boxRef = ref<HTMLElement | null>(null)
const inView = useInView(boxRef)  // 元素晚于挂载出现也能观察">
            <div class="demo-block__stack">
                <p class="utils-hint" style="margin: 0">向下滚动到本区末尾：</p>
                <div class="utils-spacer" aria-hidden="true">继续滚动 ↓</div>
                <div ref="inViewBox" class="utils-inview" :class="{ 'is-on': inView }">
                    {{ inView ? '已进入视口 ✓' : '尚未进入视口' }}
                </div>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
    pxToRem, formatDate, debounce, throttle,
    applyTheme, Theme,
    useIsMobile, useInView,
} from '@xmdrizzol/drizzol-ui'
import DemoBlock from '@/components/demo-block'

// pxToRem
const pxInput = ref('24')
const remResult = computed(() => {
    const v = pxInput.value.trim()
    if (!v) return '—'
    const n = Number(v.replace(/px$/i, ''))
    return Number.isFinite(n) ? pxToRem(v) : '非法输入'
})

// formatDate
const dateInput = ref('2026-05-29T12:00:00')
const formatted = computed(() => formatDate(dateInput.value))

// debounce / throttle：只在 setup 期创建一次，避免每次渲染重建
const plainCount = ref(0)
const debouncedCount = ref(0)
const throttledCount = ref(0)
const debounced = debounce(() => { debouncedCount.value++ }, 500)
const throttled = throttle(() => { throttledCount.value++ }, 500)
function onPlainClick() { plainCount.value++ }
function onDebouncedClick() { debounced() }
function onThrottledClick() { throttled() }

// theme
const themeOptions = [
    { value: Theme.Auto, label: '跟随系统' },
    { value: Theme.Light, label: '浅色' },
    { value: Theme.Dark, label: '深色' },
] as const
const currentTheme = ref<string>((localStorage.getItem('dz-theme') as string) || Theme.Auto)
const htmlClass = ref(document.documentElement.className)
function pickTheme(t: Theme) {
    applyTheme(t)
    currentTheme.value = t
    htmlClass.value = document.documentElement.className
}

// composables
const isMobile = useIsMobile()
const winWidth = ref(window.innerWidth)
function onWinResize() { winWidth.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', onWinResize))
onUnmounted(() => window.removeEventListener('resize', onWinResize))

const inViewBox = ref<HTMLElement | null>(null)
const inView = useInView(inViewBox)
</script>

<style scoped lang="scss">
.component-page__desc code,
.utils-hint code {
    padding: 1px 5px;
    border-radius: 4px;
    background: var(--dz-code-bg);
    font-family: var(--dz-ff-mono);
    font-size: 0.8125rem;
}

.utils-row {
    align-items: center;
    gap: 12px;
}

.utils-out {
    font-family: var(--dz-ff-mono);
    font-size: 0.875rem;
    color: var(--dz-text);
}

.utils-hint {
    color: var(--dz-text-l);
    font-size: 0.8125rem;
}

.utils-dbwrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 28px;
}

.utils-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
}

.utils-count {
    font-size: 0.8125rem;
    color: var(--dz-text-d);
}

.utils-spacer {
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dz-text-l);
    font-size: 0.8125rem;
}

.utils-inview {
    padding: 24px;
    border-radius: 12px;
    border: 1px solid var(--dz-border);
    background: var(--dz-bg);
    color: var(--dz-text-d);
    text-align: center;
    transition: background 0.3s, color 0.3s, border-color 0.3s;

    &.is-on {
        background: var(--dz-primary-hover-2);
        border-color: var(--dz-primary);
        color: var(--dz-primary);
    }
}
</style>
