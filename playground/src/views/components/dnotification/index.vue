<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DNotification<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">
                通知：右上角堆叠，正文支持文本或 VNode（可渲染进度条等动态内容）；
                <code>duration: 0</code> 常驻，返回句柄 <code>close()</code> 手动关闭。
            </p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code="import { DNotification } from '@xmdrizzol/drizzol-ui'
DNotification({ title: '提示', message: '有一条新消息', type: 'info' })">
            <div class="component-page__row">
                <d-button @click="plain">纯文本通知</d-button>
                <d-button type="primary" @click="success">成功通知（自动关闭）</d-button>
            </div>
        </demo-block>

        <demo-block title="VNode 正文（上传进度）" anchor-id="vnode"
            code="const progress = ref(0)
const handle = DNotification({
  title: '文件上传',
  message: h(ProgressComp), // 正文 = 进度条，内部读 progress
  duration: 0,
  showClose: false,
})
// 上传完成后
handle.close()">
            <template #desc>
                <p class="demo-block__desc">
                    message 传渲染函数组件，内部读取响应式进度实时重渲染；标题行走通知默认头部，正文只放进度条；
                    走完自动调 <code>close()</code>。要开箱即用的同款效果（含 ✕ 取消确认），直接用
                    <router-link to="/components/dupload">showUploadNotification</router-link>（见 DUpload 演示页）。
                </p>
            </template>
            <div class="component-page__row">
                <d-button type="primary" @click="showProgress">模拟上传通知</d-button>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { h, defineComponent, ref } from 'vue'
import { DNotification } from '@xmdrizzol/drizzol-ui'
import DemoBlock from '@/components/demo-block'

function plain() {
    DNotification({ title: '提示', message: '有一条新消息', type: 'info' })
}
function success() {
    DNotification({ title: '成功', message: '文件已保存', type: 'success' })
}

// 模拟上传：标题行走通知默认头部，正文只放进度条；进度实时更新，100% 后自动关闭
function showProgress() {
    const progress = ref(0)
    const body = () => h('div', { class: 'dfb-progress' }, [
        h('div', { class: 'dfb-progress__bar' }, [
            h('div', { class: 'dfb-progress__inner', style: { width: `${progress.value}%` } }),
        ]),
        h('span', { class: 'dfb-progress__text' }, `${progress.value}%`),
    ])
    const timer = setInterval(() => {
        progress.value = Math.min(100, progress.value + 10)
        if (progress.value >= 100) {
            clearInterval(timer)
            setTimeout(() => handle.close(), 600)
        }
    }, 120)
    const handle = DNotification({
        title: '文件上传',
        message: h(defineComponent({ setup: () => () => body() })),
        duration: 0,
        showClose: false,
    })
}
</script>

<!-- 进度条样式：通知为命令式渲染，需全局 -->
<style lang="scss">
.dfb-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 260px;
}

.dfb-progress__bar {
    flex: 1;
    height: 6px;
    border-radius: 99px;
    background: var(--dz-bg-secondary);
    overflow: hidden;
}

.dfb-progress__inner {
    height: 100%;
    border-radius: 99px;
    background: var(--dz-primary);
    transition: width 0.12s linear;
}

.dfb-progress__text {
    font-family: var(--dz-ff-mono);
    font-size: 0.75rem;
    color: var(--dz-text-d);
    min-width: 34px;
    text-align: right;
}
</style>
