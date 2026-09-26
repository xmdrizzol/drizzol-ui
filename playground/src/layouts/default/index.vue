<template>
    <d-layout class="default-layout">
        <!-- 雪碧图注入：仅需在根组件渲染一次 -->
        <d-icon-sprite />

        <d-header fixed class="default-layout__header">
            <div class="default-layout__brand">
                <router-link to="/" class="default-layout__link">
                    <span class="default-layout__logo">
                        <d-icon name="fd-book" size="1.35" />
                    </span>
                    <span class="default-layout__name">Drizzol UI</span>
                </router-link>
                <span class="default-layout__version">v{{ version }}</span>
            </div>
            <div class="default-layout__actions">
                <a v-for="ext in externalLinks" :key="ext.name" class="default-layout__action"
                    :href="ext.href" target="_blank" rel="noopener"
                    :aria-label="ext.name" :title="ext.name">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path fill="currentColor" :d="ext.path" /></svg>
                </a>
                <button class="default-layout__theme" :title="themeMeta.label" @click="cycleTheme">
                    <d-icon :name="themeMeta.icon" size="1.4" />
                </button>
                <!-- 移动端导航入口：侧栏在窄屏隐藏后由此打开抽屉菜单 -->
                <button class="default-layout__nav" title="导航菜单" aria-label="打开导航菜单" @click="navOpen = true">
                    <d-icon name="menu" size="1.4" />
                </button>
            </div>
        </d-header>

        <d-layout class="default-layout__shell">
            <d-aside fixed :width="232" class="default-layout__sidebar">
                <d-menu :groups="navGroups" :model-value="route.path" />
            </d-aside>

            <d-main class="default-layout__main">
                <router-view />
            </d-main>
        </d-layout>

        <d-footer height="auto" class="default-layout__footer">
            <span>Drizzol UI v{{ version }} · Vue 3 组件库</span>
            <span>组件、工具、样式与主题的统一基准</span>
        </d-footer>

        <!-- 移动端导航抽屉：与桌面侧栏共用 navGroups，选中后自动收起；
             GitHub/npm 在窄屏从头栏收进抽屉标题栏，保证移动端仍可直达仓库 -->
        <d-drawer v-model:visible="navOpen" title="导航菜单" direction="ltr" :size="280">
            <template #header>
                <span class="default-layout__drawer-title">导航菜单</span>
                <span class="default-layout__drawer-links">
                    <a v-for="ext in externalLinks" :key="ext.name" class="default-layout__drawer-link"
                        :href="ext.href" target="_blank" rel="noopener"
                        :aria-label="ext.name" :title="ext.name">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path fill="currentColor" :d="ext.path" /></svg>
                    </a>
                </span>
            </template>
            <d-menu :groups="navGroups" :model-value="route.path" @select="navOpen = false" />
        </d-drawer>
    </d-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { applyTheme, Theme, THEME_KEY } from '@xmdrizzol/drizzol-ui'
// 版本号自动取自库 package.json：发版提版本后演示站随之同步，无需手动改
import libPkg from '@ui/../package.json'

const route = useRoute()

const version = libPkg.version

// 移动端抽屉导航开关
const navOpen = ref(false)

// GitHub/npm 外链：桌面头栏与移动端抽屉标题栏共用（窄屏从头栏收进抽屉）
const externalLinks = [
    {
        name: 'GitHub',
        href: 'https://github.com/xmdrizzol/drizzol-ui',
        path: 'M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    },
    {
        name: 'npm',
        href: 'https://www.npmjs.com/package/@xmdrizzol/drizzol-ui',
        path: 'M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019l-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z',
    },
]

const navGroups: { label: string; items: { key: string; label: string; to: string }[] }[] = [
    {
        label: '概况',
        items: [
            { key: '/', label: '总览', to: '/' },
            { key: '/intro', label: '介绍', to: '/intro' },
            { key: '/theme', label: '主题色板', to: '/theme' },
            { key: '/compat', label: '浏览器兼容', to: '/compat' },
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
            { key: '/components/dimage', label: 'DImage 图片', to: '/components/dimage' },
            { key: '/components/davatar', label: 'DAvatar 头像', to: '/components/davatar' },
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
/* 头部高度：与库内 DHeader 默认值一致，同时决定侧栏的吸顶偏移与自身高度 */
$header-height: 56px;

/* 页脚高度（padding 20px×2 + 一行文字 ≈ 58px）：
   侧栏把它预留出来，短页面（正文矮于侧栏）的文档总高恰好一屏、不产生滚动——
   否则这 58px 的滚动量会推着无位移空间的侧栏上移，盖到吸顶头部上 */
$footer-height: 58px;

.default-layout {
    // 库内 .d-layout 自带 min-height: 0 / flex: 1，用复合选择器提高优先级还原「撑满视口、页脚贴底」
    &.d-layout {
        min-height: 100vh;
        // 吸顶侧栏（DAside fixed）的吸附位置：让出吸顶头部的高度，避免与头部重叠
        --dz-aside-sticky-top: #{$header-height};
    }

    // 以下覆写库组件默认值：库内样式是单类 scoped（.d-header 等），这里多带一层父类才能稳定压过，
    // 不依赖 SFC 之间样式的注入顺序
    .default-layout__header {
        justify-content: space-between;
    }

    .default-layout__sidebar {
        height: calc(100vh - #{$header-height} - #{$footer-height});
        padding: 20px 12px 40px;
        @include scrollbars;

        @include mobile {
            display: none;
        }
    }

    .default-layout__main {
        padding: 28px 32px 60px;
        max-width: 1080px;

        @include mobile {
            padding: 20px 16px 48px;
        }
    }

    .default-layout__footer {
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        padding: 20px 32px;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
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

    &__actions {
        @include flex(center, center);
        gap: 14px;
    }

    &__actions .default-layout__action,
    &__theme,
    &__nav {
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

    // 移动端：侧栏隐藏，收起外链腾出头部空间，改由汉堡按钮打开抽屉导航
    &__actions .default-layout__action {
        @include mobile {
            display: none;
        }
    }

    &__nav {
        display: none;

        @include mobile {
            @include flex(center, center);
        }
    }
}

/* 抽屉标题栏（GitHub/npm 外链）：DDrawer Teleport 到 body 后不在 .default-layout 内，
   作用域样式必须写在顶层才能命中插槽内容 */
.default-layout__drawer-title {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--dz-text-h);
}

.default-layout__drawer-links {
    @include flex(center, center);
    gap: 6px;
    // 标题栏是 space-between：margin-left:auto 让外链与右侧关闭按钮成组贴边
    margin-left: auto;
}

.default-layout__drawer-link {
    @include flex(center, center);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: var(--dz-text-l);
    transition: background 0.2s, color 0.2s;

    // hover 用中性灰：抽屉面板底就是 --dz-bg，hover 再用同色会完全不可见
    &:hover {
        background: var(--dz-gray-4);
        color: var(--dz-primary);
    }
}
</style>
