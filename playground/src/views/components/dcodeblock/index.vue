<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DCodeBlock<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">代码块：语言标识 + 一键复制（深色高亮风格，与正文深色代码块一致）；也接受默认插槽传入预高亮 HTML。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-code-block language="ts" :code="codeStr" />'>
            <div class="component-page__stack">
                <d-code-block language="ts" :code="demoCode" />
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'

const demoCode = [
    'import { createApp } from \'vue\'',
    "import DrizzolUi from '@drizzol/ui'",
    '',
    "const app = createApp(App)",
    'app.use(DrizzolUi) // 全量注册 d-* 组件',
].join('\n')
</script>

<style scoped lang="scss">
.component-page {
    &__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }
}
</style>
