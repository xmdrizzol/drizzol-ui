<template>
    <section class="d-page-hero">
        <!-- 封面插画偏亮，关闭组件白色遮罩，改用深色渐变保证文字可读 -->
        <d-page-cover v-if="cover" :src="cover" height="100%" :overlay-opacity="0" class="d-page-hero__cover" />

        <div class="d-page-hero__scrim"></div>

        <div class="d-page-hero__inner">
            <p class="d-page-hero__kicker">{{ en }}</p>
            <h1 class="d-page-hero__title">{{ title }}</h1>
            <p v-if="subtitle" class="d-page-hero__subtitle">{{ subtitle }}</p>
            <div v-if="$slots.action" class="d-page-hero__action">
                <slot name="action" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import DPageCover from '@ui/components/page-cover'

withDefaults(
    defineProps<{
        /** 页面标题 */
        title: string
        /** 标题上方的小字副标（英文，大写字距排版） */
        en: string
        /** 标题下方的一句话描述 */
        subtitle?: string
        /** 封面图地址（不传则只显示深色渐变遮罩） */
        cover?: string
        /** 横幅高度 */
        height?: string
    }>(),
    {
        subtitle: '',
        cover: '',
        height: '40vh'
    }
)
</script>

<style scoped lang="scss">
@use '@ui/styles/variables' as *;

.d-page-hero {
    position: relative;
    overflow: hidden;

    // 上移由宿主控制（透明顶栏场景设 CSS 变量 --dz-page-hero-margin-top）
    margin-top: var(--dz-page-hero-margin-top, 0);

    @include mobile {
        margin-top: var(--dz-page-hero-margin-top-mobile, var(--dz-page-hero-margin-top, 0));
    }

    // d-page-cover 作背景层铺满横幅
    &__cover {
        @include absolute(0, 0, 0, 0);
    }

    // 深色遮罩：底部最重，向上渐隐
    &__scrim {
        @include absolute(0, 0, 0, 0);
        z-index: 1;
        background: var(--dz-hero-scrim);
    }

    &__inner {
        position: relative;
        z-index: 2;
        min-height: max(320px, v-bind(height));
        max-width: 1100px;
        margin: 0 auto;
        padding: 56px 24px 48px;

        @include flex(flex-start, center);
        flex-direction: column;
        text-align: center;
        color: var(--dz-on-fill);

        @include mobile {
            min-height: 260px;
            padding: 44px 16px 36px;
        }
    }

    &__kicker {
        font-size: $fs-xs;
        letter-spacing: 8px;
        text-transform: uppercase;
        opacity: 0.8;

        @include fade-in(0.8s, $ease-out);
    }

    &__title {
        margin-top: $space-md;
        // 必须显式声明：全局排版给 h1~h6 设了 var(--dz-text-h)，元素选择器直接命中
        // 会压过 __inner 的继承，浅色主题下标题变成深灰、压在深色蒙版图片上不可读。
        // 文字压在恒定深色的 hero-scrim 上，跟随恒白的 --dz-on-fill（两主题同为 #fff）
        color: var(--dz-on-fill);
        font-size: clamp(2rem, 4.5vw, 3rem);
        font-weight: $fw-semibold;
        letter-spacing: 2px;
        // 最低支持 Chrome 86 无 color-mix()：原为 var(--dz-scrim-strong) 50% 罩，即该色的半透明
        //（亮 0.7×0.5=0.35 / 暗 0.75×0.5=0.375，统一取 0.35，暗色差 0.025 不可辨）
        text-shadow: 0 2px 16px rgba(var(--dz-scrim-strong-rgb), 0.35);

        @include fade-in(1s, $ease-out);
    }

    &__subtitle {
        margin-top: $space-sm;
        font-size: $fs-sm;
        opacity: 0.88;

        @include fade-in(1.2s, $ease-out);
    }

    &__action {
        @include flex(center, center);

        gap: $space-md;
        margin-top: 28px;

        @include fade-in(1.4s, $ease-out);
    }
}
</style>
