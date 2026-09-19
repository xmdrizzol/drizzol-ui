import type { FileCategory } from '@ui/types/api'

/**
 * 文件访问前缀：源码不内置任何后端地址，默认空。
 * 未配置时所有 src 原样返回（组件需传完整地址或相对路径）；
 * 后端按 `前缀 + {type}/{fileRef}` 契约提供文件时，宿主在入口调用 configureFileAccessPrefix 配置。
 */
let accessPrefix = ''

/** 宿主自定义解析器：设置后 src → URL 完全由宿主决定，内置前缀与豁免规则不再生效 */
let accessUrlResolver: ((src: string) => string) | undefined

/**
 * 配置文件访问前缀（后端按 `前缀 + {type}/{fileRef}` 契约提供文件时调用，如 drizzol 契约）
 * @param prefix 如 `https://api.example.com/api/general/file/access/`；传空串恢复默认（原样返回）
 */
export function configureFileAccessPrefix(prefix: string) {
  accessPrefix = prefix.endsWith('/') ? prefix : prefix + '/'
}

/**
 * 配置自定义访问地址解析器（完全接管，优先于前缀配置）：
 * d-image / d-avatar / d-upload 预览等所有访问地址都先交给 resolver，
 * 返回值直接使用，内置规则（前缀拼接、http/blob/data 与 `/` 相对路径豁免）不再生效；
 * 传入 undefined 恢复内置规则。resolver 收到的是组件/函数收到的原始 src。
 * @example configureFileAccessResolver(src => `${cdnHost}/${src}`)
 */
export function configureFileAccessResolver(resolver: ((src: string) => string) | undefined) {
  accessUrlResolver = resolver
}

/**
 * src 的 URL 语义（内置规则，均不内置后端地址）：
 * - `http(s)` / `blob:` / `data:` 开头：完整地址，原样使用
 * - `/` 开头：同源相对路径（如 `/uploads/xxx.png`，自建上传接口常见约定），原样使用
 * - 其余视为 fileRef（`type/storedFileName` 或裸 storedFileName）：
 *   已配置前缀 → 拼接 `${accessPrefix}${type}/${fileRef}`；未配置（默认）→ 原样返回
 * @param fileRef - 如 `image/e6fe8463.png`、`e6fe8463.png` 或 `/uploads/xxx.png`
 * @param type - 文件类型，当 fileRef 不包含类型时必填 字段 "image" | "video" | "music" | "document" | "archive" | "material" | "other"
 * @returns 完整访问 URL
 */
export function getFileAccessUrl(fileRef: string, type: FileCategory = 'image'): string {
    if (!fileRef) return ''
    if (accessUrlResolver) return accessUrlResolver(fileRef)
    // 服务端相对路径原样使用；fileRef（type/name 或裸文件名）不会以 / 开头
    if (fileRef.startsWith('/')) return fileRef
    if (fileRef.startsWith('http') || fileRef.startsWith('blob:') || fileRef.startsWith('data:')) return fileRef
    // 未配置前缀：库不内置后端地址，原样返回（宿主需 configureFileAccessPrefix 或 configureFileAccessResolver）
    if (!accessPrefix) return fileRef
    if (fileRef.startsWith(accessPrefix)) return fileRef
    return `${accessPrefix}${type}/${fileRef}`
}

/** 带类型前缀的 fileRef（如 image/xxx.png）；不含 http 等完整 URL（避免误匹配 path 里的 type/） */
const TYPED_FILE_REF = /^(image|video|music|document|archive|material|other)\/([^/]+)$/

/**
 * 文件引用的宽容解析（getFileAccessUrl 的增强入口）：
 * - 配置了 configureFileAccessResolver：原始 src 直接交给 resolver，内置规则不再生效
 * - 完整 URL（http/blob/data）、已是 accessUrl 或 `/` 开头的同源相对路径：原样返回（幂等）
 * - 已配置前缀时：带类型前缀的 fileRef（`image/xxx.png`）拆出类型后拼接（直接传给 getFileAccessUrl 会二次前缀成 image/image/），纯存储文件名按 defaultType 拼接
 * - 未配置前缀（默认）：一律原样返回（库不内置后端地址）
 */
export function resolveAccessUrl(fileRef: string, defaultType: FileCategory = 'image'): string {
    if (!fileRef) return ''
    if (accessUrlResolver) return accessUrlResolver(fileRef)
    if (!accessPrefix) return fileRef
    const typed = fileRef.match(TYPED_FILE_REF)
    if (typed) return getFileAccessUrl(typed[2], typed[1] as FileCategory)
    return getFileAccessUrl(fileRef, defaultType)
}
