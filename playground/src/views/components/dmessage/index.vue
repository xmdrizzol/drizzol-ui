<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DMessage<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">
                消息提示：顶部居中 toast，自动消失。命令式调用
                <code>DMessage.success/error/warning/info(text)</code>，返回句柄可手动关闭；样式随主题变量。
            </p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code="import { DMessage } from '@xmdrizzol/drizzol-ui'
DMessage.success('已保存')
DMessage.error('请求失败')
DMessage.warning('磁盘空间不足')
DMessage.info('有一条新消息')">
            <div class="component-page__row">
                <d-button type="success" @click="DMessage.success('已保存')">success</d-button>
                <d-button type="danger" @click="DMessage.error('请求失败')">error</d-button>
                <d-button type="warning" @click="DMessage.warning('磁盘空间不足')">warning</d-button>
                <d-button @click="DMessage.info('有一条新消息')">info</d-button>
            </div>
        </demo-block>

        <demo-block title="手动关闭" anchor-id="manual"
            desc="duration: 0 不自动消失，用返回的句柄 close() 关闭。"
            code="const handle = DMessage({ type: 'info', text: '处理中…', duration: 0 })
handle.close()">
            <div class="component-page__row">
                <d-button type="primary" @click="openSticky">打开常驻提示</d-button>
                <d-button :disabled="!stickyHandle" @click="closeSticky">关闭常驻提示</d-button>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DMessage } from '@xmdrizzol/drizzol-ui'
import DemoBlock from '@/components/demo-block'

// 常驻提示：duration 0 + 句柄手动关闭
const stickyHandle = ref(false)
let handle: { close: () => void } | null = null
function openSticky() {
    if (handle) return
    handle = DMessage({ type: 'info', text: '处理中…', duration: 0 })
    stickyHandle.value = true
}
function closeSticky() {
    handle?.close()
    handle = null
    stickyHandle.value = false
}
</script>
