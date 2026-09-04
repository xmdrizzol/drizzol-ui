<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DButton<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">按钮组件：type / round / plain / link / block / size 六种形态，支持图标插槽。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-button type="primary" icon="dz-icon-add">主要按钮</d-button>
<d-button round>圆角按钮</d-button>
<d-button plain>朴素按钮</d-button>
<d-button link>链接按钮</d-button>'>
            <d-button type="primary">主要按钮</d-button>
            <d-button>默认按钮</d-button>
            <d-button type="primary" round>圆角按钮</d-button>
            <d-button plain>朴素按钮</d-button>
            <d-button link>链接按钮</d-button>
            <d-button type="primary" size="small">小按钮</d-button>
            <d-button type="primary" icon="dz-icon-add">带图标</d-button>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'
</script>
