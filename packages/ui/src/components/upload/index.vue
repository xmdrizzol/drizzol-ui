<template>
    <div
        class="d-upload"
        :class="{ 'd-upload--disabled': disabled, 'd-upload--uploading': uploading }"
    >
        <input
            ref="fileInputRef"
            type="file"
            :accept="accept"
            :multiple="multiple"
            class="d-upload__input"
            :disabled="disabled"
            @change="handleChange"
        />

        <div class="d-upload__trigger" @click="openPicker">
            <slot :uploading="uploading" :display-url="displayUrl" :progress="progress">
                <div
                    v-if="showPreview"
                    class="d-upload__area"
                    :style="{ width: previewWidth + 'px', height: previewHeight + 'px' }"
                >
                    <img
                        v-if="modelValue && !uploading"
                        :src="displayUrl"
                        class="d-upload__preview"
                    />
                    <div v-else class="d-upload__placeholder">
                        <template v-if="uploading">
                            <span class="d-upload__progress">
                                <span class="d-upload__progress-inner" :style="{ width: progress + '%' }"></span>
                            </span>
                            <span class="d-upload__progress-text">{{ progress }}%</span>
                            <d-icon
                                name="close"
                                size="1"
                                class="d-upload__progress-cancel"
                                @click.stop="handleCancelUpload"
                            />
                        </template>
                        <span v-else>点击上传</span>
                    </div>
                </div>
            </slot>
        </div>

        <slot
            v-if="modelValue && !uploading && !disabled"
            name="remove-button"
            :clear-file="clearFile"
        >
            <d-icon
                name="delete"
                size="1"
                class="d-upload__remove"
                @click.stop="clearFile"
            />
        </slot>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DMessage } from '@ui/components/message'
import { DConfirm } from '@ui/components/confirm'
import { uploadFile } from '@ui/utils/file-api'
import { getFileAccessUrl } from '@ui/utils/file'
import type { FileCategory } from '@ui/types/api'
import DIcon from '@ui/components/icon'
import { showUploadNotification } from './upload-notify'
import type { UploadNotifyControl } from './upload-notify'

const props = withDefaults(defineProps<{
    modelValue?: string
    accept?: string
    maxSize?: number
    multiple?: boolean
    category?: FileCategory
    showPreview?: boolean
    previewWidth?: number
    previewHeight?: number
    disabled?: boolean
    autoUpload?: boolean
    /** 上传接口路径（相对 baseURL 或完整 URL）；不传用全局配置（configureFileApi，默认 /general/file/upload） */
    action?: string
}>(), {
    modelValue: '',
    accept: 'image/*',
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    category: undefined,
    showPreview: true,
    previewWidth: 200,
    previewHeight: 200,
    disabled: false,
    autoUpload: true,
    action: undefined,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'select': [file: File]
    'upload-success': [response: Awaited<ReturnType<typeof uploadFile>>['data']]
    'upload-error': [error: any]
}>()

const uploading = ref(false)
const progress = ref(0)
const fileInputRef = ref<HTMLInputElement>()
const abortController = ref<AbortController>()
const uploadNotify = ref<UploadNotifyControl>()

const displayUrl = computed(() => {
    if (!props.modelValue) return ''
    return getFileAccessUrl(props.modelValue)
})

function openPicker() {
    if (props.disabled || uploading.value) return
    fileInputRef.value?.click()
}

function clearFile() {
    emit('update:modelValue', '')
}

async function handleChange(e: Event) {
    const input = e.target as HTMLInputElement
    const files = input.files
    if (!files?.length) return

    try {
        if (props.autoUpload) {
            uploading.value = true
            progress.value = 0

            if (props.multiple) {
                for (const file of Array.from(files)) {
                    await doUpload(file)
                }
            } else {
                const file = files[0]
                if (file.size > props.maxSize) {
                    DMessage.warning(`文件大小不能超过 ${formatSize(props.maxSize)}`)
                    return
                }
                await doUpload(file)
            }
        } else {
            const file = files[0]
            if (file.size > props.maxSize) {
                DMessage.warning(`文件大小不能超过 ${formatSize(props.maxSize)}`)
                return
            }
            emit('select', file)
        }
    } catch {
        // HTTP 错误由拦截器统一处理
    } finally {
        uploading.value = false
        input.value = ''
    }
}

async function doUpload(file: File): Promise<void> {
    const controller = new AbortController()
    abortController.value = controller
    progress.value = 0

    // 弹上传进度通知（含右上角 × 取消）
    let notifyControl: UploadNotifyControl | undefined
    notifyControl = showUploadNotification({
        title: file.name,
        onCancel: () => {
            controller.abort()
            notifyControl?.close()
        },
    })
    uploadNotify.value = notifyControl

    try {
        const res = await uploadFile(
            { file, category: props.category, url: props.action },
            {
                signal: controller.signal,
                onUploadProgress: (event) => {
                    const percent = event.total
                        ? Math.round((event.loaded / event.total) * 100)
                        : 0
                    progress.value = percent
                    notifyControl?.update(percent)
                },
            }
        )
        notifyControl.close()
        if (res.code === 200) {
            emit('update:modelValue', res.data.storedFileName)
            emit('upload-success', res.data)
        } else {
            DMessage.error(res.msg || '上传失败')
            emit('upload-error', res)
        }
    } catch (err) {
        // 失败或取消都关闭进度通知；错误提示由响应拦截器统一处理
        notifyControl.close()
        emit('upload-error', err)
        throw err
    } finally {
        if (abortController.value === controller) {
            abortController.value = undefined
        }
    }
}

/**
 * 组件内取消上传（占位区的 ×）：先确认再 abort
 */
function handleCancelUpload() {
    DConfirm('确定要取消当前上传吗？', '取消上传', {
        type: 'warning',
        confirmButtonText: '取消上传',
        cancelButtonText: '继续上传',
    })
        .then(() => {
            abortController.value?.abort()
            uploadNotify.value?.close()
        })
        .catch(() => {
            // 用户选择继续上传，忽略
        })
}

function formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)}MB`
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)}KB`
    return `${bytes}B`
}

