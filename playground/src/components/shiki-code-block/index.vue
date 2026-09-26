<template>
    <!-- 直接具名引用库原始组件：全局的 d-code-block 已被本组件覆写，kebab-case 会递归到自己 -->
    <DCodeBlockLib v-bind="$attrs" :code="code" :language="language" :show-header="showHeader" :copyable="copyable">
        <span v-if="html" v-html="html"></span>
        <span v-else>{{ code }}</span>
    </DCodeBlockLib>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { DCodeBlock as DCodeBlockLib } from '@xmdrizzol/drizzol-ui'
import { highlightToHtml } from './highlighter'

/**
 * 文档站专用代码块：在库 DCodeBlock 之上叠加 Shiki 高亮。
 *
 * 为什么这样包一层：库产物不内置 Shiki（约数百 KB，不该由所有消费方承担），
 * DCodeBlock 的默认插槽接受预高亮 HTML——本组件负责产出它。props 与 DCodeBlock 对齐，
 * 在 main.ts 里以同名组件覆写注册后，演示页的 `<d-code-block>` 无感升级。
 */
defineOptions({ name: 'ShikiCodeBlock', inheritAttrs: false })

const props = withDefaults(defineProps<{
    /** 代码内容（与 DCodeBlock 对齐；复制按钮复制的就是它） */
    code?: string
    /** 语言标识（ts / vue / scss / css / bash…，同时决定 Shiki 语法） */
    language?: string
    /** 显示头部 */
    showHeader?: boolean
    /** 显示复制按钮 */
    copyable?: boolean
}>(), {
    code: '',
    language: '',
    showHeader: true,
    copyable: true,
})

const html = ref<string | null>(null)

watch(
    () => [props.code, props.language] as const,
    async ([code, language]) => {
        const result = await highlightToHtml(code, language)
        // 竞态保护：await 期间入参可能已变化，只落地最新一次的结果
        if (code === props.code && language === props.language) html.value = result
    },
    { immediate: true },
)
</script>
