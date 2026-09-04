<template>
    <div class="theme-demo">
        <h1 class="theme-demo__title">主题色板</h1>
        <p class="theme-demo__hint">点击右上角主题按钮切换 <code>浅色 / 深色 / 跟随系统</code>，色板与语义变量全部基于 <code>--dz-*</code> CSS 变量。</p>

        <section v-for="group in palettes" :key="group.name" class="theme-demo__section">
            <h2>{{ group.name }}</h2>
            <div class="theme-demo__grid">
                <div
                    v-for="n in 10"
                    :key="n"
                    class="theme-demo__item"
                    :style="{ background: `var(--${group.varName}-${n})` }"
                >
                    <span class="theme-demo__item-label">{{ `--${group.varName}-${n}` }}</span>
                    <span class="theme-demo__item-code"></span>
                </div>
            </div>
        </section>

        <section class="theme-demo__section">
            <h2>语义变量</h2>
            <ul class="theme-demo__list">
                <li v-for="name in semanticVars" :key="name" class="theme-demo__list-item">
                    <span class="theme-demo__swatch" :style="{ background: `var(${name})` }"></span>
                    <code class="theme-demo__var-name">{{ name }}</code>
                </li>
            </ul>
        </section>

        <section class="theme-demo__section">
            <h2>阴影与遮罩</h2>
            <div class="theme-demo__grid theme-demo__grid--shadows">
                <div
                    v-for="name in shadowVars"
                    :key="name"
                    class="theme-demo__shadow"
                    :style="{ boxShadow: `var(${name})` }"
                >
                    <code>{{ name }}</code>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
const palettes = [
    { name: 'Primary 色板（10 级）', varName: 'dz-primary' },
    { name: 'Gray 色板（10 级）', varName: 'dz-gray' },
]

const semanticVars = [
    '--dz-primary', '--dz-primary-hover', '--dz-primary-hover-2', '--dz-primary-active',
    '--dz-text-h', '--dz-text', '--dz-text-d', '--dz-text-l',
    '--dz-bg', '--dz-bg-secondary', '--dz-border', '--dz-code-bg',
    '--dz-link', '--dz-link-hover', '--dz-link-visited', '--dz-mask',
]

const shadowVars = [
    '--dz-shadow-sm', '--dz-shadow-md', '--dz-shadow-lg', '--dz-shadow-xl', '--dz-shadow-xxl',
]
</script>

<style scoped lang="scss">
.theme-demo {
    &__title {
        margin: 0 0 8px;
        color: var(--dz-text-h);
    }

    &__hint {
        margin: 0 0 24px;
        color: var(--dz-text-d);

        code {
            background: var(--dz-bg-secondary);
            padding: 2px 6px;
            border-radius: 4px;
        }
    }

    &__section {
        margin-bottom: 32px;

        h2 {
            margin: 0 0 12px;
            font-size: 1.125rem;
            color: var(--dz-text-h);
        }
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 8px;

        &--shadows {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
    }

    &__item {
        @include flex(center, flex-start);
        flex-direction: column;
        justify-content: flex-end;
        height: 72px;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid var(--dz-border);

        &-label {
            font-size: 0.72rem;
            padding: 2px 6px;
            border-radius: 4px;
            color: #fff;
            background: rgba(0, 0, 0, 0.45);
            text-shadow: none;
        }
    }

    &__list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 8px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    &__list-item {
        @include flex(flex-start, center);
        gap: 10px;
    }

    &__swatch {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        border: 1px solid var(--dz-border);
        flex-shrink: 0;
    }

    &__var-name {
        font-size: 0.8125rem;
        color: var(--dz-text-d);
    }

    &__shadow {
        height: 72px;
        border-radius: 8px;
        background: var(--dz-bg-secondary);
        @include flex(center, center);

        code {
            font-size: 0.75rem;
            color: var(--dz-text-l);
        }
    }
}
</style>
