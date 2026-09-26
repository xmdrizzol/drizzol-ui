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
            code="import { DProgress } from '@xmdrizzol/drizzol-ui'

const progress = ref(0)
const handle = DNotification({
  title: '文件上传',
  // 注意：不能直接 h(DProgress, { value: progress.value })——value 会固化为创建时的值；
  // 包一层渲染函数组件，DProgress 才能拿到最新进度
  message: h(ProgressComp),
  duration: 0,
})
// 上传完成后
handle.close()">
            <template #desc>
                <p class="demo-block__desc">
                    message 传渲染函数组件，内部读取响应式进度实时重渲染（正文就是
                    <code>d-progress</code>）；标题行走通知默认头部，走完自动调 <code>close()</code>。
                    要开箱即用的同款效果（含 ✕ 取消确认），直接用
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
import { DNotification, DProgress } from '@xmdrizzol/drizzol-ui'
import DemoBlock from '@/components/demo-block'

function plain() {
    DNotification({ title: '提示', message: '有一条新消息', type: 'info' })
}
function success() {
    DNotification({ title: '成功', message: '文件已保存', type: 'success' })
}

// 模拟上传：正文 = DProgress（渲染函数组件包一层保住响应式，直接 h(DProgress, { value: progress.value })
// 会把 value 固化为创建时的值）；进度实时更新，100% 后自动关闭
function showProgress() {
    const progress = ref(0)
    const timer = setInterval(() => {
        progress.value = Math.min(100, progress.value + 10)
        if (progress.value >= 100) {
            clearInterval(timer)
            setTimeout(() => handle.close(), 600)
        }
    }, 120)
    const handle = DNotification({
        title: '文件上传',
        message: h(defineComponent({ setup: () => () => h(DProgress, { value: progress.value, text: true }) })),
        duration: 0,
    })
}
</script>
