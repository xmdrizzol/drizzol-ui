import { withInstall } from '@ui/with-install'
import Menu from './index.vue'

/** 菜单条目 */
export interface DMenuItem {
    /** 唯一 key（激活状态依据） */
    key: string
    /** 显示文本 */
    label: string
    /** 图标（裸名，如 fd-sunny） */
    icon?: string
    /** 路由目标：存在且宿主安装了 vue-router 时渲染为 router-link */
    to?: string | Record<string, unknown>
    /** 禁用 */
    disabled?: boolean
}

/** 菜单分组（分组模式：渲染小标题 + 条目） */
export interface DMenuGroup {
    label: string
    items: DMenuItem[]
}

/** d-menu 导航菜单组件 */
export const DMenu = withInstall(Menu, 'DMenu')

export { default } from './index.vue'
