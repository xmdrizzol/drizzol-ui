/**
 * DDropdown 菜单定位计算（纯函数）：jsdom 无布局引擎，组件内测不了，故独立出来便于单测。
 * 策略为「shift」：以水平居中 + 贴 trigger 下方为基准，越出视口的边整体平移夹取。
 */

export interface Rect {
    left: number
    top: number
    width: number
    height: number
}

export interface Size {
    width: number
    height: number
}

export interface MenuPosition {
    /** 菜单相对 trigger 容器的偏移（写入 .d-dropdown-menu 的 top / left） */
    top: number
    left: number
    /** 箭头相对菜单的偏移（写入 .d-dropdown__arrow 的 top / left） */
    arrowTop: number
    arrowLeft: number
    /** 菜单为适配边界平移后箭头不再指向 trigger 时隐藏 */
    arrowVisible: boolean
}

/** 视口安全边距：菜单与窗口边缘保持的距离 */
export const VIEWPORT_GUTTER = 8
/** 箭头相对菜单边缘的最小留白（避免压到圆角上） */
export const ARROW_INSET = 8

/**
 * 把 value 夹取到 [min, max]；当 min > max（菜单比视口还大）时对齐到 min，
 * 即优先保住左/上边缘的 GUTTER，另一侧自然溢出。
 */
function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), Math.max(min, max))
}

/**
 * @param triggerRect 触发器的视口矩形
 * @param menuSize    菜单尺寸
 * @param arrowSize   箭头渲染盒尺寸（含透明边框）
 * @param viewport    当前视口尺寸
 */
export function computeMenuPosition(
    triggerRect: Rect,
    menuSize: Size,
    arrowSize: Size,
    viewport: Size,
): MenuPosition {
    // 基准：水平居中于 trigger，垂直贴其下方（箭头一半露在 trigger 与菜单之间）
    const centeredLeft = -(menuSize.width - triggerRect.width) / 2
    const baseTop = triggerRect.height + arrowSize.height / 2

    // 视口约束换算为「菜单相对 trigger 容器的偏移」的上下界
    const minLeft = VIEWPORT_GUTTER - triggerRect.left
    const maxLeft = viewport.width - VIEWPORT_GUTTER - menuSize.width - triggerRect.left
    const left = clamp(centeredLeft, minLeft, maxLeft)

    const minTop = VIEWPORT_GUTTER - triggerRect.top
    const maxTop = viewport.height - VIEWPORT_GUTTER - menuSize.height - triggerRect.top
    const top = clamp(baseTop, minTop, maxTop)

    // 菜单水平平移 dx 后，箭头反向跟随才能继续指向 trigger 中心；跟随不了时夹在菜单边内
    const dx = left - centeredLeft
    const halfArrow = arrowSize.width / 2
    const arrowIdeal = menuSize.width / 2 - halfArrow - dx
    const arrowLeft = clamp(
        arrowIdeal,
        ARROW_INSET,
        menuSize.width - arrowSize.width - ARROW_INSET,
    )

    // 垂直被夹取（trigger 过低 / 菜单高于视口）时，箭头不再贴着 trigger，隐藏避免误导
    const arrowVisible = top === baseTop

    return { top, left, arrowTop: -arrowSize.height, arrowLeft, arrowVisible }
}
