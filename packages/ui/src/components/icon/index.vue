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
    fill: currentColor;
    vertical-align: middle;
    display: inline-block;
    color: inherit;

    shape-rendering: geometricPrecision;

}
</style>