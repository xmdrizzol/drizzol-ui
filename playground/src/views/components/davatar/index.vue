<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DAvatar<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">
                头像：圆/方两种形状、尺寸可配；fileRef/URL 统一解析（与 DImage 同一套规则，/ 开头的同源路径原样使用）；
                图片为空或加载失败时显示文字兜底（如用户名首字），#fallback 插槽可完全自定义。
            </p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-avatar :src="url" alt="头像" />
<d-avatar :src="url" alt="方形头像" shape="square" />
<d-avatar :src="url" :size="56" alt="大头像" />'>
            <div class="component-page__row">
                <d-avatar :src="demoAvatar" alt="圆形头像" />
                <d-avatar :src="demoAvatar" alt="方形头像" shape="square" />
                <d-avatar :src="demoAvatar" alt="尺寸 56" :size="56" />
                <d-avatar :src="demoAvatar" alt="尺寸 24" :size="24" />
            </div>
        </demo-block>

        <demo-block title="文字兜底" anchor-id="fallback"
            code='<!-- 图片为空或加载失败时显示 fallbackText（如用户名首字） -->
<d-avatar fallback-text="洛" />
<d-avatar :src="brokenUrl" fallback-text="Kosame" alt="Kosame" />

<!-- 自定义兜底内容 -->
<d-avatar>
  <template #fallback>
    <d-icon name="user" />
  </template>
</d-avatar>'>
            <div class="component-page__row">
                <d-avatar fallback-text="洛" alt="洛" />
                <d-avatar :src="brokenUrl" fallback-text="Kosame" alt="Kosame" />
                <d-avatar shape="square" fallback-text="方" alt="方" />
                <d-avatar>
                    <template #fallback>
                        <d-icon name="user" />
                    </template>
                </d-avatar>
            </div>
        </demo-block>

        <demo-block title="配合其他组件" anchor-id="compose"
            code='<!-- 列表条目：头像 + 文字 -->
<div class="user-row">
  <d-avatar :src="url" :size="40" alt="用户名" fallback-text="洛" />
  <div>
    <p class="user-row__name">用户名</p>
    <p class="user-row__meta">这是一段签名</p>
  </div>
</div>'>
            <div class="component-page__stack">
                <div v-for="u in users" :key="u.name" class="user-row">
                    <d-avatar :src="u.avatar" :size="40" :alt="u.name" :fallback-text="u.name[0]" />
                    <div>
                        <p class="user-row__name">{{ u.name }}</p>
                        <p class="user-row__meta">{{ u.meta }}</p>
                    </div>
                </div>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'

// 内联 SVG 演示头像：离线可用的 data: URL 场景
function svgAvatar(bg: string, label: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
  <rect width="96" height="96" fill="${bg}"/>
  <circle cx="48" cy="38" r="15" fill="rgba(255,255,255,.85)"/>
  <path d="M20 96c0-16 12-26 28-26s28 10 28 26z" fill="rgba(255,255,255,.85)"/>
  <text x="94" y="12" fill="rgba(255,255,255,.5)" font-size="10" font-family="sans-serif">${label}</text>
</svg>`
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const demoAvatar = svgAvatar('#4f7cf6', 'demo')

// 无效域名：DNS 快速失败触发加载失败兜底
const brokenUrl = 'https://invalid.invalid/a.png'

const users = [
    { name: '洛清河', meta: '管理员 · 刚刚在线', avatar: svgAvatar('#4f7cf6', 'u1') },
    { name: 'Kosame', meta: '成员 · 5 分钟前', avatar: '' },
    { name: '白霜', meta: '成员 · 2 小时前', avatar: 'https://invalid.invalid/b.png' },
]
</script>

<style scoped lang="scss">
.component-page {
    &__row {
        width: 100%;
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        align-items: center;
    }

    &__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
}

// 列表条目：头像 + 文字的组合示例
.user-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid var(--dz-border);
    border-radius: 8px;
    background: var(--dz-bg-secondary);

    &__name {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--dz-text-h);
    }

    &__meta {
        margin: 2px 0 0;
        font-size: 0.75rem;
        color: var(--dz-text-l);
    }
}
</style>
