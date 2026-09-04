// utils/device.ts

/**
 * 判断当前是否为移动设备
 * @returns boolean
 */
export function isMobile(): boolean {
  // 1. 先看 userAgent（覆盖绝大多数场景）
  const ua = navigator.userAgent.toLowerCase()
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/

  if (mobileRegex.test(ua)) return true

  // 2. 再看屏幕宽度（兼容部分桌面浏览器模拟移动设备）
  return window.innerWidth <= 768
}

/**
 * 判断当前是否为平板设备
 * @returns boolean
 */
export function isTablet(): boolean {
  const ua = navigator.userAgent.toLowerCase()
  const tabletRegex = /ipad|android(?!.*mobile)/

  if (tabletRegex.test(ua)) return true

  return window.innerWidth > 768 && window.innerWidth <= 1024
}

/**
 * 判断当前是否为桌面设备
 * @returns boolean
 */
export function isDesktop(): boolean {
  return !isMobile() && !isTablet()
}
