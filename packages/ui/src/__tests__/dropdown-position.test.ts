// DDropdown 视口边界适配（shift 夹取）纯函数测试
// jsdom 没有布局引擎，组件内拿不到真实 rect，故定位计算抽在 position.ts 便于在此验证
import { describe, it, expect } from 'vitest'
import { computeMenuPosition, VIEWPORT_GUTTER, ARROW_INSET } from '@ui/components/dropdown/position'

// 常用尺寸：箭头渲染盒 16×16（0.5rem 透明边框），标准视口 1280×720
const ARROW = { width: 16, height: 16 }
const VP = { width: 1280, height: 720 }

describe('DDropdown 菜单视口边界适配', () => {
  it('居中且不越界：位置即基准（水平居中、贴 trigger 下方），箭头指向 trigger 中心', () => {
    const p = computeMenuPosition(
      { left: 600, top: 100, width: 80, height: 40 },
      { width: 200, height: 120 },
      ARROW,
      VP,
    )
    // 居中 left = -(200-80)/2；top = 40 + 16/2
    expect(p.left).toBe(-60)
    expect(p.top).toBe(48)
    // 箭头中心（600-60+92+8=640）= trigger 中心（600+40）
    expect(p.arrowLeft).toBe(92)
    expect(p.arrowTop).toBe(-16)
    expect(p.arrowVisible).toBe(true)
  })

  it('靠近右缘：菜单整体左移夹到视口右缘 GUTTER，箭头反向跟随仍指向 trigger 中心', () => {
    const p = computeMenuPosition(
      { left: 1200, top: 100, width: 60, height: 40 },
      { width: 200, height: 100 },
      ARROW,
      VP,
    )
    // 菜单视口左缘 = 1200 + (-128) = 1072，右缘 = 1272 = 1280 - 8
    expect(p.left).toBe(-128)
    // 箭头中心（1072+150+8=1230）= trigger 中心（1200+30）
    expect(p.arrowLeft).toBe(150)
    expect(p.arrowVisible).toBe(true)
  })

  it('靠近左缘：菜单整体右移夹到视口左缘 GUTTER，箭头同样跟随', () => {
    const p = computeMenuPosition(
      { left: 20, top: 100, width: 60, height: 40 },
      { width: 200, height: 100 },
      ARROW,
      VP,
    )
    // 菜单视口左缘 = 20 + (-12) = 8
    expect(p.left).toBe(-12)
    // 箭头中心（8+34+8=50）= trigger 中心（20+30）
    expect(p.arrowLeft).toBe(34)
  })

  it('偏移量极大时箭头夹在菜单边内（ARROW_INSET），不戳出菜单', () => {
    const p = computeMenuPosition(
      { left: 1270, top: 100, width: 20, height: 40 },
      { width: 200, height: 100 },
      ARROW,
      VP,
    )
    // 理想箭头位置已越出菜单右缘，夹到 200 - 16 - 8
    expect(p.arrowLeft).toBe(200 - 16 - ARROW_INSET)
  })

  it('trigger 过低：菜单整体上移使下缘贴视口 GUTTER，箭头失去指向意义被隐藏', () => {
    const p = computeMenuPosition(
      { left: 600, top: 650, width: 80, height: 40 },
      { width: 200, height: 120 },
      ARROW,
      VP,
    )
    // 菜单视口 top = 650 + (-58) = 592，下缘 = 712 = 720 - 8
    expect(p.top).toBe(-58)
    expect(p.arrowVisible).toBe(false)
  })

  it('菜单比视口还宽：优先保住左缘 GUTTER，右侧自然溢出', () => {
    const p = computeMenuPosition(
      { left: 100, top: 100, width: 60, height: 40 },
      { width: 400, height: 100 },
      ARROW,
      { width: 300, height: 720 },
    )
    // 菜单视口左缘 = 100 + (-92) = 8
    expect(p.left).toBe(-92)
    expect(VIEWPORT_GUTTER).toBe(8)
  })
})
