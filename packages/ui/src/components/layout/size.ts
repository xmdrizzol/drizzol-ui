import { pxToRem } from '@ui/utils/pxToRem'

/**
 * 把布局尺寸 prop 归一为 CSS 长度：
 * - number → 视作 px，转 rem（1rem = 16px，与库内 pxToRem 一致；如 48 → '3rem'）
 * - 纯数字串 / 以 px 结尾的串 → 转 rem（如 '48' / '48px' → '3rem'；修复纯属性传参无单位的非法 CSS）
 * - 其余（rem / % / vh / em / auto 等）原样返回，便于传百分比、视口单位或缩放值
 * - null / undefined → undefined（不写内联样式，交给 CSS 默认值，主题可覆写）
 */
export function toSize(value?: number | string): string | undefined {
    if (value == null) return undefined
    if (typeof value === 'number') return pxToRem(value)
    const trimmed = value.trim()
    if (/^\d+(\.\d+)?$/.test(trimmed) || /^\d+(\.\d+)?px$/.test(trimmed)) {
        return pxToRem(parseFloat(trimmed))
    }
    return value
}
