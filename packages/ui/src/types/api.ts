/** 统一响应结构（后端契约：code === 200 为成功） */
export interface ApiResponse<T = any> {
    code: number
    msg: string
    data: T
}

/** 文件类别 */
export type FileCategory = 'image' | 'video' | 'music' | 'document' | 'archive' | 'material' | 'other'

/** 通用发布状态 */
export type PublishStatus = 'draft' | 'published' | 'deleted'

/** 统一分页响应 */
export interface PageResponse<T> {
    items: T[]
    pageIndex: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasPrevious: boolean
    hasNext: boolean
}

/** 统一分页排序查询参数 */
export interface PageQuery {
    pageSize?: number
    pageIndex?: number
    sortBy?: string
    isDescending?: boolean
    isExport?: boolean
}
