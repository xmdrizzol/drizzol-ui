// 主题切换

/** localStorage 存储 key（宿主可读取以展示当前主题） */
export const THEME_KEY = 'dz-theme'

/**
 * 主题类型
 */
export type Theme = 'auto' | 'light' | 'dark'
export const Theme = {
  Auto: 'auto',
  Light: 'light',
  Dark: 'dark'
} as const

/**
 * 获取系统当前是否为深色模式
 */
export function isSystemDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 应用主题
 * 用 classList.toggle 而非整串覆盖 className：宿主可能在 <html> 上挂有其它类
 * （语言标记、UA 检测、no-js 等），赋值 className 会把它们一并抹掉。
 */
export function applyTheme(theme: Theme) {
  const root = document.documentElement

  let dark = false
  if (theme === Theme.Auto) dark = isSystemDarkMode()
  else if (theme === Theme.Dark) dark = true
  else if (theme === Theme.Light) dark = false

  root.classList.toggle('dark', dark)
  // 保存到本地存储
  localStorage.setItem(THEME_KEY, theme)
}

/**
 * 初始化主题（页面加载时调用）
 * 逻辑：优先用户手动设置 → 否则跟随系统
 */
export function initTheme() {
  const userTheme = localStorage.getItem(THEME_KEY) as Theme | null

  // 1. 用户手动设置过主题
  if (userTheme) {
    applyTheme(userTheme)
    return
  }

  // 2. 未设置 → 跟随系统
  applyTheme(Theme.Auto)
}

/**
 * 监听系统主题变化（自动切换）
 */
export function watchSystemTheme() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handleChange = () => {
    const userTheme = localStorage.getItem(THEME_KEY) as Theme

    if (userTheme === Theme.Auto) {
      applyTheme(Theme.Auto)
    }
  }

  mediaQuery.addEventListener('change', handleChange)
  // 返回销毁函数
  return () => mediaQuery.removeEventListener('change', handleChange)
}