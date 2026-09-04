<template>
    <header class="d-header" :style="{ height: heightPx }">
        <slot />
    </header>
</template>

<script setup lang="ts">
import { computed, inject, onMounted } from 'vue'
import { LAYOUT_KEY } from './layout-key'

const props = withDefaults(defineProps<{
    /** 头高，数字为 px */
    height?: number | string
}>(), {
    height: 60,
})

const heightPx = computed(() => typeof props.height === 'number' ? props.height + 'px' : props.height)

const flags = inject<Record<string, boolean> | null>(LAYOUT_KEY, null)
onMounted(() => {
    if (flags) flags.header = true
})
</script>

<style scoped lang="scss">
.d-header {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 100%;
    padding: 0 20px;
    background: var(--dz-bg-secondary);
    border-bottom: 1px solid var(--dz-border);
    box-sizing: border-box;
}
</style>
