<template>
    <div class="d-empty">
        <div class="d-empty__image">
            <d-icon :name="icon" size="3.5" />
        </div>
        <p class="d-empty__description">{{ description }}</p>
        <div v-if="$slots.default" class="d-empty__footer">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import DIcon from '@ui/components/icon'

withDefaults(defineProps<{
    /** 占位图标（裸名） */
    icon?: string
    /** 描述文字 */
    description?: string
}>(), {
    icon: 'article',
    description: '暂无数据',
})
</script>

<style scoped lang="scss">
.d-empty {
    @include flex(center, center);
    flex-direction: column;
    gap: 8px;
    padding: 40px 16px;
    width: 100%;
    box-sizing: border-box;

    &__image {
        color: var(--dz-text-l);
        opacity: 0.75;
    }

    &__description {
        margin: 4px 0 0;
        font-size: 0.875rem;
        color: var(--dz-text-l);
    }

    &__footer {
        margin-top: 12px;
    }
}
</style>
