import type { FileCategory } from '@ui/types/api'

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

/** 带类型前缀的 fileRef（如 image/xxx.png）；不含 http 等完整 URL（避免误匹配 path 里的 type/） */
const TYPED_FILE_REF = /^(image|video|music|document|archive|material|other)\/([^/]+)$/

/**
 * 文件引用的宽容解析（getFileAccessUrl 的增强入口）：
 * - 完整 URL（http/blob/data）或已是 accessUrl：原样返回（幂等）
 * - 带类型前缀的 fileRef（`image/xxx.png`）：拆出类型后拼接（直接传给 getFileAccessUrl 会二次前缀成 image/image/）
 * - 纯存储文件名：按 defaultType 拼接
 */
export function resolveAccessUrl(fileRef: string, defaultType: FileCategory = 'image'): string {
    if (!fileRef) return ''
    const typed = fileRef.match(TYPED_FILE_REF)
    if (typed) return getFileAccessUrl(typed[2], typed[1] as FileCategory)
    return getFileAccessUrl(fileRef, defaultType)
}
