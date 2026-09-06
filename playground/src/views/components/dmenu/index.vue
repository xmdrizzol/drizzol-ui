<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DMenu<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">导航菜单：分组标题 + 条目（图标 / 路由链接 / 禁用），激活项高亮；支持平铺 items 或分组 groups 两种数据，本页侧边栏即由它驱动。</p>
        </header>

        <demo-block title="分组 + 路由链接" anchor-id="demo"
            code='<d-menu :groups="groups" v-model="active" />'>
            <div class="component-page__stack">
                <d-card class="component-page__menu-card">
                    <d-menu :groups="linkGroups" v-model="routeKey" />
                </d-card>
                <p class="component-page__echo">当前路由：{{ routeKey }}</p>
            </div>
        </demo-block>

        <demo-block title="平铺 + 图标 + 禁用（点击事件）" anchor-id="flat"
            code='<d-menu :items="items" v-model="activeKey" @select="onSelect" />'>
            <div class="component-page__stack">
                <d-card class="component-page__menu-card">
                    <d-menu :items="flatItems" v-model="activeKey" @select="onSelect" />
                </d-card>
                <p class="component-page__echo">当前选中：{{ activeKey || '（无）' }}</p>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { DMessage } from '@xmdrizzol/drizzol-ui'
import DemoBlock from '@/components/demo-block'

const route = useRoute()
const routeKey = computed(() => route.path)

const linkGroups = [
    {
        label: '概况',
        items: [
            { key: '/', label: '总览', to: '/' },
            { key: '/theme', label: '主题色板', to: '/theme' },
        ],
    },
    {
        label: '组件',
        items: [
            { key: '/components/dcard', label: 'DCard 卡片', to: '/components/dcard' },
            { key: '/components/dlayout', label: 'DLayout 布局', to: '/components/dlayout' },
        ],
    },
]

const activeKey = ref('')
const flatItems = [
    { key: 'profile', label: '个人资料', icon: 'user' },
    { key: 'settings', label: '账号设置', icon: 'edit' },
    { key: 'logout', label: '退出登录', icon: 'arrow-forward', disabled: true },
]

function onSelect(item: any) {
    DMessage.info(`选中：${item.label}`)
}
</script>

<style scoped lang="scss">
.component-page {
    &__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &__menu-card {
        max-width: 260px;
    }

    &__echo {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }
}
</style>
