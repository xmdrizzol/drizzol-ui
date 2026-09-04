<template>
    <!-- 雪碧图注入：仅需在根组件渲染一次 -->
    <d-icon-sprite />

    <header class="app-header">
        <span class="app-header__brand">Drizzol UI</span>
        <nav class="app-header__nav">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                :class="['app-header__tab', { 'is-active': active === tab.key }]"
                @click="active = tab.key"
            >
                {{ tab.label }}
            </button>
        </nav>
        <button class="app-header__theme" :title="themeMeta.label" @click="cycleTheme">
            <d-icon :name="themeMeta.icon" size="1.4" />
        </button>
    </header>

    <main class="app-main">
        <component :is="currentView" />
    </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { applyTheme, Theme, THEME_KEY } from '@drizzol/ui'
import Home from './views/home.vue'
import ThemeDemo from './views/theme-demo.vue'
import BasicDemo from './views/basic-demo.vue'
import AdvancedDemo from './views/advanced-demo.vue'

type ViewKey = 'home' | 'theme' | 'basic' | 'advanced'

const tabs: { key: ViewKey; label: string }[] = [
    { key: 'home', label: '总览' },
    { key: 'theme', label: '主题色板' },
    { key: 'basic', label: '基础组件' },
    { key: 'advanced', label: '增强组件' },
]

const views: Record<ViewKey, any> = {
    home: Home,
    theme: ThemeDemo,
    basic: BasicDemo,
    advanced: AdvancedDemo,
}

const active = ref<ViewKey>('home')
const currentView = computed(() => views[active.value])

// 主题三态轮转：auto → light → dark
const THEME_META: Record<string, { icon: string; label: string }> = {
    [Theme.Auto]: { icon: 'dz-icon-contrast', label: '主题：跟随系统' },
    [Theme.Light]: { icon: 'dz-icon-fd-sunny', label: '主题：浅色' },
    [Theme.Dark]: { icon: 'dz-icon-fd-moon', label: '主题：深色' },
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
.app-header {
    position: sticky;
    top: 0;
    z-index: 100;
    @include flex(space-between, center);
    height: 56px;
    padding: 0 24px;
    background: var(--dz-bg-secondary);
    border-bottom: 1px solid var(--dz-border);

    &__brand {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--dz-text-h);
        letter-spacing: 1px;
    }

    &__nav {
        @include flex(flex-start, center);
        gap: 4px;
    }

    &__tab {
        padding: 6px 14px;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: var(--dz-text-d);
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            color: var(--dz-primary);
        }

        &.is-active {
            background: var(--dz-primary-hover-2);
            color: var(--dz-primary);
        }
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
        transition: background 0.2s;

        &:hover {
            background: var(--dz-bg);
        }
    }
}

.app-main {
    max-width: 1080px;
    margin: 0 auto;
    padding: 24px;
}
</style>
