import Cookies from 'js-cookie'

// 前端存储用户信息Cookie
export const USER_INFO_KEY = 'userInfo'

/**
 * 保存用户信息到Cookie
 * @param data 用户对象
 * @param days 过期天数
 */
export function setUserCookie(data: object, days = 7) {
  Cookies.set(USER_INFO_KEY, JSON.stringify(data), {
    expires: days,
    path: '/'
  })
}

/**
 * 获取Cookie里的用户信息
 */
export function getUserCookie() {
  const str = Cookies.get(USER_INFO_KEY)
  if (!str) return null
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

/**
 * 删除用户信息Cookie
 */
export function removeUserCookie() {
  Cookies.remove(USER_INFO_KEY, { path: '/' })
}

/**
 * 用户是否登录
 */
export function isLogin() {
  return !!getUserCookie()
}

/**
 * 删除某个Cookie
 * @param key Cookie键
 * @param path Cookie路径（默认为根路径）
 */
export function removeCookie(key: string, path = '/') {
  Cookies.remove(key, { path })
}

/**
 * 添加某个Cookie
 * @param key Cookie键
 * @param value Cookie值
 * @param days 过期天数（默认为7天）
 * @param path Cookie路径（默认为根路径）
 */
export function setCookie(key: string, value: string, days = 7, path = '/') {
  Cookies.set(key, value, { expires: days, path })
}

/**
 * 获取某个Cookie
 * @param key Cookie键
 * @return Cookie值
 * @throws 如果Cookie不存在或无法解析则返回null
 */
export function getCookie(key: string) {
  const value = Cookies.get(key)
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

/**
 * 清除所有Cookie
 * @param path Cookie路径（默认为根路径）
 * 注意：此函数会删除所有路径下的Cookie，可能会影响其他功能，请谨慎使用。
 */
export function clearAllCookies(path = '/') {
  const allCookies = Cookies.get()
  console.log(allCookies)
  for (const key in allCookies) {
    Cookies.remove(key, { path })
  }
}