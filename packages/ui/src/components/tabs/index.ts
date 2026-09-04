import { withInstall } from '@ui/with-install'
import Tabs from './index.vue'

/** 标签页数据 */
export interface DTabItem {
    /** 唯一 key（激活状态与内容插槽名） */
    key: string
    /** 标签文字 */
    label: string
    /** 禁用 */
    disabled?: boolean
}

/** d-tabs 标签页（内容随激活 key 通过同名插槽渲染） */
export const DTabs = withInstall(Tabs, 'DTabs')

export default DTabs
