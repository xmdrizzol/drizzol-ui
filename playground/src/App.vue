<template>
    <component :is="layout">
        <router-view />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/default'

const route = useRoute()

// 按路由 meta 切换布局（文档站当前只有默认布局，预留 empty 等）
const layout = computed(() => {
    return route.meta.layout === 'empty' ? null : DefaultLayout
})
</script>
