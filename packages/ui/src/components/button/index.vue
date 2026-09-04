<template>
    <button :class="buttonClass" ref="buttonRef">
        <d-icon class="icon" v-if="icon" :name="icon" :size="iconSize" />
        <span>
            <slot>按钮</slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DIcon from '../icon'

const TYPE = ['default', 'primary'] as const
type Type = typeof TYPE[number]
const props = withDefaults(defineProps<{
    /** 是否为链接 */
    link?: boolean,
    /** 是否为圆角 */
    round?: boolean
    /** 是否为块级元素 */
    block?: boolean,
    /** 是否为朴素按钮 */
    plain?: boolean,
    /** 类型 */
    type?: Type,
    /** 图标 */
    icon?: string,
    /** 图标尺寸 */
    iconSize?: number,
    /** 按钮尺寸 */
    size?: 'small' | 'default'
}>(), {
    link: false,
    round: false,
    block: false,
    plain: false,
    type: 'default',
    icon: '',
    iconSize: 1.025,
    size: 'default'
})
const buttonClass = ref(['d-button'])

// 当为链接时，添加d-button-link类
if (props.link) {
    buttonClass.value.push('is-link')
}
// 当为圆角时，添加is-round类
if (props.round) {
    buttonClass.value.push('is-round')
}
// 当为块级元素时，添加is-block类
if (props.block) {
    buttonClass.value.push('is-block')
}
// 当为朴素按钮时，添加is-plain类
if (props.plain) {
    buttonClass.value.push('is-plain')
}
// 当按钮尺寸为small时，添加m-button--small类
if (props.size === 'small') {
    buttonClass.value.push('d-button--small')
}

</script>

<style scoped lang="scss">
.d-button {
    @include flex(center, center);

    background: var(--dz-primary);
    border: 1px solid var(--dz-primary);
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    .icon {
        margin-right: 6px;

        color: white;
    }

    span {
        color: white;
    }

    &:hover {
        border-color: var(--dz-primary-hover);
        background-color: var(--dz-primary-hover);
    }

    &--small{
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
    }

}

.is-link {
    border: none;
    padding: 0.25rem;
    background-color: var(--dz-bg);

    .icon {
        color: var(--dz-text);
    }

    span {
        color: var(--dz-text);
    }

    &:hover {
        .icon {
            color: var(--dz-primary);
        }

        span {
            color: var(--dz-primary);
        }

        background: var(--dz-bg);
    }
}

.is-round {
    border-radius: 99px;
}

.is-block {
    display: block;
    width: 100%;
}

.is-plain {
    background: var(--dz-bg);
    border-color: var(--dz-border);

    span {
        color: var(--dz-text);
    }

    &:hover {
        border-color: var(--dz-primary-hover);
        background-color: var(--dz-primary-hover-2);

        span {
            color: var(--dz-primary);
        }
    }
}
</style>