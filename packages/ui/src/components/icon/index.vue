<template>
    <svg aria-hidden="true" :width="size + 'rem'" :height="size + 'rem'">
        <use :xlink:href="`#dz-icon-${name}`" />
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    size: {
        type: [String, Number],
        default: 2
    }
})
</script>

<style scoped lang="scss">
svg {
    // Lucide 为描边图标：以 currentColor 描边、不填充，随主题文字色变化
    fill: none;
    stroke: currentColor;
    vertical-align: middle;
    display: inline-block;
    color: inherit;

    shape-rendering: geometricPrecision;

}
</style>