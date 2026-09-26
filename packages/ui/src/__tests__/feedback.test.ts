// 命令式提示四件套测试：message / notification / confirm / DDrawer（+ upload-notify）
import { describe, it, expect, afterEach, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { DMessage } from '@ui/components/message'
import { DNotification } from '@ui/components/notification'
import { DConfirm } from '@ui/components/confirm'
import DDrawer from '@ui/components/drawer'
import { showUploadNotification } from '@ui/components/upload'
import { showUploadNotification as rootShowUploadNotification } from '@ui'
import { DLoadingBar } from '@ui/components/loading-bar'

const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

describe('message', () => {
  // 命令式 toast 靠 duration/句柄自清；这里兜底清理，避免影响后续用例计数
  afterEach(() => {
    document.querySelectorAll('.d-message, .d-notification').forEach(el => el.remove())
  })

  it('不同类型渲染对应的状态图标', async () => {
    DMessage.success('成功')
    DMessage.error('失败')
    await wait(30)
    const hrefs = [...document.querySelectorAll('.d-message use')]
      .map(u => u.getAttribute('xlink:href') || u.getAttribute('href'))
    expect(hrefs).toContain('#dz-icon-circle-check')  // success
    expect(hrefs).toContain('#dz-icon-circle-close')  // error
  })

  it('success 渲染文本，duration 后自动移除', async () => {
    DMessage.success('保存成功', 60)
    expect(document.querySelector('.d-message')?.textContent).toContain('保存成功')
    await wait(500)
    expect(document.querySelector('.d-message')).toBeNull()
  })

  it('close() 可手动关闭', async () => {
    const handle = DMessage({ type: 'error', text: '请求失败', duration: 0 })
    await wait(30)
    expect(document.querySelector('.d-message')?.textContent).toContain('请求失败')
    handle.close()
    await wait(400)
    expect(document.querySelector('.d-message')).toBeNull()
  })
})

describe('notification', () => {
  it('渲染标题与 VNode 正文，close() 关闭，customClass 生效', async () => {
    const handle = DNotification({
      title: '文件上传',
      message: h('div', { class: 'fake-progress' }, '42%'),
      duration: 0,
      customClass: 'my-notify',
    })
    await wait(30)
    const el = document.querySelector('.d-notification.my-notify')
    expect(el?.textContent).toContain('文件上传')
    expect(el?.querySelector('.fake-progress')?.textContent).toBe('42%')
    handle.close()
    await wait(400)
    expect(document.querySelector('.my-notify')).toBeNull()
  })

  it('beforeClose 返回 false 阻止关闭，返回 true 放行', async () => {
    let calls = 0
    const handle = DNotification({
      title: '拦截测试',
      message: 'm',
      duration: 0,
      beforeClose: () => (calls++, calls < 2 ? false : true),
    })
    await wait(30)
    const closeBtn = document.querySelector('.d-notification__close') as HTMLButtonElement
    closeBtn.click()
    await wait(60)
    expect(calls).toBe(1)
    expect(document.querySelector('.d-notification')).not.toBeNull() // 被拦截
    closeBtn.click()
    await wait(400)
    expect(document.querySelector('.d-notification')).toBeNull() // 放行
  })

  it('beforeClose 为异步 Promise：resolve 后关闭', async () => {
    const handle = DNotification({
      title: '异步拦截',
      message: 'm',
      duration: 0,
      beforeClose: () => wait(50).then(() => true),
    })
    await wait(30)
    ;(document.querySelector('.d-notification__close') as HTMLButtonElement).click()
    await wait(400)
    expect(document.querySelector('.d-notification')).toBeNull()
  })

  it('程序化 close() 不经过 beforeClose', async () => {
    const beforeClose = vi.fn(() => false)
    const handle = DNotification({ title: 'x', message: 'm', duration: 0, beforeClose })
    await wait(30)
    handle.close()
    await wait(400)
    expect(beforeClose).not.toHaveBeenCalled()
    expect(document.querySelector('.d-notification')).toBeNull()
  })

  it('close() 幂等：淡出途中重复 close 不留 opacity:0 占位', async () => {
    const handle = DNotification({ title: 'x', message: 'm', duration: 0 })
    await wait(30)
    handle.close()
    // 240ms 淡出未结束时二次 close（模拟宿主在 ✕ 确认放行后 catch 兜底再 close）
    handle.close()
    await wait(400)
    // 若幂等被破坏，第二次 close 会清掉销毁定时器，节点以 opacity:0 永久占位
    const leftover = document.querySelector('.d-notification') as HTMLElement | null
    expect(leftover).toBeNull()
  })
})

describe('confirm', () => {
  it('点确定 resolve("confirm")', async () => {
    let outcome = ''
    DConfirm('确定删除吗？', '删除', { type: 'warning', confirmButtonText: '删掉' })
      .then(v => { outcome = v })
      .catch(e => { outcome = String(e) })
    await wait(60)
    const btn = [...document.querySelectorAll('.d-modal__footer button')]
      .find(b => b.textContent?.trim() === '删掉')
    expect(btn).toBeTruthy()
    ;(btn as HTMLButtonElement).click()
    await wait(60)
    expect(outcome).toBe('confirm')
    await wait(400) // 等卸载清理
  })

  it('点取消 reject("cancel")', async () => {
    let outcome = ''
    DConfirm('确定取消上传吗？', '取消上传')
      .then(v => { outcome = v })
      .catch(e => { outcome = String(e) })
    await wait(60)
    const btn = [...document.querySelectorAll('.d-modal__footer button')]
      .find(b => b.textContent?.trim() === '取消')
    ;(btn as HTMLButtonElement).click()
    await wait(60)
    expect(outcome).toBe('cancel')
    await wait(400)
  })
})

describe('DDrawer', () => {
  // jsdom 下 Teleport+Transition 的卸载时序有怪癖：部分用例卸载后会在 body 残留游离的
  // 抽屉节点（真实浏览器无此问题，最小复现 unmount 清理正常）。清理以保证后续用例查询确定。
  afterEach(() => {
    document.querySelectorAll('.d-drawer').forEach(el => el.remove())
  })

  it('visible 时渲染面板，size 经 pxToRem 转换', async () => {
    const wrapper = mount(DDrawer, {
      props: { visible: true, title: '抽屉', size: 380 },
      slots: { default: () => h('div', '内容') },
    })
    await wait(30)
    const panel = document.querySelector('.d-drawer__panel') as HTMLElement
    expect(panel).toBeTruthy()
    expect(panel.textContent).toContain('抽屉')
    expect(panel.textContent).toContain('内容')
    expect(panel.style.width).toBe('23.75rem') // 380 / 16
    wrapper.unmount()
  })

  it('点遮罩与 Escape 触发 update:visible + close', async () => {
    const wrapper = mount(DDrawer, { props: { visible: true, title: '抽屉' } })
    await wait(30)
    ;(document.querySelector('.d-drawer__mask') as HTMLElement).click()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toBeTruthy()
    wrapper.unmount()
  })

  it('before-close 拦截关闭，调用 done 后才真正关闭', async () => {
    const beforeClose = vi.fn(() => { /* 不立即 done，模拟异步确认 */ })
    const wrapper = mount(DDrawer, {
      props: { visible: true, title: '抽屉', beforeClose },
      slots: { default: () => h('div', '内容') },
    })
    await wait(30)
    ;(document.querySelector('.d-drawer__mask') as HTMLElement).click()
    expect(beforeClose).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('update:visible')).toBeUndefined() // 未被强制关闭
    beforeClose.mock.calls[0][0]() // 调用 done() 才真正关闭
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('open 事件随 v-model 置 true 触发', async () => {
    const wrapper = mount(DDrawer, { props: { visible: false, title: '抽屉' } })
    await wrapper.setProps({ visible: true })
    expect(wrapper.emitted('open')).toBeTruthy()
    await wrapper.setProps({ visible: false })
    // 程序化关闭不触发 close：close 仅在用户发起关闭（遮罩/Esc/×）时由 requestClose 发出
    expect(wrapper.emitted('close')).toBeUndefined()
    wrapper.unmount()
    // opened / closed 为动画完成事件（@after-enter/@after-leave），jsdom 下不可靠，浏览器验证
  })

  it('嵌套抽屉：Esc 只关闭最上层', async () => {
    const outer = mount(DDrawer, { props: { visible: true, title: '外层' } })
    const inner = mount(DDrawer, { props: { visible: true, title: '内层' } })
    await wait(30)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wait(60)
    expect(outer.emitted('update:visible')?.length ?? 0).toBe(0) // 外层不动
    expect(inner.emitted('update:visible')?.[0]).toEqual([false]) // 内层先关
    // 模拟 v-model 响应：宿主将内层 visible 置 false，内层令牌出栈
    await inner.setProps({ visible: false })
    await wait(450) // 内层 leave 完成、出栈
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wait(450)
    expect(outer.emitted('update:visible')?.length ?? 0).toBe(1) // 再按才关外层
    outer.unmount(); inner.unmount()
  })

  it.each(['rtl', 'ltr', 'ttb', 'btt'] as const)('direction=%s：贴边类与滑出位移正确', async (direction) => {
    const wrapper = mount(DDrawer, {
      props: { visible: true, direction, size: 300 },
      slots: { default: () => h('div', '内容') },
    })
    await wait(30)
    // DDrawer Teleport 到 body，需从 document 查询（wrapper.find 查不到）
    const root = document.querySelector('.d-drawer') as HTMLElement
    expect(root.className).toContain(`d-drawer--${direction}`)

    const allPanels = document.querySelectorAll('.d-drawer__panel')
    console.log('DBG panels in document:', allPanels.length)
    const panel = allPanels[allPanels.length - 1] as HTMLElement
    const expectedFrom = {
      rtl: 'translateX(100%)',
      ltr: 'translateX(-100%)',
      ttb: 'translateY(-100%)',
      btt: 'translateY(100%)',
    }[direction]
    expect(panel.getAttribute('style').replace(/\s+/g, '')).toContain(`--dz-drawer-from:${expectedFrom}`.replace(/\s+/g, ''))
    // 尺寸映射：横向为宽、纵向为高（300 / 16 = 18.75rem）
    if (direction === 'rtl' || direction === 'ltr') {
      expect(panel.style.width).toBe('18.75rem')
    } else {
      expect(panel.style.height).toBe('18.75rem')
    }
    wrapper.unmount()
  })
})

describe('upload-notify', () => {
  afterEach(() => {
    document.querySelectorAll('.d-notification').forEach(el => el.remove())
  })

  it('包根可导出（宿主从 @xmdrizzol/drizzol-ui 直接导入）', () => {
    expect(typeof rootShowUploadNotification).toBe('function')
  })

  it('渲染：标题行走默认头部（含图标），正文为进度条 + 百分比', async () => {
    const control = showUploadNotification({ title: '课件.zip' })
    await wait(30)
    // 标题行：DNotification 默认头部（类型图标 + 文件名）
    expect(document.querySelector('.d-upload-notify-root .d-notification__title')?.textContent).toBe('课件.zip')
    const root = document.querySelector('.d-upload-notify-root')!
    expect(root.querySelector('.d-progress__bar')).toBeTruthy()
    expect(root.querySelector('.d-progress__text')?.textContent).toBe('0%')
    control.close()
  })

  it('update 收敛到 0-100 并取整，进度响应式刷新', async () => {
    const control = showUploadNotification({ title: 'x' })
    control.update(150)
    await wait(30)
    const percent = () => document.querySelector('.d-progress__text')?.textContent
    expect(percent()).toBe('100%')
    control.update(-5)
    await wait(30)
    expect(percent()).toBe('0%')
    control.update(62)
    await wait(30)
    expect(percent()).toBe('62%')
    control.close()
  })

  it('未传 onCancel：不渲染 ✕（纯进度展示，由调用方 close() 收尾）', () => {
    const control = showUploadNotification({ title: 'x' })
    expect(document.querySelector('.d-upload-notify-root .d-notification__close')).toBeNull()
    control.close()
  })

  it('点标题行 ✕ 先弹确认框，确认后触发 onCancel 并关闭通知', async () => {
    const onCancel = vi.fn()
    const control = showUploadNotification({ title: 'x', onCancel })
    ;(document.querySelector('.d-upload-notify-root .d-notification__close') as HTMLButtonElement).click()
    await wait(60)
    const confirmBtn = [...document.querySelectorAll('.d-modal__footer button')]
      .find(b => b.textContent?.trim() === '取消上传')
    expect(confirmBtn).toBeTruthy()
    ;(confirmBtn as HTMLButtonElement).click()
    await wait(60)
    expect(onCancel).toHaveBeenCalledTimes(1)
    await wait(400) // 等通知离场与弹窗卸载清理
  })
})

describe('loading-bar', () => {
  afterEach(() => {
    DLoadingBar.done()
  })

  it('start 显示顶部条并自增，done 冲刺后隐藏', async () => {
    DLoadingBar.start()
    await wait(600)
    const el = document.querySelector('.d-loading-bar') as HTMLElement
    expect(el).toBeTruthy()
    expect(el.style.display).toBe('block')
    const inner = el.querySelector('.d-loading-bar__inner') as HTMLElement
    // 自增封顶 90%，不会假完成
    expect(parseFloat(inner.style.width)).toBeGreaterThan(0)
    expect(parseFloat(inner.style.width)).toBeLessThanOrEqual(90)
    // 默认高度必须在挂载时落地：否则 height:auto + 子元素 100% 坍缩为 0，条不可见
    expect(el.style.height).toBe('0.125rem')
    DLoadingBar.done()
    await wait(800)
    expect((document.querySelector('.d-loading-bar') as HTMLElement).style.display).toBe('none')
  })

  it('start 后立即 done：以剩余时长滑动冲刺（过程可见），期满淡出', async () => {
    DLoadingBar.start()
    DLoadingBar.done()
    await wait(30) // 等 Vue 异步渲染落地
    const inner = document.querySelector('.d-loading-bar__inner') as HTMLElement
    // 冲刺过渡 = 剩余的最短展示时长（约 400ms），宽度仍在滑向 100%
    expect(parseFloat((inner.style.transition.match(/width (\d+)ms/) ?? [])[1] ?? '0')).toBeGreaterThanOrEqual(300)
    expect(inner.style.width).toBe('100%')
    await wait(150)
    // 瞬时完成的场景下仍可见（SPA 路由切换即此场景）
    expect(getComputedStyle(document.querySelector('.d-loading-bar')).display).toBe('block')
    await wait(800)
    expect((document.querySelector('.d-loading-bar') as HTMLElement).style.display).toBe('none')
  })

  it('重复 start 不叠加（全局单例）', async () => {
    DLoadingBar.start()
    DLoadingBar.start()
    DLoadingBar.start()
    await wait(100)
    expect(document.querySelectorAll('.d-loading-bar').length).toBe(1)
    DLoadingBar.done()
    await wait(1000)
  })

  it('未 start 直接 done 安全收尾', async () => {
    DLoadingBar.done()
    await wait(1000)
    expect((document.querySelector('.d-loading-bar') as HTMLElement).style.display).toBe('none')
  })

  it('set 直接指定进度', async () => {
    DLoadingBar.start()
    DLoadingBar.set(66)
    await wait(50)
    const inner = document.querySelector('.d-loading-bar__inner') as HTMLElement
    expect(inner.style.width).toBe('66%')
    DLoadingBar.done()
    await wait(1000)
  })
})
