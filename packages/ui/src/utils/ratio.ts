/**
 * 宽高比 → padding-top 百分比（`aspect-ratio` 的低版本内核兜底）
 *
 * `aspect-ratio` 自 Chrome 88 起支持，本库最低支持 Chrome 86，该声明在更低版本会被整条丢弃、
 * 盒子塌成内容高度。经典兜底是在容器里放一块 `padding-top: <百分比>` 的占位，百分比按宽度解析，
 * 与 `aspect-ratio` 算出的高度完全一致，因此两条路径可以同时存在而不冲突。
 *
 * 支持 `16 / 9`、`16/9` 两种分数写法，以及 `1.7778` 这类十进制宽高比（宽 / 高）。
 * 解析不出正数时返回 `null` —— 调用方此时不下发兜底值，行为与不写兜底一致（同旧版塌陷）。
 */
export function ratioToPaddingTop(ratio?: string | number | null): string | null {
    if (ratio === undefined || ratio === null) return null
    const text = String(ratio).trim()
    if (!text) return null

    // 分数写法：宽 / 高
    const fraction = text.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/)
    if (fraction) {
        const width = Number(fraction[1])
        const height = Number(fraction[2])
        if (width <= 0 || height <= 0) return null
        return toPercent((height / width) * 100)
    }

    // 十进制写法：宽 / 高（如 1.7778）
    const decimal = Number(text)
    if (Number.isFinite(decimal) && decimal > 0) return toPercent(100 / decimal)

    return null
}

/** 最多 4 位小数并去掉多余的 0：56.25 → '56.25%' */
function toPercent(value: number): string {
    return `${Number(value.toFixed(4))}%`
}
