// 网络请求：axios 封装（响应拦截器解包 res.data，401 白名单策略）
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { DMessage } from '@ui/components/message'

/**
 * 自定义 axios 实例
 * 响应拦截器已解包 res.data，故 get/post 等方法泛型直接返回 T
 * @see https://github.com/axios/axios
 */
export interface CustomAxiosInstance extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

/**
 * 请求配置
 */
export interface RequestConfig {
  /** 请求基础地址，默认 '/api'（配合 dev 代理或同源部署） */
  baseURL?: string
  /** 超时时间（ms），默认 60000 */
  timeout?: number
  /** 401 时不需要清登录态的接口路径片段（如登录/注册/验证码） */
  noLogoutApis?: string[]
  /** 401（非白名单）时回调，宿主可在此清理自己的登录态 */
  onUnauthorized?: () => void
}

/** 默认配置 */
const DEFAULT_CONFIG = {
  baseURL: '/api',
  timeout: 60000,
  noLogoutApis: ['/login', '/register', '/sendCode'],
}

/** 模块级共享配置（createRequest 与 configureRequest 共用同一对象） */
const currentConfig: RequestConfig = { ...DEFAULT_CONFIG }

/** 401 清理节流：并发 401 只触发一次 onUnauthorized */
let isLoggingOut = false

/**
 * 绑定请求/响应拦截器
 * @param cfg 实例生效配置（默认实例共享 currentConfig，实例级配置为快照合并）
 */
function setupInterceptors(instance: CustomAxiosInstance, cfg: RequestConfig) {
  instance.interceptors.request.use(
    config => config,
    err => Promise.reject(err)
  )

  instance.interceptors.response.use(
    res => res.data,
    (error) => {
      // 用户主动取消的请求（如上传取消），不弹错误提示
      if (axios.isCancel(error)) {
        return Promise.reject(error)
      }

      const status = error.response?.status
      const data = error.response?.data
      const url = error.config?.url || ''

      // 网络/服务器错误
      if (status === 502) {
        DMessage.error('服务器错误')
        return Promise.reject({ code: 502, msg: '服务器错误' })
      }

      // 401 处理：白名单接口只提示业务错误，其余清登录态
      if (status === 401) {
        const errorMsg = data?.msg || '请求失败'
        const noLogoutApis = cfg.noLogoutApis ?? DEFAULT_CONFIG.noLogoutApis

        if (noLogoutApis.some(api => url.includes(api))) {
          DMessage.error(errorMsg)
        } else if (!isLoggingOut) {
          isLoggingOut = true
          cfg.onUnauthorized?.()
          DMessage.error(errorMsg)
        }

        return Promise.reject({ code: 401, msg: errorMsg })
      }

      // 其他状态码
      DMessage.error(data?.msg || '请求失败')
      return Promise.reject(data)
    }
  )
}

/**
 * 创建请求实例
 * @param config 实例级配置；不传则共享默认实例的 currentConfig（configureRequest 对默认实例生效）
 */
export function createRequest(config: RequestConfig = {}): CustomAxiosInstance {
  // 默认实例直接共享 currentConfig 引用，configureRequest 才能实时生效
  const cfg = config === currentConfig ? currentConfig : { ...currentConfig, ...config }

  const instance = axios.create({
    baseURL: cfg.baseURL ?? DEFAULT_CONFIG.baseURL,
    timeout: cfg.timeout ?? DEFAULT_CONFIG.timeout,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  }) as CustomAxiosInstance

  setupInterceptors(instance, cfg)
  return instance
}

/**
 * 默认请求实例（库内置能力使用本实例）
 */
const request = createRequest(currentConfig)

/**
 * 配置默认实例（宿主在入口调用一次即可）
 * @example configureRequest({ baseURL: '/api', onUnauthorized: () => userStore.clear() })
 */
export function configureRequest(config: RequestConfig) {
  if (config.baseURL) {
    request.defaults.baseURL = config.baseURL
    currentConfig.baseURL = config.baseURL
  }
  if (config.timeout !== undefined) {
    request.defaults.timeout = config.timeout
    currentConfig.timeout = config.timeout
  }
  if (config.noLogoutApis) currentConfig.noLogoutApis = config.noLogoutApis
  if (config.onUnauthorized) currentConfig.onUnauthorized = config.onUnauthorized
}

/**
 * 获取 api 基础 url（拼接文件直连等需要完整地址的场景）
 */
export const getBaseUrl = (path: string = '') => {
  return (currentConfig.baseURL ?? DEFAULT_CONFIG.baseURL) + path
}

export default request
