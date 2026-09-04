<template>
    <div class="d-skeleton" :class="{ 'is-active': active }">
        <div v-if="avatar" class="d-skeleton__avatar" :class="{ 'is-square': avatar === 'square' }"></div>
        <div class="d-skeleton__body">
            <div v-if="title" class="d-skeleton__title"></div>
            <div
                v-for="(w, i) in rowWidths"
                :key="i"
                class="d-skeleton__row"
                :style="{ width: w }"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    /** 骨架行数 */
    rows?: number
    /** 动画效果 */
    active?: boolean
    /** 顶部标题骨架 */
    title?: boolean
    /** 头像骨架（true 圆形 / 'square' 方形） */
    avatar?: boolean | 'circle' | 'square'
}>(), {
    rows: 3,
    active: true,
    title: false,
    avatar: false,
})

// 每行宽度在 100% / 85% / 70% 间轮换，模拟真实排版
const rowWidths = computed(() => {
    const widths = ['100%', '85%', '70%']
    return Array.from({ length: props.rows }, (_, i) => widths[i % widths.length])
})
</script>

<style scoped lang="scss">
.d-skeleton {
    @include flex(flex-start, flex-start);
    gap: 16px;
    width: 100%;

    &__avatar {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        border-radius: 50%;
        background: var(--dz-bg-secondary);

        &.is-square {
            border-radius: 8px;
        }
    }

    &__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    &__title {
        height: 20px;
        width: 40%;
        border-radius: 4px;
        background: var(--dz-bg-secondary);
    }

    &__row {
        height: 14px;
        border-radius: 4px;
        background: var(--dz-bg-secondary);
    }

    .d-skeleton__avatar,
    .d-skeleton__title,
    .d-skeleton__row {
        position: relative;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            inset: 0;
            transform: translateX(-100%);
            background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--dz-bg) 60%, transparent), transparent);
        }
    }

    &.is-active {
        .d-skeleton__avatar,
        .d-skeleton__title,
        .d-skeleton__row {
            &::after {
                animation: dz-skeleton-shine 1.4s ease-in-out infinite;
            }
        }
    }
}

@keyframes dz-skeleton-shine {
    100% {
        transform: translateX(100%);
    }
}
</style>
