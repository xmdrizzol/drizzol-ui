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
        position: absolute;
        inset: 0;
    }

    // 深色遮罩：底部最重，向上渐隐
    &__scrim {
        position: absolute;
        inset: 0;
        z-index: 1;
        background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.55) 0%,
            rgba(0, 0, 0, 0.28) 55%,
            rgba(0, 0, 0, 0.38) 100%
        );
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
        color: #fff;

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
        font-size: clamp(2rem, 4.5vw, 3rem);
        font-weight: $fw-semibold;
        letter-spacing: 2px;
        text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);

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
