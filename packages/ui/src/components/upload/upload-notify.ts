// 上传进度通知
import { defineComponent, h, ref } from 'vue'
import { DConfirm } from '@ui/components/confirm'
import { DNotification } from '@ui/components/notification'
import type { NotificationHandle } from '@ui/components/notification'

export interface UploadNotifyControl {
    /** 更新进度（0-100，超出范围自动收敛并取整） */
    update: (percent: number) => void
    /** 关闭通知 */
    close: () => void
}

interface UploadNotifyOptions {
    /** 通知标题（显示在头部行，默认"文件上传"） */
    title?: string
    /**
     * 用户确认取消后的回调（执行真正的取消上传）。
     * 可选：不传则为纯进度展示（不渲染取消 ✕）
     */
    onCancel?: () => void
}

/**
 * 显示上传进度通知：头部为标题（DNotification 默认头部，含类型图标），正文为进度条 + 百分比
 * - 可独立于 DUpload 使用：自行封装上传逻辑（如直传 OSS）时复用进度与取消确认
 * - ✕ 仅在传入 onCancel 时渲染；点击先弹确认框（取消上传/继续上传），确认才触发 onCancel
 * - 上传完成由调用方通过返回的 close() 关闭
 */
export function showUploadNotification(options: UploadNotifyOptions): UploadNotifyControl {
    const progress = ref(0)
    let handle: NotificationHandle | null = null

    // 正文 ✕：先确认再取消
    const handleCloseClick = () => {
        DConfirm('确定要取消当前上传吗？', '取消上传', {
            type: 'warning',
            confirmButtonText: '取消上传',
            cancelButtonText: '继续上传',
        })
            .then(() => {
                options.onCancel?.()
                handle?.close()
            })
            .catch(() => {
                // 用户选择继续上传，忽略
            })
    }

    handle = DNotification({
        // 文件名走通知标题行（类型图标由 DNotification 提供）；正文只放进度条
        title: options.title || '文件上传',
        // 渲染函数组件：内部读取响应式 progress，进度变化时重渲染进度条
        message: h(defineComponent({
            setup() {
                return () => h('div', { class: 'd-upload-notify' }, [
                    h('div', { class: 'd-upload-notify__bar' }, [
                        h('div', {
                            class: 'd-upload-notify__bar-inner',
                            style: { width: `${progress.value}%` },
                        }),
                    ]),
                    h('span', { class: 'd-upload-notify__percent' }, `${progress.value}%`),
                    options.onCancel
                        ? h('button', {
                            class: 'd-upload-notify__close',
                            title: '取消上传',
                            onClick: handleCloseClick,
                        }, '✕')
                        : null,
                ])
            },
        })),
        showClose: false,
        duration: 0,
        customClass: 'd-upload-notify-root',
    })

    return {
        update(p: number) {
            // 收敛到 0-100 并取整，宿主上报值不规整也能稳定展示
            progress.value = Math.min(100, Math.max(0, Math.round(p)))
        },
        close() {
            handle?.close()
        },
    }
}
