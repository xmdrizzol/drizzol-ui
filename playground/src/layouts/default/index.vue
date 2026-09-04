<template>
    <div class="default-layout">
        <!-- 雪碧图注入：仅需在根组件渲染一次 -->
        <d-icon-sprite />

        <header class="default-layout__header">
            <div class="default-layout__brand">
                <router-link to="/" class="default-layout__link">
                    <span class="default-layout__logo">
                        <d-icon name="fd-book" size="1.35" />
                    </span>
                    <span class="default-layout__name">Drizzol UI</span>
                </router-link>
                <span class="default-layout__version">v{{ version }}</span>
            </div>
            <button class="default-layout__theme" :title="themeMeta.label" @click="cycleTheme">
                <d-icon :name="themeMeta.icon" size="1.4" />
            </button>
        </header>

        <div class="default-layout__shell">
            <aside class="default-layout__sidebar">
                <nav v-for="group in navGroups" :key="group.label" class="default-layout__nav-group">
                    <p class="default-layout__nav-title">{{ group.label }}</p>
                    <router-link
                        v-for="item in group.items"
                        :key="item.path"
                        :to="item.path"
                        class="default-layout__nav-item"
                        :class="{ 'is-active': route.path === item.path }"
                    >
                        {{ item.label }}
                    </router-link>
                </nav>
            </aside>

            <main class="default-layout__main">
                <router-view />
            </main>
        </div>

        <footer class="default-layout__footer">
            <span>Drizzol UI v{{ version }} · Vue 3 组件库</span>
            <span>组件、工具、样式与主题的统一基准</span>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { applyTheme, Theme, THEME_KEY } from '@drizzol/ui'

const route = useRoute()

const version = '0.1.0'

const navGroups: { label: string; items: { path: string; label: string }[] }[] = [
    {
        label: '概况',
        items: [
            { path: '/', label: '总览' },
            { path: '/theme', label: '主题色板' },
        ],
    },
    {
        label: '布局',
        items: [
            { path: '/components/dlayout', label: 'DLayout 布局' },
        ],
    },
    {
        label: '基础组件',
        items: [
            { path: '/components/dcard', label: 'DCard 卡片' },
            { path: '/components/dbutton', label: 'DButton 按钮' },
            { path: '/components/dinput', label: 'DInput 输入框' },
            { path: '/components/dform', label: 'DForm 表单' },
            { path: '/components/dformitem', label: 'DFormItem 表单项' },
            { path: '/components/dmodal', label: 'DModal 弹窗' },
            { path: '/components/ddropdown', label: 'DDropdown 下拉' },
            { path: '/components/dicon', label: 'DIcon 图标' },
        ],
    },
    {
        label: '增强组件',
        items: [
            { path: '/components/dsearch', label: 'DSearch 搜索' },
            { path: '/components/dsort', label: 'DSort 排序' },
            { path: '/components/dfloatbar', label: 'DFloatBar 浮动条' },
            { path: '/components/dpagehero', label: 'DPageHero 横幅' },
            { path: '/components/dpagecover', label: 'DPageCover 封面' },
            { path: '/components/dvideo', label: 'DVideo 播放器' },
            { path: '/components/dcropper', label: 'DCropper 裁剪' },
            { path: '/components/dupload', label: 'DUpload 上传' },
        ],
    },
]

// 主题三态轮转：auto → light → dark
const THEME_META: Record<string, { icon: string; label: string }> = {
    [Theme.Auto]: { icon: 'contrast', label: '主题：跟随系统' },
    [Theme.Light]: { icon: 'fd-sunny', label: '主题：浅色' },
    [Theme.Dark]: { icon: 'fd-moon', label: '主题：深色' },
}
const ORDER = [Theme.Auto, Theme.Light, Theme.Dark]

const themeState = ref<Theme>(readTheme())
const themeMeta = computed(() => THEME_META[themeState.value])

function readTheme(): Theme {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved && ORDER.includes(saved as Theme)) return saved as Theme
    return Theme.Auto
}

function cycleTheme() {
    themeState.value = ORDER[(ORDER.indexOf(themeState.value) + 1) % ORDER.length]
    applyTheme(themeState.value)
}
</script>

<style scoped lang="scss">
.default-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    &__header {
        position: sticky;
        top: 0;
        z-index: 100;
        @include flex(space-between, center);
        height: 56px;
        padding: 0 16px 0 20px;
        background: var(--dz-bg-secondary);
        border-bottom: 1px solid var(--dz-border);
    }

    &__brand {
        @include flex(flex-start, center);
        gap: 10px;
    }

    &__link {
        @include flex(flex-start, center);
        gap: 10px;
        text-decoration: none;
        color: inherit;
    }

    &__logo {
        @include flex(center, center);
        width: 30px;
        height: 30px;
        border-radius: 8px;
        background: var(--dz-primary);
        color: #fff;
    }

    &__name {
        font-size: 1.0625rem;
        font-weight: 600;
        color: var(--dz-text-h);
        letter-spacing: 0.5px;
    }

    &__version {
        padding: 1px 8px;
        border: 1px solid var(--dz-border);
        border-radius: 99px;
        font-size: 0.72rem;
        font-family: var(--dz-ff-mono);
        color: var(--dz-text-l);
        background: var(--dz-bg);
    }

    &__theme {
        @include flex(center, center);
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--dz-text);
        cursor: pointer;
        transition: background 0.2s, color 0.2s;

        &:hover {
            background: var(--dz-bg);
            color: var(--dz-primary);
        }
    }

    &__shell {
        flex: 1;
        display: flex;

        @include mobile {
            display: block;
        }
    }

    &__sidebar {
        width: 232px;
        flex-shrink: 0;
        padding: 20px 12px 40px;
        border-right: 1px solid var(--dz-border);

        @include mobile {
            display: none;
        }
    }

    &__nav-group {
        margin-bottom: 20px;
    }

    &__nav-title {
        margin: 0 10px 6px;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 1px;
        color: var(--dz-text-l);
    }

    &__nav-item {
        display: block;
        padding: 6px 10px;
        margin-bottom: 2px;
        border-radius: 6px;
        text-decoration: none;
        font-size: 0.8125rem;
        line-height: 1.4;
        color: var(--dz-text-d);
        transition: background 0.15s, color 0.15s;

        &:hover {
            color: var(--dz-primary);
            background: var(--dz-bg);
        }

        &.is-active {
            background: var(--dz-primary-hover-2);
            color: var(--dz-primary);
            font-weight: 500;
        }
    }

    &__main {
        flex: 1;
        min-width: 0;
        padding: 28px 32px 60px;
        max-width: 1080px;

        @include mobile {
            padding: 20px 16px 48px;
        }
    }

    &__footer {
        @include flex(space-between, center);
        gap: 12px;
        flex-wrap: wrap;
        padding: 20px 32px;
        border-top: 1px solid var(--dz-border);
        background: var(--dz-bg-secondary);
        font-size: 0.8125rem;
        color: var(--dz-text-l);
    }
}
</style>
