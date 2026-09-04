<template>
    <aside class="d-aside" :style="{ width: widthPx }">
        <slot />
    </aside>
</template>

<script setup lang="ts">
import { computed, inject, onMounted } from 'vue'
import { LAYOUT_KEY } from './layout-key'

const props = withDefaults(defineProps<{
    /** 侧栏宽，数字为 px */
    width?: number | string
}>(), {
    width: 300,
})

const widthPx = computed(() => typeof props.width === 'number' ? props.width + 'px' : props.width)

const flags = inject<Record<string, boolean> | null>(LAYOUT_KEY, null)
onMounted(() => {
    if (flags) flags.aside = true
})
</script>

<style scoped lang="scss">
.d-aside {
    flex-shrink: 0;
    overflow: auto;
    background: var(--dz-bg);
    border-right: 1px solid var(--dz-border);
    box-sizing: border-box;
}
</style>
