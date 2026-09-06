<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DCropper<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">图片裁剪组件（cropperjs）：圆形选区 + 边界约束；暴露 getCroppedBlob / getImgUrl（裁剪并上传）。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-cropper :img-url="url" :init="true" :size="300" ref="cropper" />
const { displayUrl, fileRef } = await cropper.value.getImgUrl()'>
            <div class="component-page__row">
                <d-cropper :img-url="coverSvg" :init="true" :size="300" ref="cropperRef" />
                <div class="component-page__col">
                    <p class="component-page__echo">自动约束在画布内，输出为正方形 PNG。</p>
                    <d-button type="primary" @click="handleCrop">裁剪并上传（需后端契约）</d-button>
                </div>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DMessage } from '@drizzol/ui'
import DemoBlock from '@/components/demo-block'

const coverSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>' +
    '<rect fill="url(#g)" width="600" height="400"/></svg>'
)

const cropperRef = ref<{ getImgUrl: () => Promise<{ displayUrl: string; fileRef: string } | undefined> }>()

async function handleCrop() {
    const res = await cropperRef.value?.getImgUrl()
    DMessage.success(res ? `上传成功：${res.fileRef}` : '未获取到裁剪结果')
}
</script>

<style scoped lang="scss">
.component-page {
    &__row {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        flex-wrap: wrap;
    }

    &__col {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding-top: 8px;
    }

    &__echo {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }
}
</style>
