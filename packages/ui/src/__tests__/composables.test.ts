// composables 单测：覆盖点击外部、滚动节流、进入视口、响应式移动判断
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useClickOutside } from '@ui/composables/useClickOutside'
import { useScrollListener } from '@ui/composables/useScrollListen'
import { useInView } from '@ui/composables/useInView'
import { useIsMobile } from '@ui/composables/useDevice'

/** 在真实组件作用域内运行 composable，并把返回值/句柄桥接给测试 */
function withSetup<T>(factory: () => T): { result: T; wrapper: ReturnType<typeof mount> } {
  let result!: T
  const Comp = defineComponent({
    setup() {
      result = factory()
      return () => h('div')
    },
  })
  const wrapper = mount(Comp)
  return { result, wrapper }
}

describe('useClickOutside', () => {
  it('点击目标外部触发回调、点击内部不触发', () => {
    const el = document.createElement('div')
    const inner = document.createElement('span')
    el.appendChild(inner)
    document.body.appendChild(el)
    const outside = document.createElement('div')
    document.body.appendChild(outside)

    const cb = vi.fn()
    const refEl = ref<HTMLElement | null>(el)
    const { result, wrapper } = withSetup(() => useClickOutside(refEl, cb))
    result.addListener()

    // 内部（含子节点）点击：不触发
    inner.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(cb).not.toHaveBeenCalled()

    // 外部点击：触发一次
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(cb).toHaveBeenCalledTimes(1)

    // removeListener 后外部点击不再触发
    result.removeListener()
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(cb).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    el.remove(); outside.remove()
  })

  it('支持多个目标 ref，任一命中即视为内部', () => {
    const a = document.createElement('div'); document.body.appendChild(a)
    const b = document.createElement('div'); document.body.appendChild(b)
    const cb = vi.fn()
    const { result, wrapper } = withSetup(() =>
      useClickOutside([ref<HTMLElement | null>(a), ref<HTMLElement | null>(b)], cb))
    result.addListener()
    b.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(cb).not.toHaveBeenCalled()
    result.removeListener()
    wrapper.unmount(); a.remove(); b.remove()
  })
})

describe('useScrollListener', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('无节流时每帧都回调', () => {
    const cb = vi.fn()
    const { wrapper } = withSetup(() => useScrollListener(cb))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(cb).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('节流时窗口内多次滚动只回一次，窗口结束后再计', () => {
    const cb = vi.fn()
    const { wrapper } = withSetup(() => useScrollListener(cb, 200))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    expect(cb).not.toHaveBeenCalled()
    vi.advanceTimersByTime(200)
    expect(cb).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('卸载后不再回调，且清除挂起的节流定时器', () => {
    const cb = vi.fn()
    const { wrapper } = withSetup(() => useScrollListener(cb, 200))
    window.dispatchEvent(new Event('scroll'))
    wrapper.unmount()
    vi.advanceTimersByTime(400)
    expect(cb).not.toHaveBeenCalled()
    // 卸载后监听已移除
    window.dispatchEvent(new Event('scroll'))
    expect(cb).not.toHaveBeenCalled()
  })
})

describe('useInView', () => {
  // 可控的 IntersectionObserver：记录被观察元素，暴露手动命中
  let instances: { observe: (el: any) => void; disconnect: () => void }[] = []
  let fire: (entry: { isIntersecting: boolean }) => void
  beforeEach(() => {
    instances = []
    class MockIO {
      cb: (entries: any[]) => void
      constructor(cb: (entries: any[]) => void) { this.cb = cb; instances.push(this as any) }
      observe() {}
      disconnect() { const i = instances.indexOf(this as any); if (i >= 0) instances.splice(i, 1) }
      trigger(intersecting: boolean) { this.cb([{ isIntersecting: intersecting }]) }
    }
    vi.stubGlobal('IntersectionObserver', MockIO)
    fire = (entry) => (instances[instances.length - 1] as any)?.trigger(entry.isIntersecting)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('元素挂载时已存在则观察，命中进入视口后置 true 并停止观察', () => {
    const target = ref<HTMLElement | null>(document.createElement('div'))
    const { result, wrapper } = withSetup(() => useInView(target))
    expect(instances.length).toBe(1)
    fire({ isIntersecting: true })
    expect(result.value).toBe(true)
    // 命中后自动 disconnect，实例被摘除
    expect(instances.length).toBe(0)
    wrapper.unmount()
  })

  it('元素晚于挂载出现（v-if/异步）也能观察——回归此前只挂一次 onMounted 的漏洞', async () => {
    const target = ref<HTMLElement | null>(null)
    const { result, wrapper } = withSetup(() => useInView(target))
    expect(instances.length).toBe(0) // 挂载时目标为 null
    target.value = document.createElement('div')
    await nextTick()
    expect(instances.length).toBe(1) // ref 出现后立即挂上观察
    fire({ isIntersecting: true })
    expect(result.value).toBe(true)
    wrapper.unmount()
  })

  it('未命中不改变状态', () => {
    const target = ref<HTMLElement | null>(document.createElement('div'))
    const { result, wrapper } = withSetup(() => useInView(target))
    fire({ isIntersecting: false })
    expect(result.value).toBe(false)
    wrapper.unmount()
  })
})

describe('useIsMobile', () => {
  afterEach(() => vi.unstubAllGlobals())

  const setWidth = (w: number) =>
    vi.stubGlobal('innerWidth', w)

  it('初始按 innerWidth 判定，resize 后更新', async () => {
    setWidth(500)
    const { result, wrapper } = withSetup(() => useIsMobile())
    expect(result.value).toBe(true)

    setWidth(1200)
    window.dispatchEvent(new Event('resize'))
    expect(result.value).toBe(false)

    wrapper.unmount()
  })

  it('卸载后 resize 不再更新（无监听泄漏）', () => {
    setWidth(500)
    const { result, wrapper } = withSetup(() => useIsMobile())
    wrapper.unmount()
    setWidth(1200)
    expect(() => window.dispatchEvent(new Event('resize'))).not.toThrow()
    // 已卸载，值冻结在最后一次
    expect(result.value).toBe(true)
  })
})
