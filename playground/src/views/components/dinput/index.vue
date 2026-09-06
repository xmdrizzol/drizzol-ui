<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DInput<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">输入框组件：text / password / textarea / number 四种类型，v-model 双向绑定，暴露 focus 方法。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-input v-model="text" placeholder="请输入" />
<d-input v-model="pwd" type="password" />'>
            <div class="component-page__stack">
                <div class="component-page__grid">
                    <d-input v-model="basic.text" placeholder="请输入文本" />
                    <d-input v-model="basic.password" type="password" placeholder="密码" />
                    <d-input v-model="basic.textarea" type="textarea" :rows="3" placeholder="多行文本" />
                </div>
                <p class="component-page__echo">当前值：{{ JSON.stringify(basic) }}</p>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const basic = ref({ text: '', password: '', textarea: '' })
</script>

<style scoped lang="scss">
.component-page {
    &__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
    }

    &__echo {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }
}
</style>
