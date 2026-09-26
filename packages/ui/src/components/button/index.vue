<template>
    <button type="button" :class="buttonClass">
        <d-icon class="icon" v-if="icon" :name="icon" :size="iconSize" />
        <span>
            <slot>按钮</slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DIcon from '../icon'

const TYPE = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const
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
    /** 类型（default 中性 / primary 主色蓝 / success / warning / danger / info） */
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

// computed 保证 props 动态变化时类名同步更新
const buttonClass = computed(() => [
    'd-button',
    `d-button--${props.type}`,
    {
        'is-link': props.link,
        'is-round': props.round,
        'is-block': props.block,
        'is-plain': props.plain,
        'is-small': props.size === 'small'
    }
])

</script>

<style scoped lang="scss">
.d-button {
    // 类型色变量：default 中性白、primary 蓝主色，其余类型由修饰类覆盖；
    // --dz-btn-color 供 plain / link 形态取前景色，--dz-btn-rgb 是其对应的 RGB 三元组
    //（最低支持 Chrome 86 无 color-mix()，浅底/描边用 rgba(var(--dz-btn-rgb), <alpha>) 等价表达）
    --dz-btn-bg: var(--dz-bg);
    --dz-btn-border: var(--dz-border);
    --dz-btn-text: var(--dz-text);
    --dz-btn-color: var(--dz-text);
    --dz-btn-rgb: var(--dz-gray-9-rgb);
    --dz-btn-bg-hover: var(--dz-primary-hover-2);
    --dz-btn-border-hover: var(--dz-primary);
    --dz-btn-text-hover: var(--dz-primary);

    @include flex(center, center);

    background: var(--dz-btn-bg);
    // 半透明描边要与页面底（= --dz-bg，原 color-mix 的混色对象）合成；
    // clip 到 padding-box 后描边下方不再压着自身底色，合成结果与 0.6.0 一致
    background-clip: padding-box;
    border: 1px solid var(--dz-btn-border);
    border-radius: 6px;
    color: var(--dz-btn-text);
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    // button 同样不继承父级字体
    font-family: inherit;
    font-size: 0.875rem;

    .icon {
        margin-right: 6px;
        color: inherit;
    }

    span {
        color: inherit;
    }

    &:hover {
        border-color: var(--dz-btn-border-hover);
        background-color: var(--dz-btn-bg-hover);
        color: var(--dz-btn-text-hover);
    }

    &.is-small {
        padding: 0.25rem 0.75rem;
    }
}

// 类型修饰：只翻转变量，形态样式（solid/plain/link）统一消费
.d-button--primary {
    --dz-btn-bg: var(--dz-primary);
    --dz-btn-border: var(--dz-primary);
    --dz-btn-text: var(--dz-on-fill);
    --dz-btn-color: var(--dz-primary);
    --dz-btn-rgb: var(--dz-primary-rgb);
    --dz-btn-bg-hover: var(--dz-primary-hover);
    --dz-btn-border-hover: var(--dz-primary-hover);
    --dz-btn-text-hover: var(--dz-on-fill);
}

.d-button--success {
    --dz-btn-bg: var(--dz-success);
    --dz-btn-border: var(--dz-success);
    --dz-btn-text: var(--dz-on-fill);
    --dz-btn-color: var(--dz-success);
    --dz-btn-rgb: var(--dz-success-rgb);
    --dz-btn-bg-hover: rgba(var(--dz-btn-rgb), 0.85);
    --dz-btn-border-hover: rgba(var(--dz-btn-rgb), 0.85);
    --dz-btn-text-hover: var(--dz-on-fill);
}

.d-button--warning {
    --dz-btn-bg: var(--dz-warning);
    --dz-btn-border: var(--dz-warning);
    --dz-btn-text: var(--dz-on-fill);
    --dz-btn-color: var(--dz-warning);
    --dz-btn-rgb: var(--dz-warning-rgb);
    --dz-btn-bg-hover: rgba(var(--dz-btn-rgb), 0.85);
    --dz-btn-border-hover: rgba(var(--dz-btn-rgb), 0.85);
    --dz-btn-text-hover: var(--dz-on-fill);
}

.d-button--danger {
    --dz-btn-bg: var(--dz-danger);
    --dz-btn-border: var(--dz-danger);
    --dz-btn-text: var(--dz-on-fill);
    --dz-btn-color: var(--dz-danger);
    --dz-btn-rgb: var(--dz-danger-rgb);
    --dz-btn-bg-hover: rgba(var(--dz-btn-rgb), 0.85);
    --dz-btn-border-hover: rgba(var(--dz-btn-rgb), 0.85);
    --dz-btn-text-hover: var(--dz-on-fill);
}

.d-button--info {
    --dz-btn-bg: var(--dz-gray-7);
    --dz-btn-border: var(--dz-gray-7);
    --dz-btn-text: var(--dz-on-fill);
    --dz-btn-color: var(--dz-gray-7);
    --dz-btn-rgb: var(--dz-gray-7-rgb);
    --dz-btn-bg-hover: rgba(var(--dz-btn-rgb), 0.85);
    --dz-btn-border-hover: rgba(var(--dz-btn-rgb), 0.85);
    --dz-btn-text-hover: var(--dz-on-fill);
}

.is-link {
    border: none;
    padding: 0.25rem;
    background: transparent;
    color: var(--dz-btn-color);

    // 纯文字形态：任何状态下都不带背景（覆盖基座 hover 的背景色）；
    // hover 文字色向底色轻微偏移，保留反馈又不至于过重
    &:hover {
        background: transparent;
        color: rgba(var(--dz-btn-rgb), 0.78);
    }
}

.is-round {
    border-radius: 99px;
}

.is-block {
    display: block;
    width: 100%;
}

// 朴素形态：类型色淡底 + 类型色描边/文字，hover 转实心
.is-plain {
    background: rgba(var(--dz-btn-rgb), 0.1);
    border-color: rgba(var(--dz-btn-rgb), 0.4);
    color: var(--dz-btn-color);

    &:hover {
        background: var(--dz-btn-bg);
        border-color: var(--dz-btn-border);
        color: var(--dz-btn-text);
    }
}
</style>
