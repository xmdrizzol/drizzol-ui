// 文件上传 API（默认与后端契约：POST /api/general/file/upload[/image]，/api 来自 request 的 baseURL）
// 接口路径不写死：可用 configureFileApi 全局调整，单次调用可用 params.url 覆盖
import request from './request'
import type { AxiosRequestConfig } from 'axios'
import type { ApiResponse, FileCategory } from '@ui/types/api'

/** 上传响应 */
export interface UploadFileResponse {
    storedFileName: string
    accessUrl: string
}

/** 上传参数 */
export interface UploadParams {
    file: File | Blob
    category?: FileCategory
    /** 上传接口路径（相对 baseURL 的路径或完整 URL）；不传用全局配置（configureFileApi） */
    url?: string
}

/** 文件上传接口配置 */
export interface FileApiConfig {
    /** 上传文件接口路径（默认 /general/file/upload） */
    uploadUrl?: string
    /** 上传裁剪图片接口路径（默认 /general/file/upload/image） */
    uploadImageUrl?: string
}

// 接口路径模块级状态：库构建后没有 import.meta.env，宿主环境差异一律运行时配置
let uploadUrl = '/general/file/upload'
let uploadImageUrl = '/general/file/upload/image'

/**
 * 配置文件上传接口路径（后端路径不同于默认契约时，宿主在入口调用一次）
 * @example configureFileApi({ uploadUrl: '/v2/file/upload', uploadImageUrl: '/v2/file/upload-image' })
 */
export function configureFileApi(config: FileApiConfig) {
    if (config.uploadUrl) uploadUrl = config.uploadUrl
    if (config.uploadImageUrl) uploadImageUrl = config.uploadImageUrl
}

/**
 * 上传文件
 * @param params 文件参数（FormData 字段：File + CustomCategory）
 */
export function uploadFile(params: UploadParams, config?: AxiosRequestConfig): Promise<ApiResponse<UploadFileResponse>> {
    const { file, category, url = uploadUrl } = params
    const formData = new FormData()

    if (file instanceof File) {
        formData.append('File', file)
    } else {
        formData.append('File', file, `${Date.now()}.png`)
    }

    if (category) {
        formData.append('CustomCategory', category)
    }

    return request.post(url, formData,
        {
            headers: { 'Content-Type': undefined },
            ...config,
        })
}

/**
 * 上传裁剪图片
 * @param params 图片参数（FormData 字段：File）
 */
export function uploadImage(params: { file: Blob; url?: string }): Promise<ApiResponse<UploadFileResponse>> {
    const { file, url = uploadImageUrl } = params
    const formData = new FormData()
    formData.append('File', file, `${Date.now()}.png`)

    // Content-Type 置空：交给浏览器/axios 生成带 boundary 的 multipart 头，
    // 手动写成 'multipart/form-data' 会顶掉 boundary 导致后端解析失败
    return request.post(url, formData, {
        headers: { 'Content-Type': undefined },
    })
}
