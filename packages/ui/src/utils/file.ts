import type { FileCategory } from '@/types/api'

/** 文件访问前缀（拼接规则与后端契约一致，可通过 configureFileAccessPrefix 调整） */
let accessPrefix = '/api/general/file/access/'

/**
 * 配置文件访问前缀（后端地址不同于默认时调用）
 * @param prefix 如 `https://api.example.com/api/general/file/access`
 */
export function configureFileAccessPrefix(prefix: string) {
  accessPrefix = prefix.endsWith('/') ? prefix : prefix + '/'
}

/**
 * 将 fileRef（格式 `${type}/${storedFileName}`）拼接为可访问的文件 URL
 * 若已是完整 accessUrl 则直接返回（幂等）
 * @param fileRef - 如 `image/e6fe8463.png` 或完整 accessUrl
 * @param type - 文件类型，当 fileRef 不包含类型时必填 字段 "image" | "video" | "music" | "document" | "archive" | "material" | "other"
 * @returns 完整访问 URL，如 `/api/general/file/access/image/xxx.png`
 */
export function getFileAccessUrl(fileRef: string, type: FileCategory = 'image'): string {
    if (!fileRef) return ''
    if (fileRef.startsWith(accessPrefix)) return fileRef
    if (fileRef.startsWith('http') || fileRef.startsWith('blob:') || fileRef.startsWith('data:')) return fileRef
    return `${accessPrefix}${type}/${fileRef}`
}
