<template>
    <PhotoProvider v-bind="$attrs">
        <slot />
    </PhotoProvider>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { PhotoProvider } from 'vue-photo-preview-next'
import { D_IMAGE_GROUP_KEY } from './context'

// PhotoProvider 根是 Fragment，属性无法自动透传：关闭自动继承后手动绑定
defineOptions({ name: 'DImageGroup', inheritAttrs: false })

// 标记分组作用域：内部 DImage 检测到后不再自带 Provider，点击并入本分组的预览
// （mask-closable、loop、hide-counter、hide-operate 等参数原样透传给预览器）
provide(D_IMAGE_GROUP_KEY, true)
</script>
