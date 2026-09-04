<template>
    <!-- 雪碧图注入：仅需在根组件渲染一次 -->
    <d-icon-sprite />

    <header class="app-header">
        <div class="app-header__brand">
            <span class="app-header__logo">
                <d-icon name="dz-icon-fd-book" size="1.35" />
            </span>
            <span class="app-header__name">Drizzol UI</span>
            <span class="app-header__version">v{{ version }}</span>
        </div>
        <button class="app-header__theme" :title="themeMeta.label" @click="cycleTheme">
            <d-icon :name="themeMeta.icon" size="1.4" />
        </button>
    </header>

    <div class="app-shell">
        <aside class="app-sidebar">
            <nav v-for="group in navGroups" :key="group.label" class="app-sidebar__group">
                <p class="app-sidebar__group-title">{{ group.label }}</p>
                <button
                    v-for="item in group.items"
                    :key="item.key + item.anchor"
                    :class="['app-sidebar__item', { 'is-active': active === item.key }]"
                    @click="goTo(item.key, item.anchor)"
                >
                    {{ item.label }}
                </button>
            </nav>
        </aside>

        <main class="app-main">
            <component :is="currentView" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { applyTheme, Theme, THEME_KEY } from '@drizzol/ui'
import Home from './views/home.vue'
import ThemeDemo from './views/theme-demo.vue'
import BasicDemo from './views/basic-demo.vue'
import AdvancedDemo from './views/advanced-demo.vue'

type ViewKey = 'home' | 'theme' | 'basic' | 'advanced'

interface NavItem {
    key: ViewKey
    label: string
    /** 页面内锚点（为空则不滚动） */
    anchor?: string
}

const navGroups: { label: string; items: NavItem[] }[] = [
    {
        label: '概况',
        items: [
            { key: 'home', label: '总览' },
            { key: 'theme', label: '主题色板' },
        ],
    },
    {
        label: '基础组件',
        items: [
            { key: 'basic', label: 'DCard 卡片', anchor: 'fc-dcard' },
            { key: 'basic', label: 'DButton 按钮', anchor: 'fc-dbutton' },
            { key: 'basic', label: 'DInput 输入框', anchor: 'fc-dinput' },
            { key: 'basic', label: 'DForm 表单', anchor: 'fc-dform' },
            { key: 'basic', label: 'DModal 弹窗', anchor: 'fc-dmodal' },
            { key: 'basic', label: 'DDropdown 下拉', anchor: 'fc-ddropdown' },
            { key: 'basic', label: 'DIcon 图标', anchor: 'fc-dicon' },
        ],
    },
    {
        label: '增强组件',
        items: [
            { key: 'advanced', label: 'DSearch 搜索', anchor: 'fc-dsearch' },
            { key: 'advanced', label: 'DSort 排序', anchor: 'fc-dsort' },
            { key: 'advanced', label: 'DFloatBar 浮动条', anchor: 'fc-dfloatbar' },
            { key: 'advanced', label: 'DPageHero 横幅', anchor: 'fc-dpagehero' },
            { key: 'advanced', label: 'DPageCover 封面', anchor: 'fc-dpagecover' },
            { key: 'advanced', label: 'DVideo 播放器', anchor: 'fc-dvideo' },
            { key: 'advanced', label: 'DCropper 裁剪', anchor: 'fc-dcropper' },
            { key: 'advanced', label: 'DUpload 上传', anchor: 'fc-dupload' },
        ],
    },
]

const views: Record<ViewKey, any> = {
    home: Home,
    theme: ThemeDemo,
    basic: BasicDemo,
    advanced: AdvancedDemo,
}

const version = '0.1.0'
const active = ref<ViewKey>('home')
const currentView = computed(() => views[active.value])

/** 切换视图并滚动到组件锚点 */
function goTo(key: ViewKey, anchor?: string) {
    active.value = key
    if (!anchor) {
        window.scrollTo({ top: 0 })
        return
    }
    nextTick(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
}

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
    padding: 0 16px 0 20px;
    background: var(--dz-bg-secondary);
    border-bottom: 1px solid var(--dz-border);

    &__brand {
        @include flex(flex-start, center);
        gap: 10px;
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
}

.app-shell {
    display: flex;
    min-height: calc(100vh - 56px);

    @include mobile {
        display: block;
    }
}

.app-sidebar {
    width: 224px;
    flex-shrink: 0;
    padding: 24px 12px 40px;
    border-right: 1px solid var(--dz-border);

    @include mobile {
        display: none;
    }

    &__group {
        margin-bottom: 20px;
    }

    &__group-title {
        margin: 0 10px 6px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 1px;
        color: var(--dz-text-l);
    }

    &__item {
        display: block;
        width: 100%;
        padding: 7px 10px;
        margin-bottom: 2px;
        border: none;
        border-radius: 6px;
        background: transparent;
        text-align: left;
        font-size: 0.875rem;
        color: var(--dz-text-d);
        cursor: pointer;
        transition: background 0.2s, color 0.2s;

        &:hover {
            color: var(--dz-primary);
        }

        &.is-active {
            background: var(--dz-primary-hover-2);
            color: var(--dz-primary);
            font-weight: 500;
        }
    }
}

.app-main {
    flex: 1;
    min-width: 0;
    padding: 28px 32px 60px;
    max-width: 1080px;

    @include mobile {
        padding: 20px 16px 48px;
    }
}
</style>
