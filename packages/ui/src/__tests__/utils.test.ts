// 工具函数单测
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { pxToRem } from '@ui/utils/pxToRem'
import { formatDate } from '@ui/utils/formatDate'
import { debounce, throttle } from '@ui/utils/throttle-debounce'
import { applyTheme, initTheme, isSystemDarkMode, THEME_KEY, Theme } from '@ui/utils/theme'
import { setCookie, getCookie, setJSONCookie, getJSONCookie } from '@ui/utils/cookie'
import { getFileAccessUrl, configureFileAccessPrefix } from '@ui/utils/file'

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

  it('debounce immediate 模式：连点只首触发一次，无尾重复', () => {
    const fn = vi.fn()
    const d = debounce(fn, 100, true)

    // 一次连点（间隔小于 delay）：只应在 leading 边缘执行一次
    d()
    d()
    d()
    expect(fn).toHaveBeenCalledTimes(1)

    // 冷却窗口结束后不应再补一次尾触发（旧实现会 leading+trailing 跑两遍）
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    // 冷却期过后再调用，可再次首触发
    d()
    expect(fn).toHaveBeenCalledTimes(2)
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
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_KEY)).toBe('dark')

    applyTheme(Theme.Light)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem(THEME_KEY)).toBe('light')
  })

  it('applyTheme 保留宿主挂在 html 上的其它类', () => {
    document.documentElement.classList.add('lang-zh', 'ua-desktop')
    applyTheme(Theme.Dark)
    expect(document.documentElement.className.trim().split(/\s+/)).toEqual(
      expect.arrayContaining(['lang-zh', 'ua-desktop', 'dark']),
    )
    applyTheme(Theme.Light)
    // 关深色时只摘掉 dark，其它类不动
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.classList.contains('lang-zh')).toBe(true)
    expect(document.documentElement.classList.contains('ua-desktop')).toBe(true)
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

describe('cookie 读写对称', () => {
  afterEach(() => {
    document.cookie = 'dz_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    document.cookie = 'dz_json=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  })

  it('setCookie/getCookie 原样往返普通字符串（旧实现 JSON.parse 会读回 null）', () => {
    setCookie('dz_test', 'abc')
    expect(getCookie('dz_test')).toBe('abc')
    // 布尔/数字字面串同样原样返回，不被误解析
    setCookie('dz_test', 'true')
    expect(getCookie('dz_test')).toBe('true')
    setCookie('dz_test', '42')
    expect(getCookie('dz_test')).toBe('42')
  })

  it('不存在的 key 返回 null', () => {
    expect(getCookie('dz_missing')).toBeNull()
    expect(getJSONCookie('dz_missing')).toBeNull()
  })

  it('setJSONCookie/getJSONCookie 往返对象，脏数据返回 null', () => {
    setJSONCookie('dz_json', { id: 7, roles: ['a', 'b'] })
    expect(getJSONCookie('dz_json')).toEqual({ id: 7, roles: ['a', 'b'] })
    // 手工写入非法 JSON，getJSONCookie 安全返回 null
    document.cookie = 'dz_json={坏数据; path=/'
    expect(getJSONCookie('dz_json')).toBeNull()
  })
})
