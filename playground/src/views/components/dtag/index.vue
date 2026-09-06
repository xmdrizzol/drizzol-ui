<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DTag<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">语义标签：default / primary / success / warning / danger / info，支持 round / small / closable。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-tag type="success">已发布</d-tag>
<d-tag type="warning" round>草稿</d-tag>
<d-tag type="danger" closable @close="...">删除</d-tag>'>
            <d-tag>默认</d-tag>
            <d-tag type="primary">主要</d-tag>
            <d-tag type="success">成功</d-tag>
            <d-tag type="warning">警告</d-tag>
            <d-tag type="danger">危险</d-tag>
            <d-tag type="info">信息</d-tag>
            <d-tag type="primary" round>胶囊</d-tag>
            <d-tag type="success" size="small">小号</d-tag>
            <d-tag type="danger" closable @close="tagClosed = true">
                {{ tagClosed ? '已关闭' : '可关闭' }}
            </d-tag>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const tagClosed = ref(false)
</script>