defineExpose({ openPicker, clearFile, fileInputRef })
</script>

<style scoped lang="scss">
@use '@ui/styles/mixin' as *;

.d-upload {
    position: relative;
    display: inline-block;

    &--disabled {
        opacity: 0.6;
        pointer-events: none;
    }

    &__input {
        display: none;
    }

    &__trigger {
        cursor: pointer;
    }

    &__area {
        position: relative;
        border: 1px dashed var(--dz-border);
        border-radius: 8px;
        overflow: hidden;
        transition: border-color 0.2s;
        @include flex(center, center);

        &:hover {
            border-color: var(--dz-primary);
        }
    }

    &__preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__placeholder {
        @include flex(center, center);
        flex-direction: column;
        gap: 8px;
        width: 100%;
        height: 100%;
        color: var(--dz-text-l);
        font-size: 14px;
    }

    &__progress {
        width: 60%;
        height: 6px;
        border-radius: 3px;
        background: var(--dz-bg-secondary);
        overflow: hidden;
    }

    &__progress-inner {
        display: block;
        height: 100%;
        border-radius: 3px;
        background: var(--dz-primary);
        transition: width 0.2s;
    }

    &__progress-text {
        font-size: 12px;
        color: var(--dz-text-l);
    }

    &__progress-cancel {
        cursor: pointer;
        color: var(--dz-text-l);

        &:hover {
            color: var(--dz-text);
        }
    }

    &__remove {
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 1;
        cursor: pointer;
        border-radius: 50%;
        background: var(--dz-scrim);
        color: var(--dz-on-fill);
        padding: 2px;
        @include flex(center, center);

        &:hover {
            background: var(--dz-scrim-strong);
        }
    }
}
</style>

<!-- 上传进度通知样式（通知渲染在 body，需全局样式；mixin 由 vite additionalData 注入） -->
<style lang="scss">
.d-upload-notify-root {
    // 通知自带空标题（进度信息在消息体内）
    .el-notification__title {
        display: none;
    }
}

.d-upload-notify {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    min-width: 240px;

    &__header {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    &__title {
        flex: 1;
        min-width: 0;
        font-size: 13px;
        color: var(--dz-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__percent {
        flex-shrink: 0;
        font-size: 12px;
        color: var(--dz-text-l);
    }

    &__close {
        flex-shrink: 0;
        cursor: pointer;
        width: 20px;
        height: 20px;
        font-size: 14px;
        line-height: 1;
        color: var(--dz-text-l);
        @include flex(center, center);

        &:hover {
            color: var(--dz-text);
        }
    }

    &__progress {
        height: 6px;
        border-radius: 3px;
        background: var(--dz-bg-secondary);
        overflow: hidden;
    }

    &__progress-inner {
        display: block;
        height: 100%;
        border-radius: 3px;
        background: var(--dz-primary);
        transition: width 0.2s;
    }
}
</style>
