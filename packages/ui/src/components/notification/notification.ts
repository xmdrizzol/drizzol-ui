// 命令式通知（替代 ElNotification）：右上角堆叠，message 支持 VNode
import { createVNode, render, type VNode } from 'vue'
import Notification from './Notification.vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationOptions {
    /** 标题 */
    title?: string
    /** 正文：文本或 VNode（如上传进度条组件） */
    message?: string | VNode
    /** 类型（状态点颜色） */
    type?: NotificationType
    /** 自动关闭时长（ms），0 表示不自动关，默认 4500 */
    duration?: number
    /** 是否显示右上角关闭按钮，默认 true */
    showClose?: boolean
    /** 关闭前拦截：仅头部 ✕ 触发（程序化 close() 不经过）；返回 false 或 Promise reject 阻止关闭 */
    beforeClose?: () => boolean | Promise<boolean>
    /** 附加到根节点的自定义类 */
    customClass?: string
}

export interface NotificationHandle {
    /** 手动关闭 */
    close: () => void
}

let container: HTMLElement | null = null

function getContainer(): HTMLElement {
    if (!container) {
        container = document.createElement('div')
        container.className = 'd-notification-container'
        document.body.appendChild(container)
    }
    return container
}

/**
 * 命令式通知
 * @returns 句柄（close() 手动关闭，供上传完成等场景调用）
 */
export function DNotification(options: NotificationOptions): NotificationHandle {
    const host = document.createElement('div')
    getContainer().appendChild(host)

    const vnode = createVNode(Notification, {
        ...options,
        onDestroy: () => {
            render(null, host)
            host.remove()
        },
    })
    render(vnode, host)

    return {
        close: () => (vnode.component?.exposed as { close: () => void } | null)?.close(),
    }
}
