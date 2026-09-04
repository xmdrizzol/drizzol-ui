/**
 * 将后端返回的 UTC 时间转换为本地时区格式
 * @param utcStr  UTC 字符串（如 "2026-05-29T12:00:00"）
 * @returns 本地时间字符串 "YYYY-MM-DD HH:mm"
 */
export function formatDate(utcStr: string): string {
    if (!utcStr) return ''

    // 后端返回的 ISO 字符串可能不带时缀，补 Z 以 UTC 解析
    const normalized = utcStr.replace(' ', 'T')
    const date = new Date(normalized.includes('Z') || /[+-]\d{2}:\d{2}$/.test(normalized) ? normalized : normalized + 'Z')

    if (isNaN(date.getTime())) return utcStr
    // 手动 format 避免区域设置引入斜杠分隔
    const y = date.getFullYear()
    const M = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const h = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')
    return `${y}-${M}-${d} ${h}:${m}`
}
