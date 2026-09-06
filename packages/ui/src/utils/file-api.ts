// 文件上传 API（与后端契约：POST /api/general/file/upload[/image]）
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
}

/**
 * 上传文件
 * @param params 文件参数（FormData 字段：File + CustomCategory）
 */
export function uploadFile(params: UploadParams, config?: AxiosRequestConfig): Promise<ApiResponse<UploadFileResponse>> {
    const { file, category } = params
    const formData = new FormData()

    if (file instanceof File) {
        formData.append('File', file)
    } else {
        formData.append('File', file, `${Date.now()}.png`)
    }

    if (category) {
        formData.append('CustomCategory', category)
    }

    return request.post('/general/file/upload', formData,
        {
            headers: { 'Content-Type': undefined },
            ...config,
        })
}

/**
 * 上传裁剪图片
 * @param params 图片参数（FormData 字段：File）
 */
export function uploadImage(params: { file: Blob }): Promise<ApiResponse<UploadFileResponse>> {
    const { file } = params
    const formData = new FormData()
    formData.append('File', file, `${Date.now()}.png`)

    // Content-Type 置空：交给浏览器/axios 生成带 boundary 的 multipart 头，
    // 手动写成 'multipart/form-data' 会顶掉 boundary 导致后端解析失败
    return request.post('/general/file/upload/image', formData, {
        headers: { 'Content-Type': undefined },
    })
}
