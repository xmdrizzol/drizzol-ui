// 工具函数单测
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { pxToRem } from '@/utils/pxToRem'
import { formatDate } from '@/utils/formatDate'
import { debounce, throttle } from '@/utils/throttle-debounce'
import { applyTheme, initTheme, isSystemDarkMode, THEME_KEY, Theme } from '@/utils/theme'
import { getFileAccessUrl, configureFileAccessPrefix } from '@/utils/file'

describe('pxToRem', () => {
  it('数字按 16 基准换算', () => {
    expect(pxToRem(16)).toBe('1rem')
    expect(pxToRem(8)).toBe('0.5rem')
  })

  it('字符串解析', () => {
    expect(pxToRem('24px')).toBe('1.5rem')
  })
})

describe('formatDate', () => {
  it('UTC 字符串转本地时间', () => {
    // 2026-05-29T12:00:00Z → 本地 +8 为 20:00（时区无关断言：可解析且格式正确）
    const result = formatDate('2026-05-29T12:00:00')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
  })

  it('空值与非法输入原样返回', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})

describe('debounce / throttle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('debounce 延迟执行并合并多次触发', () => {
    const fn = vi.fn()
    const d = debounce(fn, 100)

    d()
    d()
    d()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    d.cancel()
    d()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('debounce immediate 模式立即执行一次', () => {
    const fn = vi.fn()
    const d = debounce(fn, 100, true)

    d()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('throttle 在规定间隔内只执行一次', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const t = throttle(fn, 100)

    t()
    t()
    t()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    t()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })

  afterEach(() => vi.unstubAllGlobals())

  it('applyTheme 生效并持久化', () => {
    applyTheme(Theme.Dark)
    expect(document.documentElement.className).toBe('dark')
    expect(localStorage.getItem(THEME_KEY)).toBe('dark')

    applyTheme(Theme.Light)
    expect(document.documentElement.className).toBe('')
    expect(localStorage.getItem(THEME_KEY)).toBe('light')
  })

  it('initTheme 优先读取手动设置', () => {
    localStorage.setItem(THEME_KEY, 'dark')
    initTheme()
    expect(document.documentElement.className).toBe('dark')
  })

  it('无手动设置时跟随系统（浅色）', () => {
    initTheme()
    expect(document.documentElement.className).toBe('')
  })

  it('isSystemDarkMode 读取媒体查询', () => {
    expect(isSystemDarkMode()).toBe(false)
  })
})

describe('file 访问地址', () => {
  afterEach(() => configureFileAccessPrefix('/api/general/file/access/'))

  it('拼接访问前缀', () => {
    expect(getFileAccessUrl('e6fe8463.png')).toBe('/api/general/file/access/image/e6fe8463.png')
  })

  it('完整地址幂等', () => {
    const full = '/api/general/file/access/image/e6fe8463.png'
    expect(getFileAccessUrl(full)).toBe(full)
    expect(getFileAccessUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png')
  })

  it('支持自定义前缀与空值', () => {
    configureFileAccessPrefix('https://files.example.com/access')
    expect(getFileAccessUrl('a.png')).toBe('https://files.example.com/access/image/a.png')
    expect(getFileAccessUrl('')).toBe('')
  })
})
