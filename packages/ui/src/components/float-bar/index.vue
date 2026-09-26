<template>
    <div class="d-float-bar">
        <transition name="d-float-bar-fade">
            <div v-if="visible" class="d-float-bar__item" title="返回顶部" @click="scrollToTop">
                <d-icon name="arrow-dropup" size="1.25" />
            </div>
        </transition>
        <transition name="d-float-bar-fade">
            <div v-if="showCatalog" class="d-float-bar__item" :title="catalogTooltip" @click="$emit('catalog')">
                <d-icon name="menu" size="1.25" />
            </div>
        </transition>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DIcon from '@ui/components/icon'

const props = defineProps<{
    showCatalog?: boolean
    catalogTooltip?: string
    /** 滚动多少像素后显示返回顶部按钮（默认 400） */
    threshold?: number
}>()

defineEmits<{
    catalog: []
}>()

const visible = ref(false)

function onScroll() {
    visible.value = window.scrollY > (props.threshold ?? 400)
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped lang="scss">
.d-float-bar {
    @include fixed(null, 4%, 5%, null);

    // 悬浮按钮外观默认值，页面可按需用 CSS 变量覆盖（如 style="--dz-float-size: 56px"）
    // 默认实心主色：深浅主题下都与页面背景形成明确对比
    --dz-float-size: 44px;
    --dz-float-bg: var(--dz-primary);
    --dz-float-color: var(--dz-on-fill);
    --dz-float-border-color: transparent;
    --dz-float-shadow: var(--dz-shadow-md);

    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 999;

    &__item {
        width: var(--dz-float-size);
        height: var(--dz-float-size);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        // 最低支持 Chrome 86 无 color-mix()：hover 的"微亮一档"改用 12% 白罩层两层背景，
        // 与 color-mix(var(--dz-float-bg) 88%, #fff) 数值等价，对自定义底色/主题同样生效；
        // 基态保留一层同形透明罩层，hover 只改 alpha，过渡依旧平滑
        background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), var(--dz-float-bg);
        color: var(--dz-float-color);
        border: 1px solid var(--dz-float-border-color);
        box-shadow: var(--dz-float-shadow);
        cursor: pointer;
        transition: background 0.2s, color 0.2s, transform 0.2s, opacity 0.2s;

        // hover 微亮一档（对自定义底色同样生效），上浮提示可点击
        &:hover {
            background: linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)), var(--dz-float-bg);
            transform: translateY(-2px);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

.d-float-bar-fade-enter-active,
.d-float-bar-fade-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.d-float-bar-fade-enter-from {
    opacity: 0;
    transform: translateY(8px);
}

.d-float-bar-fade-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>
