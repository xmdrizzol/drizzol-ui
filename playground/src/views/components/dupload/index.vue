<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DUpload<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">上传组件：点击选择文件 → POST 上传接口（默认 /api/general/file/upload，字段 File + CustomCategory）→ 进度通知；支持取消、多文件、预览。接口地址可自定义：全局 configureFileApi({ uploadUrl })，或组件传 action。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-upload v-model="fileRef" accept="image/*" category="image" />

<!-- 自定义上传地址（优先级：action > configureFileApi 全局 > 默认契约） -->
<d-upload v-model="fileRef" action="/my/avatar/upload" />'>
            <div class="component-page__row">
                <d-upload v-model="uploadRef" accept="image/*" category="image" />
                <p class="component-page__echo">modelValue：{{ uploadRef || '（未选择）' }}</p>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const uploadRef = ref('')
</script>

<style scoped lang="scss">
.component-page {
    &__row {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
    }

    &__echo {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }
}
</style>
