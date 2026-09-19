<template>
    <div class="d-cropper">
        <div class="d-cropper__canvas" :style="{ width: size + 'px', height: size + 'px' }">
            <cropper-canvas background ref="cropperCanvasRef" :key="imgUrl">
                <cropper-image v-if="init" :key="imgUrl" :src="imgUrl" ref="cropperImageRef" initial-center-size="cover"
                    alt="Picture" rotatable scalable skewable translatable></cropper-image>
                <cropper-shade hidden></cropper-shade>
                <cropper-selection initial-coverage="1"></cropper-selection>
                <cropper-handle action="move" plain></cropper-handle>
            </cropper-canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import 'cropperjs'
import type CropperCanvas from '@cropper/element-canvas';
import type CropperImage from '@cropper/element-image';
import { uploadImage } from '@ui/utils/file-api'

const props = withDefaults(defineProps<{
    imgUrl: string,
    /**
     * 手动初始化
     */
    init: boolean,
    /**
     * 裁剪输出尺寸（宽高一致，默认 300）
     */
    size?: number,
    /**
     * 上传接口路径（相对 baseURL 或完整 URL）；不传用全局配置（configureFileApi，默认空、需宿主配置）
     */
    action?: string
}>(), {
    imgUrl: '',
    init: false,
    size: 300,
    action: undefined
})

const cropperCanvasRef = ref<CropperCanvas | null>()
const cropperImageRef = ref<CropperImage | null>()

let oldMatrix: number[] = []
let pendingCheck = false
let isRestoring = false

const enforceBounds = () => {
    pendingCheck = false
    const canvas = cropperCanvasRef.value
    const image = cropperImageRef.value
    if (!canvas || !image) return

    const canvasRect = canvas.getBoundingClientRect()
    const imageRect = image.getBoundingClientRect()

    const shouldLock =
        imageRect.top > canvasRect.top ||
        imageRect.right < canvasRect.right ||
        imageRect.bottom < canvasRect.bottom ||
        imageRect.left > canvasRect.left

    if (shouldLock && oldMatrix.length === 6) {
        isRestoring = true
        image.$setTransform(oldMatrix[0], oldMatrix[1], oldMatrix[2], oldMatrix[3], oldMatrix[4], oldMatrix[5])
        isRestoring = false
    }
}

const onCropperImageTransform = (event: CustomEvent) => {
    if (isRestoring) return
    oldMatrix = [...(event.detail.oldMatrix as number[])]
    if (!pendingCheck) {
        pendingCheck = true
        requestAnimationFrame(enforceBounds)
    }
}

/**
 * 获取裁剪后的blob对象
 * @returns blob格式对象
 */
const getCroppedBlob = async (): Promise<Blob | null> => {
    const canvas = cropperCanvasRef.value
    if (!canvas) return null

    const res = await canvas.$toCanvas();

    const outputCanvas = document.createElement('canvas')
    outputCanvas.width = props.size
    outputCanvas.height = props.size

    const ctx = outputCanvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(res, 0, 0, props.size, props.size)

    return new Promise((resolve) => {
        outputCanvas.toBlob(
            (blob) => resolve(blob),
            'image/png',
            0.95
        )
    })
}

/**
 * 获取裁剪并上传的图片
 * @returns 图片url
 */
const getImgUrl = async (): Promise<{ displayUrl: string; fileRef: string } | undefined> => {
    const blob = await getCroppedBlob()
    if (!blob) return

    return uploadImage({ file: blob, url: props.action }).then(res => {
        const { storedFileName, accessUrl } = res.data
        return {
            displayUrl: accessUrl,
            fileRef: storedFileName,
        }
    }).catch(() => {
        // HTTP 错误由拦截器统一处理

        return undefined
    })
}

/**
 * 当图片完全显示时，添加边缘判断事件监听
 */
watch(cropperImageRef, (image) => {
    if (!image) return

    image.$ready(() => {
        image.addEventListener('transform', ((e: Event) => {
            onCropperImageTransform(e as CustomEvent)
        }) as EventListener)
    })
})

defineExpose({
    getCroppedBlob,
    getImgUrl
})
</script>

<style lang="scss" scoped>
.d-cropper {
    @include flex(center, center);

    &__canvas {
        box-shadow: var(--dz-shadow-sm);

        cropper-canvas {
            height: 100%;
            width: 100%;
        }

        cropper-shade {
            border-radius: 50%;
        }
    }
}
</style>
