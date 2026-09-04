// request 拦截器单测
import { describe, it, expect, vi, beforeEach } from 'vitest'

// 拦截器依赖 element-plus 提示：全部 mock 掉
vi.mock('element-plus', () => ({
  ElMessage: { error: vi.fn(), success: vi.fn(), warning: vi.fn() },
}))

import { ElMessage } from 'element-plus'
import axios from 'axios'
import { createRequest, configureRequest, getBaseUrl } from '@ui/utils/request'
import request from '@ui/utils/request'

/** 构造返回成功响应的 adapter */
function okAdapter(data: any) {
  return async (config: any) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  })
}

/** 构造失败 adapter（与 axios 错误形态一致：error.config 附着请求配置） */
function failAdapter(status: number, data: any = {}) {
  return async (config: any) => {
    const err: any = new Error(`Request failed with status code ${status}`)
    err.config = config
    err.response = { status, data, config }
    throw err
  }
}

describe('request 拦截器', () => {
  beforeEach(() => {
    vi.mocked(ElMessage.error).mockClear()
  })

  it('成功时代理解包 res.data 并透传 code', async () => {
    const instance = createRequest({ baseURL: '/api' })
    instance.defaults.adapter = okAdapter({ code: 200, msg: 'ok', data: { value: 1 } })
    const res = await instance.get('/demo')
    expect(res).toEqual({ code: 200, msg: 'ok', data: { value: 1 } })
  })

  it('401 白名单接口只提示业务错误，不触发 onUnauthorized', async () => {
    const onUnauthorized = vi.fn()
    const instance = createRequest({ baseURL: '/api', onUnauthorized })
    instance.defaults.adapter = failAdapter(401, { msg: '用户名或密码错误' })

    await expect(instance.post('/login')).rejects.toEqual({ code: 401, msg: '用户名或密码错误' })
    expect(onUnauthorized).not.toHaveBeenCalled()
    expect(ElMessage.error).toHaveBeenCalledWith('用户名或密码错误')
  })

  it('401 非白名单接口触发 onUnauthorized', async () => {
    const onUnauthorized = vi.fn()
    const instance = createRequest({ baseURL: '/api', onUnauthorized })
    instance.defaults.adapter = failAdapter(401, { msg: '登录已过期' })

    await expect(instance.get('/me')).rejects.toEqual({ code: 401, msg: '登录已过期' })
    expect(onUnauthorized).toHaveBeenCalledTimes(1)
  })

  it('502 统一提示服务器错误', async () => {
    const instance = createRequest({ baseURL: '/api' })
    instance.defaults.adapter = failAdapter(502)

    await expect(instance.get('/x')).rejects.toEqual({ code: 502, msg: '服务器错误' })
    expect(ElMessage.error).toHaveBeenCalledWith('服务器错误')
  })

  it('取消请求静默处理，不弹提示', async () => {
    const instance = createRequest({ baseURL: '/api' })

    instance.defaults.adapter = async () => {
      throw new axios.CanceledError('canceled')
    }

    await expect(instance.get('/upload')).rejects.toThrow()
    expect(ElMessage.error).not.toHaveBeenCalled()
  })

  it('configureRequest 更新默认实例与 getBaseUrl', () => {
    configureRequest({ baseURL: 'https://api.example.com' })
    expect(request.defaults.baseURL).toBe('https://api.example.com')
    expect(getBaseUrl('/x')).toBe('https://api.example.com/x')
  })
})
