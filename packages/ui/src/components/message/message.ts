// 命令式消息提示（替代 ElMessage）：顶部居中堆叠，自动随主题色
import { createVNode, render } from 'vue'
import Message from './Message.vue'

export type MessageType = 'success' | 'error' | 'warning' | 'info'

export interface MessageOptions {
    /** 消息类型 */
    type?: MessageType
    /** 文本内容 */
    text: string
    /** 自动关闭时长（ms），0 表示不自动关，默认 3000 */
    duration?: number
}

export interface MessageHandle {
    /** 手动关闭 */
    close: () => void
}

let container: HTMLElement | null = null

function getContainer(): HTMLElement {
    if (!container) {
        container = document.createElement('div')
        container.className = 'd-message-container'
        document.body.appendChild(container)
    }
    return container
}

function show(options: MessageOptions): MessageHandle {
    const host = document.createElement('div')
    getContainer().appendChild(host)

    const vnode = createVNode(Message, {
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

/**
 * 命令式消息提示
 * @example DMessage.error('请求失败')
 * @example DMessage({ type: 'success', text: '已保存', duration: 2000 })
 */
export const DMessage = (options: MessageOptions | string): MessageHandle =>
    show(typeof options === 'string' ? { text: options } : options)

DMessage.success = (text: string, duration?: number) => show({ type: 'success', text, duration })
DMessage.error = (text: string, duration?: number) => show({ type: 'error', text, duration })
DMessage.warning = (text: string, duration?: number) => show({ type: 'warning', text, duration })
DMessage.info = (text: string, duration?: number) => show({ type: 'info', text, duration })
