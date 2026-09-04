<template>
    <div class="d-page-cover" ref="coverRef" :style="coverStyle">
        <img class="d-page-cover__img" :style="imgStyle" :src="src" alt="cover" />
        <div class="d-page-cover__overlay"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScrollListener } from '@/composables/useScrollListen'

const props = withDefaults(defineProps<{
    src: string
    height?: string
    overlayOpacity?: number
}>(), {
    height: '50vh',
    overlayOpacity: 0.2,
})

const coverRef = ref<HTMLElement | null>(null)
const scrollRatio = ref(0)

const coverStyle = computed(() => ({
    height: props.height,
}))

const imgStyle = computed(() => ({
    objectPosition: `center ${scrollRatio.value * 100}%`,
}))

useScrollListener(() => {
    if (!coverRef.value) return
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const coverHeight = coverRef.value.clientHeight
    const ratio = scrollTop / coverHeight
    scrollRatio.value = ratio < 1 ? ratio : 1
})
</script>

<style scoped lang="scss">
.d-page-cover {
    position: relative;
    overflow: hidden;

    &__img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        opacity: v-bind(overlayOpacity);
        z-index: 1;
    }
}
</style>
