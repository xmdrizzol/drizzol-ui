// 命令式确认框（替代 ElMessageBox.confirm）：基于 DModal + DButton
// 语义对齐 ElMessageBox：确定 resolve('confirm')，取消 reject('cancel')
import { createVNode, h, reactive, render } from 'vue'
import DModal from '@ui/components/modal'
import DButton from '@ui/components/button'
import './confirm.scss'

export interface ConfirmOptions {
    /** 确认按钮文案，默认「确定」 */
    confirmButtonText?: string
    /** 取消按钮文案，默认「取消」 */
    cancelButtonText?: string
    /** 语义类型（影响标题旁状态点颜色） */
    type?: 'info' | 'warning' | 'error'
}

/**
 * 命令式确认框
 * @example
 * DConfirm('确定删除吗？', '删除', { type: 'warning' })
 *   .then(() => doDelete())
 *   .catch(() => {}) // 用户取消
 */
export function DConfirm(message: string, title = '提示', options: ConfirmOptions = {}): Promise<'confirm'> {
    return new Promise((resolve, reject) => {
        const host = document.createElement('div')
        document.body.appendChild(host)

        const state = reactive({ visible: true })

        const finish = (action: 'confirm' | 'cancel') => {
            if (!state.visible) return
            state.visible = false
            // 等 DModal 出场过渡结束后再卸载
            setTimeout(() => {
                render(null, host)
                host.remove()
            }, 300)
            if (action === 'confirm') resolve('confirm')
            else reject('cancel')
        }

        const dotColor = options.type === 'error' ? 'var(--dz-danger)' : options.type === 'warning' ? 'var(--dz-warning)' : 'var(--dz-primary)'

        const vnode = createVNode(DModal, {
            visible: state.visible,
            title,
            width: 420,
            closable: false,
            maskClosable: false,
            'onUpdate:visible': (v: boolean) => {
                if (!v) finish('cancel')
            },
        }, {
            default: () => h('div', { class: 'd-confirm__message' }, [
                h('span', { class: 'd-confirm__dot', style: { background: dotColor } }),
                h('span', message),
            ]),
            footer: () => [
                h(DButton, { onClick: () => finish('cancel') }, { default: () => options.cancelButtonText ?? '取消' }),
                h(DButton, { type: 'primary', onClick: () => finish('confirm') }, { default: () => options.confirmButtonText ?? '确定' }),
            ],
        })
        render(vnode, host)
    })
}
