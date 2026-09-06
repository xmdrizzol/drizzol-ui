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
                <d-menu :groups="navGroups" :model-value="route.path" />
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
import { applyTheme, Theme, THEME_KEY } from '@xmdrizzol/drizzol-ui'

const route = useRoute()

const version = '0.2.0'

const navGroups: { label: string; items: { key: string; label: string; to: string }[] }[] = [
    {
        label: '概况',
        items: [
            { key: '/', label: '总览', to: '/' },
            { key: '/intro', label: '介绍', to: '/intro' },
            { key: '/theme', label: '主题色板', to: '/theme' },
            { key: '/utils', label: '工具函数', to: '/utils' },
            { key: '/utils/api', label: '网络·文件·存储', to: '/utils/api' },
        ],
    },
    {
        label: '布局',
        items: [
            { key: '/components/dlayout', label: 'DLayout 布局', to: '/components/dlayout' },
            { key: '/components/dgrid', label: 'DGrid 栅格', to: '/components/dgrid' },
        ],
    },
    {
        label: '导航',
        items: [
            { key: '/components/dmenu', label: 'DMenu 菜单', to: '/components/dmenu' },
            { key: '/components/dtabs', label: 'DTabs 标签页', to: '/components/dtabs' },
            { key: '/components/dpagination', label: 'DPagination 分页', to: '/components/dpagination' },
        ],
    },
    {
        label: '基础组件',
        items: [
            { key: '/components/dcard', label: 'DCard 卡片', to: '/components/dcard' },
            { key: '/components/dbutton', label: 'DButton 按钮', to: '/components/dbutton' },
            { key: '/components/dinput', label: 'DInput 输入框', to: '/components/dinput' },
            { key: '/components/dform', label: 'DForm 表单', to: '/components/dform' },
            { key: '/components/dformitem', label: 'DFormItem 表单项', to: '/components/dformitem' },
            { key: '/components/dmodal', label: 'DModal 弹窗', to: '/components/dmodal' },
            { key: '/components/ddrawer', label: 'DDrawer 抽屉', to: '/components/ddrawer' },
            { key: '/components/dmessage', label: 'DMessage 消息提示', to: '/components/dmessage' },
            { key: '/components/dnotification', label: 'DNotification 通知', to: '/components/dnotification' },
            { key: '/components/dconfirm', label: 'DConfirm 确认框', to: '/components/dconfirm' },
            { key: '/components/ddropdown', label: 'DDropdown 下拉', to: '/components/ddropdown' },
            { key: '/components/dicon', label: 'DIcon 图标', to: '/components/dicon' },
        ],
    },
    {
        label: '数据展示',
        items: [
            { key: '/components/dtag', label: 'DTag 标签', to: '/components/dtag' },
            { key: '/components/dbadge', label: 'DBadge 徽标', to: '/components/dbadge' },
            { key: '/components/dskeleton', label: 'DSkeleton 骨架屏', to: '/components/dskeleton' },
            { key: '/components/dempty', label: 'DEmpty 空状态', to: '/components/dempty' },
            { key: '/components/dcodeblock', label: 'DCodeBlock 代码块', to: '/components/dcodeblock' },
        ],
    },
    {
        label: '增强组件',
        items: [
            { key: '/components/dsearch', label: 'DSearch 搜索', to: '/components/dsearch' },
            { key: '/components/dsort', label: 'DSort 排序', to: '/components/dsort' },
            { key: '/components/dfloatbar', label: 'DFloatBar 浮动条', to: '/components/dfloatbar' },
            { key: '/components/dpagehero', label: 'DPageHero 横幅', to: '/components/dpagehero' },
            { key: '/components/dpagecover', label: 'DPageCover 封面', to: '/components/dpagecover' },
            { key: '/components/dvideo', label: 'DVideo 播放器', to: '/components/dvideo' },
            { key: '/components/dcropper', label: 'DCropper 裁剪', to: '/components/dcropper' },
            { key: '/components/dupload', label: 'DUpload 上传', to: '/components/dupload' },
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
        color: var(--dz-on-fill);
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

    // sticky 悬浮 + 独立滚动：页面保持原生滚动（DPageCover 视差、DFloatBar 返回顶部
    // 等组件依赖 window 滚动），侧边栏跟随顶栏固定、超出部分自带细滚动条
    &__sidebar {
        position: sticky;
        top: 56px;
        align-self: flex-start;
        width: 232px;
        flex-shrink: 0;
        height: calc(100vh - 56px);
        overflow-y: auto;
        padding: 20px 12px 40px;
        border-right: 1px solid var(--dz-border);
        @include scrollbars;

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
