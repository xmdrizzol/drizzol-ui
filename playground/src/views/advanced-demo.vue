<template>
    <div class="advanced-demo">
        <h1 class="advanced-demo__title">增强组件</h1>
        <p class="advanced-demo__hint">
            上传/裁剪依赖后端契约 <code>/api/general/file/upload[/image]</code>，未配置后端时请求会由拦截器统一提示；
            视频示例使用外部样例地址，需网络可用。
        </p>

        <section class="advanced-demo__section">
            <h2>PageHero 页面横幅</h2>
            <d-page-hero title="Drizzol UI" en="Enjoy the harmony of design" subtitle="沉浸式页面横幅，封面/高度/负边距均可配置"
                :cover="coverSvg" />
        </section>

        <section class="advanced-demo__section">
            <h2>PageCover 封面（视差）</h2>
            <d-page-cover :src="coverSvg" height="200px" :overlay-opacity="0" />
        </section>

        <section class="advanced-demo__section">
            <h2>Video 播放器（ArtPlayer）</h2>
            <div class="advanced-demo__video">
                <d-video src="https://www.w3schools.com/html/mov_bbb.mp4" @ready="onVideoReady" />
            </div>
        </section>

        <section class="advanced-demo__section">
            <h2>Cropper 裁剪（300×300 输出）</h2>
            <d-cropper :img-url="coverSvg" :init="true" :size="300" ref="cropperRef" />
            <div class="advanced-demo__row">
                <d-button @click="handleCrop">裁剪并上传</d-button>
            </div>
        </section>

        <section class="advanced-demo__section">
            <h2>Upload 上传</h2>
            <d-card class="advanced-demo__upload">
                <d-upload v-model="uploadRef" accept="image/*" category="image" />
                <p class="advanced-demo__echo">modelValue：{{ uploadRef || '（未选择）' }}</p>
            </d-card>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 内联渐变封面（避免演示站依赖外部图床）
const coverSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="400">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>' +
    '<rect fill="url(#g)" width="1600" height="400"/></svg>'
)

function onVideoReady() {
    ElMessage.success('播放器就绪')
}

const cropperRef = ref<{ getImgUrl: () => Promise<{ displayUrl: string; fileRef: string } | undefined> }>()

async function handleCrop() {
    const res = await cropperRef.value?.getImgUrl()
    ElMessage.success(res ? `上传成功：${res.fileRef}` : '未获取到裁剪结果')
}

const uploadRef = ref('')
</script>

<style scoped lang="scss">
.advanced-demo {
    &__title {
        margin: 0 0 8px;
        color: var(--dz-text-h);
    }

    &__hint {
        margin: 0 0 24px;
        color: var(--dz-text-d);

        code {
            background: var(--dz-bg-secondary);
            padding: 2px 6px;
            border-radius: 4px;
        }
    }

    &__section {
        margin-bottom: 36px;

        h2 {
            margin: 0 0 12px;
            font-size: 1.125rem;
            color: var(--dz-text-h);
        }
    }

    &__row {
        display: flex;
        gap: 12px;
        margin-top: 12px;
    }

    &__video {
        max-width: 720px;
    }

    &__upload {
        max-width: 480px;
        display: inline-block;
    }

    &__echo {
        margin: 10px 0 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }
}
</style>
