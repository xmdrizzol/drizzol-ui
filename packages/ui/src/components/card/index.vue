<template>
    <div :class="cardClass">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = withDefaults(defineProps<{
    isHover?: boolean
}>(), {
    isHover: false
})

const cardClass = ref(['d-card'])
if (props.isHover) {
    cardClass.value.push('is-hover')
}

</script>

<style scoped lang="scss">
.d-card {
    background: var(--dz-bg);
    border: 1px solid var(--dz-border);
    border-radius: 12px;
    box-shadow: var(--dz-shadow-sm);
    padding: 1rem;

    &.is-hover {
        transition: all 0.4s;

        &:hover {
            transform: translate3d(0,-8px,0);
            box-shadow: var(--dz-shadow-md);
        }
    }

    &+&{
        margin-top: 20px;
    }
}
</style>