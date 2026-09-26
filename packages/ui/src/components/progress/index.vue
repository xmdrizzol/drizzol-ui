<template>
    <div
        class="d-progress"
        :class="[`d-progress--${status}`]"
        role="progressbar"
        :aria-valuemin="0"
        :aria-valuemax="100"
        :aria-valuenow="display"
    >
        <div class="d-progress__bar">
            <div class="d-progress__inner" :style="{ width: `${display}%` }"></div>
        </div>
        <div v-if="text" class="d-progress__text">
            <slot name="text" :value="display">{{ display }}%</slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    /** 进度值（0-100，超出范围自动收敛并取整） */
    value?: number
    /** 状态色（primary / success / warning / danger） */
    status?: 'primary' | 'success' | 'warning' | 'danger'
    /** 是否显示右侧百分比文本 */
    text?: boolean
}>(), {
    value: 0,
    status: 'primary',
    text: false,
})

/** 收敛后的展示值：宽度与百分比共用，transition 负责动画 */
const display = computed(() => Math.min(100, Math.max(0, Math.round(props.value))))
</script>

<style scoped lang="scss">
.d-progress {
    // 高度与配色均可被宿主按需覆盖（如 style="--dz-progress-height: 10px"）
    --dz-progress-fill: var(--dz-primary);

    display: flex;
    align-items: center;
    gap: 8px;

    &--success {
        --dz-progress-fill: var(--dz-success);
    }

    &--warning {
        --dz-progress-fill: var(--dz-warning);
    }

    &--danger {
        --dz-progress-fill: var(--dz-danger);
    }

    &__bar {
        flex: 1;
        height: var(--dz-progress-height, 0.375rem); // 默认 6px
        border-radius: 999px;
        background: var(--dz-progress-track, var(--dz-bg-secondary));
        overflow: hidden;
    }

    &__inner {
        display: block;
        height: 100%;
        border-radius: 999px;
        background: var(--dz-progress-fill);
        transition: width 0.15s;
    }

    &__text {
        flex-shrink: 0;
        font-family: var(--dz-ff-mono);
        font-size: 0.75rem;
        color: var(--dz-text-d);
        // 等宽数字：进度跳动时文本宽度不抖动
        font-variant-numeric: tabular-nums;
        min-width: 34px;
        text-align: right;
    }
}
</style>
