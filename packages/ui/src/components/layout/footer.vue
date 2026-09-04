<template>
    <footer class="d-footer" :style="{ height: heightPx }">
        <slot />
    </footer>
</template>

<script setup lang="ts">
import { computed, inject, onMounted } from 'vue'
import { LAYOUT_KEY } from './layout-key'

const props = withDefaults(defineProps<{
    /** 脚高，数字为 px */
    height?: number | string
}>(), {
    height: 60,
})

const heightPx = computed(() => typeof props.height === 'number' ? props.height + 'px' : props.height)

const flags = inject<Record<string, boolean> | null>(LAYOUT_KEY, null)
onMounted(() => {
    if (flags) flags.footer = true
})
</script>

<style scoped lang="scss">
.d-footer {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 100%;
    padding: 0 20px;
    background: var(--dz-bg-secondary);
    border-top: 1px solid var(--dz-border);
    box-sizing: border-box;
}
</style>
