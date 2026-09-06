<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DButton<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">按钮组件：type / round / plain / link / block / size 六种形态，支持图标插槽。</p>
        </header>

        <demo-block title="类型" anchor-id="type"
            desc="default 中性 / primary 主色蓝 / success / warning / danger / info；plain 为淡底描边形态，hover 转实心。"
            code='<d-button>中性按钮</d-button>
<d-button type="primary">主要按钮</d-button>
<d-button type="success">成功按钮</d-button>
<d-button type="warning">警告按钮</d-button>
<d-button type="danger">危险按钮</d-button>
<d-button type="info">信息按钮</d-button>'>
            <d-button>中性按钮</d-button>
            <d-button type="primary">主要按钮</d-button>
            <d-button type="success">成功按钮</d-button>
            <d-button type="warning">警告按钮</d-button>
            <d-button type="danger">危险按钮</d-button>
            <d-button type="info">信息按钮</d-button>
        </demo-block>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-button type="primary" icon="add">主要按钮</d-button>
<d-button round>圆角按钮</d-button>
<d-button plain>朴素按钮</d-button>
<d-button link>链接按钮</d-button>'>
            <d-button type="primary">主要按钮</d-button>
            <d-button>默认按钮</d-button>
            <d-button type="primary" round>圆角按钮</d-button>
            <d-button plain>朴素按钮</d-button>
            <d-button link>链接按钮</d-button>
            <d-button type="primary" size="small">小按钮</d-button>
            <d-button type="primary" icon="add">带图标</d-button>
        </demo-block>

        <demo-block title="朴素与链接形态" anchor-id="plain-link"
            desc="plain / link 形态自动消费对应类型色。"
            code='<d-button type="success" plain>成功</d-button>
<d-button type="danger" link>删除</d-button>'>
            <d-button type="success" plain>成功</d-button>
            <d-button type="danger" plain>危险</d-button>
            <d-button type="primary" link>主要</d-button>
            <d-button type="danger" link>删除</d-button>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'
</script>
