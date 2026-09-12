<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DDropdown<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">下拉菜单组件：click / hover 两种触发方式；菜单插槽自定义内容，CSS 过渡，点击外部自动关闭。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-dropdown trigger="click">
  <d-button>点击打开</d-button>
  <template #menu>...</template>
</d-dropdown>'>
            <div class="component-page__row">
                <d-dropdown trigger="click">
                    <d-button>点击打开</d-button>
                    <template #menu>
                        <div class="component-page__menu">纯文本项</div>
                        <div class="component-page__menu">也可以放任意内容</div>
                    </template>
                </d-dropdown>
                <d-dropdown trigger="hover">
                    <d-button>悬停打开</d-button>
                    <template #menu>
                        <div class="component-page__menu">悬停选项</div>
                    </template>
                </d-dropdown>
            </div>
        </demo-block>

        <demo-block title="边界适配（贴近视口边缘自动内收）" anchor-id="boundary"
            code='<!-- 菜单越出视口时自动平移收进窗口：水平越界平移、箭头仍指向触发器；底部放不下整体上移 -->
<d-dropdown trigger="click" placement="bottom">
  <d-button>贴近右缘打开</d-button>
  <template #menu>…</template>
</d-dropdown>'>
            <div class="component-page__boundary-row">
                <d-dropdown trigger="click" class="component-page__boundary-right">
                    <d-button>视口右缘（点我）</d-button>
                    <template #menu>
                        <div class="component-page__menu">水平越界：整体左移收进视口</div>
                        <div class="component-page__menu">箭头反向跟随、仍指向按钮</div>
                    </template>
                </d-dropdown>
                <d-dropdown trigger="click" class="component-page__boundary-bottom">
                    <d-button>视口底部（点我）</d-button>
                    <template #menu>
                        <div class="component-page__menu">下方放不下：整体上移适配</div>
                        <div class="component-page__menu">此时箭头自动隐藏</div>
                    </template>
                </d-dropdown>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import DemoBlock from '@/components/demo-block'
</script>

<style scoped lang="scss">
.component-page {
    &__row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    &__menu {
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
            background: var(--dz-bg-secondary);
            color: var(--dz-primary);
        }
    }

    // 边界适配演示：触发器分别钉在视口右缘中部/底部中央（fixed 定位不受文档流影响）
    &__boundary-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    &__boundary-right {
        position: fixed;
        right: 12px;
        top: 40%;
        z-index: 50;
    }

    &__boundary-bottom {
        position: fixed;
        left: 50%;
        bottom: 12px;
        transform: translateX(-50%);
        z-index: 50;
    }
}
</style>
