<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DCodeBlock<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">代码块：语言标识 + 一键复制（深色高亮风格，与正文深色代码块一致）；也接受默认插槽传入预高亮 HTML。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-code-block language="ts" :code="codeStr" />'>
            <div class="component-page__stack">
                <d-code-block language="ts" :code="demoCode" />
            </div>
        </demo-block>

        <demo-block title="配合 Shiki 预高亮" anchor-id="shiki"
            desc="库产物不内置 Shiki（数百 KB，不该由所有消费方承担）：DCodeBlock 的默认插槽接受任意预高亮 HTML，code 照常传给复制按钮。下面的示例就是宿主自行引入 Shiki 后经插槽传入的效果（与演示站自身代码块的高亮同源）。"
            :code="shikiDoc">
            <div class="component-page__stack">
                <DCodeBlockRaw language="ts" :code="demoCode">
                    <span v-html="highlightedHtml"></span>
                </DCodeBlockRaw>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DemoBlock from '@/components/demo-block'
// 局部以 PascalCase 引入库原始组件：模板里的 <d-code-block> 已被演示站全局覆写为
// 带 Shiki 的包装版，这里要演示"库本体 + 插槽"的原始行为，故直接具名导入
import { DCodeBlock as DCodeBlockRaw } from '@xmdrizzol/drizzol-ui'
import { highlightToHtml } from '@/components/shiki-code-block/highlighter'

const demoCode = [
    'import { createApp } from \'vue\'',
    "import DrizzolUi from '@xmdrizzol/drizzol-ui'",
    '',
    "const app = createApp(App)",
    'app.use(DrizzolUi) // 全量注册 d-* 组件',
].join('\n')

// 宿主集成示例：自行引入 Shiki 高亮为 span + 内联色值，经默认插槽传入
const highlightedHtml = ref('')
onMounted(async () => {
    highlightedHtml.value = (await highlightToHtml(demoCode, 'ts')) ?? ''
})

const shikiDoc = `// npm i shiki（宿主自行引入）
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const highlighter = await createHighlighterCore({
  themes: [import('@shikijs/themes/dark-plus')],   // 与代码块恒定深色同源
  langs: [import('@shikijs/langs/typescript')],
  engine: createJavaScriptRegexEngine({ forgiving: true }),   // 纯 JS 引擎，免 WASM
})

// codeToTokens 按行返回 token，逐行渲染 span（完整实现见演示站 shiki-code-block 组件）
const { tokens } = highlighter.codeToTokens(code, { lang: 'ts', theme: 'dark-plus' })
const html = tokens
  .map(line => line.map(t => \`<span style="color:\${t.color}">\${escapeHtml(t.content)}</span>\`).join(''))
  .join('\\n')

// 预高亮 HTML 放进默认插槽；code 仍要传，供复制按钮使用
// <d-code-block language="ts" :code="code"><span v-html="html" /></d-code-block>`
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
