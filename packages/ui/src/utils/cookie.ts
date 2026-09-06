import Cookies from 'js-cookie'

// 前端存储用户信息Cookie
export const USER_INFO_KEY = 'userInfo'

/**
 * 写入原始字符串 Cookie
 * @param key Cookie键
 * @param value 字符串值
 * @param days 过期天数（默认 7）
 * @param path Cookie路径（默认根路径）
 */
export function setCookie(key: string, value: string, days = 7, path = '/') {
  Cookies.set(key, value, { expires: days, path })
}

/**
 * 读取原始字符串 Cookie（与 setCookie 对称，不做 JSON 解析）
 * @param key Cookie键
 * @returns 存过的原始字符串；不存在返回 null。对象请用 getJSONCookie。
 */
export function getCookie(key: string): string | null {
  const value = Cookies.get(key)
  return value !== undefined ? value : null
}

/**
 * 删除某个 Cookie
 * @param key Cookie键
 * @param path Cookie路径（默认根路径）
 */
export function removeCookie(key: string, path = '/') {
  Cookies.remove(key, { path })
}

/**
 * 以 JSON 序列化写入 Cookie（存对象/数组等结构化值）
 * @param key Cookie键
 * @param value 任意可序列化的值
 * @param days 过期天数（默认 7）
 * @param path Cookie路径（默认根路径）
 */
export function setJSONCookie(key: string, value: unknown, days = 7, path = '/') {
  Cookies.set(key, JSON.stringify(value), { expires: days, path })
}

/**
 * 以 JSON 反序列化读取 Cookie
 * @param key Cookie键
 * @returns 解析后的对象；不存在或解析失败返回 null
 */
export function getJSONCookie<T = unknown>(key: string): T | null {
  const str = Cookies.get(key)
  if (str === undefined) return null
  try {
    return JSON.parse(str) as T
  } catch {
    return null
  }
}

/**
 * 保存用户信息到 Cookie（JSON 通用方法在 userInfo 键上的薄封装）
 * @param data 用户对象
 * @param days 过期天数
 */
export function setUserCookie(data: object, days = 7) {
  setJSONCookie(USER_INFO_KEY, data, days)
}

/**
 * 获取 Cookie 里的用户信息
 */
export function getUserCookie() {
  return getJSONCookie(USER_INFO_KEY)
}

/**
 * 删除用户信息 Cookie
 */
export function removeUserCookie() {
  removeCookie(USER_INFO_KEY)
}

/**
 * 用户是否登录
 */
export function isLogin() {
  return !!getUserCookie()
}

/**
 * 清除所有 Cookie
 * @param path Cookie路径（默认为根路径）
 * 注意：此函数会删除所有路径下的Cookie，可能会影响其他功能，请谨慎使用。
 */
export function clearAllCookies(path = '/') {
  const allCookies = Cookies.get()
  for (const key in allCookies) {
    Cookies.remove(key, { path })
  }
}
