import { withInstall } from '@ui/with-install'
import Tabs from './index.vue'

/**
 * 标签页数据（key 泛型：宿主可传字面量联合获得编译期约束，
 * 如 DTabItem<'latest' | 'hot'>[]；默认 string 不破坏现有用法）
 */
export interface DTabItem<T extends string = string> {
    /** 唯一 key（激活状态与内容插槽名） */
    key: T
    /** 标签文字 */
    label: string
    /** 禁用 */
    disabled?: boolean
}

/** d-tabs 标签页（内容随激活 key 通过同名插槽渲染；panel=false 时仅渲染标签行） */
export const DTabs = withInstall(Tabs, 'DTabs')

export default DTabs
