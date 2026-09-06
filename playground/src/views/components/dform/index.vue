<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DForm<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">表单组件：DForm + DFormItem 字段校验（required / min / max / validator），支持整体校验与重置。</p>
        </header>

        <demo-block title="校验与重置" anchor-id="demo"
            code='<d-form :model="form" :rules="rules" ref="formRef">
  <d-form-item label="用户名" prop="name">
    <d-input v-model="form.name" />
  </d-form-item>
</d-form>
await formRef.value.validate()'>
            <div class="component-page__stack">
                <d-form :model="formModel" :rules="rules" ref="formRef" class="component-page__form">
                    <d-form-item label="用户名" prop="name">
                        <d-input v-model="formModel.name" placeholder="至少 2 个字符" />
                    </d-form-item>
                    <d-form-item label="简介" prop="bio">
                        <d-input v-model="formModel.bio" type="textarea" :rows="2" placeholder="2-10 个字符" />
                    </d-form-item>
                </d-form>
                <div class="component-page__row">
                    <d-button type="primary" @click="handleValidate">校验</d-button>
                    <d-button @click="handleReset">重置</d-button>
                </div>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DMessage } from '@xmdrizzol/drizzol-ui'
import DemoBlock from '@/components/demo-block'

const formModel = ref({ name: '', bio: '' })
const rules = {
    name: { required: true, min: 2, message: '用户名至少 2 个字符' },
    bio: { required: true, min: 2, max: 10, message: '简介长度需在 2-10 个字符' },
}
const formRef = ref<{ validate: () => Promise<boolean>; resetFields: () => void }>()

async function handleValidate() {
    const valid = await formRef.value?.validate()
    DMessage.success(valid ? '校验通过' : '校验失败，请检查表单')
}

function handleReset() {
    formRef.value?.resetFields()
    formModel.value = { name: '', bio: '' }
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

    &__row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    &__form {
        max-width: 520px;
    }
}
</style>
