// 上传进度通知
import { defineComponent, h, ref } from 'vue'
import { DConfirm } from '@ui/components/confirm'
import { DNotification } from '@ui/components/notification'
import type { NotificationHandle } from '@ui/components/notification'

export interface UploadNotifyControl {
    /** 更新进度（0-100） */
    update: (percent: number) => void
    /** 关闭通知 */
    close: () => void
}

interface UploadNotifyOptions {
    /** 文件名（显示在通知标题行） */
    title?: string
    /** 用户确认取消后的回调（执行真正的取消上传） */
    onCancel: () => void
}

/**
 * 显示上传进度通知
 * - 通知内渲染文件名 + 百分比 + 进度条，随 onUploadProgress 实时更新
 * - 右上角 ×：先弹确认框，确认后才触发 onCancel（统一走确认流程）
 * - 上传完成由调用方通过返回的 close() 关闭
 */
export function showUploadNotification(options: UploadNotifyOptions): UploadNotifyControl {
    const progress = ref(0)
    let handle: NotificationHandle | null = null

    // 右上角 ×：先确认再取消
    const handleCloseClick = () => {
        DConfirm('确定要取消当前上传吗？', '取消上传', {
            type: 'warning',
            confirmButtonText: '取消上传',
            cancelButtonText: '继续上传',
        })
            .then(() => {
                options.onCancel()
                handle?.close()
            })
            .catch(() => {
                // 用户选择继续上传，忽略
            })
    }

    handle = DNotification({
        title: '',
        // 渲染函数组件：内部读取响应式 progress，进度变化时重渲染进度条
        message: h(defineComponent({
            setup() {
                return () => h('div', { class: 'd-upload-notify' }, [
                    h('div', { class: 'd-upload-notify__header' }, [
                        h('span', { class: 'd-upload-notify__title' }, options.title || '文件上传'),
                        h('span', { class: 'd-upload-notify__percent' }, `${progress.value}%`),
                        h('span', { class: 'd-upload-notify__close', onClick: handleCloseClick }, '✕'),
                    ]),
                    h('div', { class: 'd-upload-notify__progress' }, [
                        h('div', {
                            class: 'd-upload-notify__progress-inner',
                            style: { width: `${progress.value}%` },
                        }),
                    ]),
                ])
            },
        })),
        showClose: false,
        duration: 0,
        customClass: 'd-upload-notify-root',
    })

    return {
        update(p: number) {
            progress.value = p
        },
        close() {
            handle?.close()
        },
    }
}
