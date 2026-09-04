<template>
    <!-- 雪碧图注入：仅需在根组件渲染一次 -->
    <d-icon-sprite />

    <header class="app-header">
        <div class="app-header__brand">
            <router-link to="/" class="app-header__link">
                <span class="app-header__logo">
                    <d-icon name="dz-icon-fd-book" size="1.35" />
                </span>
                <span class="app-header__name">Drizzol UI</span>
            </router-link>
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
                <router-link
                    v-for="item in group.items"
                    :key="item.path + (item.hash || '')"
                    :to="{ path: item.path, hash: item.hash || undefined }"
                    custom
                    v-slot="{ navigate }"
                >
                    <a
                        class="app-sidebar__item"
                        :class="{ 'is-active': isActive(item) }"
                        @click="navigate"
                    >
                        {{ item.label }}
                    </a>
                </router-link>
            </nav>
        </aside>

        <main class="app-main">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { applyTheme, Theme, THEME_KEY } from '@drizzol/ui'

const route = useRoute()

interface NavItem {
    path: string
    hash?: string
    label: string
}

const navGroups: { label: string; items: NavItem[] }[] = [
    {
        label: '概况',
        items: [
            { path: '/', label: '总览' },
            { path: '/theme', label: '主题色板' },
        ],
    },
    {
        label: '基础组件',
        items: [
            { path: '/components/basic', hash: '#fc-dcard', label: 'DCard 卡片' },
            { path: '/components/basic', hash: '#fc-dbutton', label: 'DButton 按钮' },
            { path: '/components/basic', hash: '#fc-dinput', label: 'DInput 输入框' },
            { path: '/components/basic', hash: '#fc-dform', label: 'DForm 表单' },
            { path: '/components/basic', hash: '#fc-dmodal', label: 'DModal 弹窗' },
            { path: '/components/basic', hash: '#fc-ddropdown', label: 'DDropdown 下拉' },
            { path: '/components/basic', hash: '#fc-dicon', label: 'DIcon 图标' },
        ],
    },
    {
        label: '增强组件',
        items: [
            { path: '/components/advanced', hash: '#fc-dsearch', label: 'DSearch 搜索' },
            { path: '/components/advanced', hash: '#fc-dsort', label: 'DSort 排序' },
            { path: '/components/advanced', hash: '#fc-dfloatbar', label: 'DFloatBar 浮动条' },
            { path: '/components/advanced', hash: '#fc-dpagehero', label: 'DPageHero 横幅' },
            { path: '/components/advanced', hash: '#fc-dpagecover', label: 'DPageCover 封面' },
            { path: '/components/advanced', hash: '#fc-dvideo', label: 'DVideo 播放器' },
            { path: '/components/advanced', hash: '#fc-dcropper', label: 'DCropper 裁剪' },
            { path: '/components/advanced', hash: '#fc-dupload', label: 'DUpload 上传' },
        ],
    },
]

/** 逐项匹配：path 一致且（带 hash 的条目需 hash 一致，不带 hash 的条目要求无 hash） */
function isActive(item: NavItem): boolean {
    if (route.path !== item.path) return false
    if (item.hash) return route.hash === item.hash
    return !route.hash
}

// 路由变化后滚动到锚点（或回顶）
watch(
    () => route.fullPath,
    async () => {
        await nextTick()
        if (route.hash) {
            document.getElementById(route.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
            window.scrollTo({ top: 0 })
        }
    },
    { immediate: true }
)

const version = '0.1.0'

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

    &__link {
        @include flex(flex-start, center);
        gap: 10px;
        text-decoration: none;
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
    width: 232px;
    flex-shrink: 0;
    padding: 20px 12px 40px;
    border-right: 1px solid var(--dz-border);

    @include mobile {
        display: none;
    }

    &__group {
        margin-bottom: 20px;
    }

    &__group-title {
        margin: 0 10px 6px;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 1px;
        color: var(--dz-text-l);
    }

    &__item {
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
