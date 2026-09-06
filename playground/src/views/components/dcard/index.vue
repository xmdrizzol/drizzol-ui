<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DCard<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">容器基础组件：背景、边框、圆角、阴影全部由主题变量驱动；is-hover 开启悬浮上浮。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-card>内容</d-card>
<d-card is-hover>悬浮卡片</d-card>'>
            <d-card style="flex:1; min-width:240px">普通卡片</d-card>
            <d-card style="flex:1; min-width:240px" is-hover>悬浮卡片（hover 上浮）</d-card>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'
</script>
