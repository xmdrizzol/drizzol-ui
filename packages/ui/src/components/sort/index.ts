import { withInstall } from '@ui/with-install'
import Sort from './index.vue'

export interface SortFilterParams {
    sortBy: string
    desc: boolean
    dateStart: string
    dateEnd: string
    status: string
}

/** 状态筛选选项（宿主自定义，如：published/draft） */
export interface SortStatusOption {
    value: string
    label: string
}

/** d-sort 排序筛选组件 */
export const DSort = withInstall(Sort, 'DSort')

export default DSort
