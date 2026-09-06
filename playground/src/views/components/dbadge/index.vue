<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DBadge<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">角标：数值（超 max 显示 max+）、红点、隐藏/零值策略由 showZero 控制，红色圆点带页面底色描边。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-badge :value="120" :max="99"><d-button>消息</d-button></d-badge>
<d-badge dot><d-button>红点</d-button></d-badge>'>
            <div class="component-page__row">
                <d-badge :value="120" :max="99">
                    <d-button>消息</d-button>
                </d-badge>
                <d-badge :value="5">
                    <d-button>未读</d-button>
                </d-badge>
                <d-badge dot>
                    <d-button>红点</d-button>
                </d-badge>
                <d-badge :value="0" show-zero>
                    <d-button>零值</d-button>
                </d-badge>
                <d-badge :value="42" :hidden="hidden">
                    <d-button @click="hidden = !hidden">{{ hidden ? '当前隐藏 → 点击显示' : '当前 42 → 点击隐藏' }}</d-button>
                </d-badge>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const hidden = ref(false)
</script>

<style scoped lang="scss">
.component-page {
    &__row {
        display: flex;
        align-items: center;
        gap: 24px;
        flex-wrap: wrap;
    }
}
</style>
