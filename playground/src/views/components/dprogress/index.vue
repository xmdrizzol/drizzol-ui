<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DProgress<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">进度条：value 0-100 自动收敛，状态语义色，百分比文本可关可自定义；高度与配色经 --dz-progress-* 变量调节。上传进度通知内部用的就是它。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-progress :value="value" text />

<!-- 超出 0-100 会自动收敛并取整 -->
<d-progress :value="150" text />'>
            <div class="component-page__stack">
                <d-progress :value="basic" text />
                <div class="component-page__row">
                    <d-button size="small" @click="basic = Math.min(100, basic + 20)">+20</d-button>
                    <d-button size="small" @click="basic = Math.max(0, basic - 20)">-20</d-button>
                    <p class="component-page__echo">当前：{{ basic }}%</p>
                </div>
            </div>
        </demo-block>

        <demo-block title="状态色" anchor-id="status"
            code='<d-progress :value="80" status="success" text />
<d-progress :value="60" status="warning" text />
<d-progress :value="30" status="danger" text />'>
            <div class="component-page__stack">
                <d-progress :value="80" status="success" text />
                <d-progress :value="60" status="warning" text />
                <d-progress :value="30" status="danger" text />
            </div>
        </demo-block>

        <demo-block title="高度与文本自定义" anchor-id="custom"
            code='<!-- 高度经 CSS 变量调节 -->
<d-progress :value="66" text style="--dz-progress-height: 10px" />

<!-- #text 插槽自定义文案 -->
<d-progress :value="3" text>
  <template #text="{ value }">第 {{ value }} / 10 题</template>
</d-progress>'>
            <div class="component-page__stack">
                <d-progress :value="66" text style="--dz-progress-height: 10px" />
                <d-progress :value="3" text>
                    <template #text="{ value }">第 {{ value }} / 10 题</template>
                </d-progress>
            </div>
        </demo-block>

        <demo-block title="页面顶部加载进度条" anchor-id="loadingbar"
            desc="全局单例 DLoadingBar：start() 开始后自动缓慢自增（封顶 90%），done() 以剩余的最短展示时长为过渡窗口滑到 100% 再淡出——过程肉眼可见；重复 start 不叠加，未 start 直接 done 也安全。本站路由切换的顶部进度条就是它。"
            code="import { DLoadingBar } from '@xmdrizzol/drizzol-ui'

// 路由切换常配：beforeEach start / afterEach done
DLoadingBar.start()
fetchData().finally(() => DLoadingBar.done())

// 静态打包站点没有真实加载时，可拉长最短展示时长让过程更明显
DLoadingBar.start({ minDuration: 1200 })">
            <div class="component-page__row">
                <d-button type="primary" @click="DLoadingBar.start({ minDuration: 1200 })">start()（演示 1.2s）</d-button>
                <d-button @click="DLoadingBar.done()">done()</d-button>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'
import { DLoadingBar } from '@xmdrizzol/drizzol-ui'

const basic = ref(60)
</script>

<style scoped lang="scss">
.component-page {
    &__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &__row {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    &__echo {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
    }
}
</style>
