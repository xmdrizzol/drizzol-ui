<template>
    <div class="advanced-demo">
        <demo-block title="DSearch 搜索" anchor-id="fc-dsearch"
            desc="输入防抖 300ms 后触发 search 事件，回车立即触发，支持一键清空。"
            code='<d-search placeholder="搜索..." @search="onSearch" />'>
            <div class="advanced-demo__stack">
                <d-search placeholder="搜索（防抖 300ms）" @search="onSearch" />
                <p class="advanced-demo__echo">搜索词：{{ searchWord || '（空）' }}</p>
            </div>
        </demo-block>

        <demo-block title="DSort 排序筛选" anchor-id="fc-dsort"
            desc="排序字段 + 日期范围 + 状态筛选（状态选项由宿主传入，v-model 绑定筛选参数）。"
            code='<d-sort v-model="sort" :sort-options="opts" :status-options="status" show-admin />'>
            <div class="advanced-demo__stack">
                <d-sort v-model="sortModel" :sort-options="sortOptions" :status-options="statusOptions" show-admin />
                <p class="advanced-demo__echo">排序值：{{ JSON.stringify(sortModel) }}</p>
            </div>
        </demo-block>

        <demo-block title="DFloatBar 浮动条" anchor-id="fc-dfloatbar"
            desc="右下角浮动按钮：滚动超过 threshold 显示返回顶部；目录按钮通过 catalog 事件交给宿主。"
            code='<d-float-bar show-catalog catalog-tooltip="目录" @catalog="onCatalog" />'>
            <p class="advanced-demo__note">本页已挂载（滚动本页可见右下角按钮），点击目录触发事件。</p>
        </demo-block>

        <demo-block title="DPageHero 页面横幅" anchor-id="fc-dpagehero"
            desc="title / en / subtitle / cover / height 全参数化；封面缺省时只渲染深色渐变遮罩。"
            code='<d-page-hero title="Drizzol UI" en="Enjoy the harmony of design" :cover="cover" />'>
            <div class="advanced-demo__stack">
                <d-page-hero title="Drizzol UI" en="Enjoy the harmony of design" subtitle="沉浸式页面横幅，封面/高度/负边距均可配置"
                    :cover="coverSvg" />
            </div>
        </demo-block>

        <demo-block title="DPageCover 封面" anchor-id="fc-dpagecover"
            desc="带滚动视差的封面组件，height / overlayOpacity 可配置。"
            code='<d-page-cover :src="cover" height="200px" :overlay-opacity="0" />'>
            <d-page-cover :src="coverSvg" height="200px" :overlay-opacity="0" />
        </demo-block>

        <demo-block title="DVideo 播放器" anchor-id="fc-dvideo"
            desc="ArtPlayer 封装：容器即尺寸盒（aspect-ratio），切换 src 复用实例，事件 ready/play/pause/ended 透传。"
            code='<d-video src="..." @ready="onReady" />'>
            <div class="advanced-demo__video">
                <d-video src="https://www.w3schools.com/html/mov_bbb.mp4" @ready="onVideoReady" />
            </div>
        </demo-block>

        <demo-block title="DCropper 裁剪" anchor-id="fc-dcropper"
            desc="cropperjs 封装：圆形选区 + 边界约束；getCroppedBlob / getImgUrl（裁剪并上传）。"
            code='<d-cropper :img-url="url" :init="true" :size="300" ref="cropper" />
const { displayUrl, fileRef } = await cropper.value.getImgUrl()'>
            <div class="advanced-demo__row">
                <d-cropper :img-url="coverSvg" :init="true" :size="300" ref="cropperRef" />
                <div class="advanced-demo__col">
                    <p class="advanced-demo__note">自动约束在画布内，输出为正方形 PNG。</p>
                    <d-button type="primary" @click="handleCrop">裁剪并上传（需后端契约）</d-button>
                </div>
            </div>
        </demo-block>

        <demo-block title="DUpload 上传" anchor-id="fc-dupload"
            desc="点击选择图片 → POST /api/general/file/upload（字段 File + CustomCategory）→ ElNotification 进度；支持取消、多文件、预览。"
            code='<d-upload v-model="fileRef" accept="image/*" category="image" />'>
            <div class="advanced-demo__row">
                <d-upload v-model="uploadRef" accept="image/*" category="image" />
                <p class="advanced-demo__echo">modelValue：{{ uploadRef || '（未选择）' }}</p>
            </div>
        </demo-block>

        <!-- 页面级浮动条：随页面滚动显示 -->
        <d-float-bar show-catalog catalog-tooltip="目录" @catalog="onCatalog" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import DemoBlock from '../components/demo-block.vue'

// 内联渐变封面（避免演示站依赖外部图床）
const coverSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="400">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>' +
    '<rect fill="url(#g)" width="1600" height="400"/></svg>'
)

const searchWord = ref('')
function onSearch(keyword: string) {
    searchWord.value = keyword
}

const sortModel = ref({ sortBy: 'createdAt', desc: true, dateStart: '', dateEnd: '', status: '' })
const sortOptions = [
    { field: 'createdAt', label: '创建时间' },
    { field: 'updatedAt', label: '更新时间' },
]
const statusOptions = [
    { value: '', label: '全部' },
    { value: 'published', label: '已发布' },
    { value: 'draft', label: '草稿' },
]

function onCatalog() {
    ElMessage.info('目录事件（示例）')
}

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
    &__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &__row {
        @include flex(flex-start, flex-start);
        gap: 20px;
        flex-wrap: wrap;
    }

    &__col {
        @include flex(flex-start, center);
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }

    &__video {
        width: 100%;
        max-width: 640px;
        background: var(--dz-bg);
        border-radius: 8px;
    }

    &__echo,
    &__note {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }
}
</style>
