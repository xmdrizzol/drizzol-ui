<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DFormItem<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">表单项组件：配合 DForm 使用；label / prop，校验规则来自 DForm 的 rules（required / min / max / validator）。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-form :model="form" :rules="rules">
  <d-form-item label="用户名" prop="name">
    <d-input v-model="form.name" />
  </d-form-item>
</d-form>'>
            <d-form :model="formModel" :rules="rules" class="component-page__form">
                <d-form-item label="用户名" prop="name">
                    <d-input v-model="formModel.name" placeholder="至少 2 个字符" />
                </d-form-item>
                <d-form-item label="简单字段（无规则）" prop="other">
                    <d-input v-model="formModel.other" placeholder="不需要校验的字段" />
                </d-form-item>
            </d-form>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const formModel = ref({ name: '', other: '' })
const rules = {
    name: { required: true, min: 2, message: '用户名至少 2 个字符' },
}
</script>

<style scoped lang="scss">
.component-page {
    &__form {
        width: 100%;
        max-width: 480px;
    }
}
</style>
