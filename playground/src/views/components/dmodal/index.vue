<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DModal<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">弹窗组件：Teleport 到 body；过渡动画内建；maskClosable 控制点击遮罩关闭，footer 插槽自定义操作区。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-modal v-model:visible="visible" title="标题">内容</d-modal>'>
            <d-button type="primary" @click="modalVisible = true">打开弹窗</d-button>
            <d-modal v-model:visible="modalVisible" title="示例弹窗">
                弹窗内容区域，mask 点击可关闭。
                <template #footer>
                    <d-button @click="modalVisible = false">取消</d-button>
                    <d-button type="primary" @click="modalVisible = false">确定</d-button>
                </template>
            </d-modal>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const modalVisible = ref(false)
</script>
