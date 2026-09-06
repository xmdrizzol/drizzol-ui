// file-api 单测：断言上传请求不把 Content-Type 写死成 multipart/form-data
import { describe, it, expect, vi, beforeEach } from 'vitest'

// post 用 vi.hoisted 提升，供 vi.mock 工厂闭包引用
const { post } = vi.hoisted(() => ({ post: vi.fn().mockResolvedValue({ code: 200, data: {} }) }))
vi.mock('@ui/utils/request', () => ({
  default: { post: (...args: unknown[]) => post(...args) },
}))

import { uploadFile, uploadImage } from '@ui/utils/file-api'

describe('file-api 上传请求头', () => {
  beforeEach(() => post.mockClear())

  it('uploadImage 的 Content-Type 置空，交给浏览器补 boundary', async () => {
    await uploadImage({ file: new Blob(['x']) })
    const config = post.mock.calls[0][2] as { headers: Record<string, unknown> }
    // 手动写成 'multipart/form-data' 会顶掉 boundary，必须为 undefined
    expect(config.headers['Content-Type']).toBeUndefined()
    expect(post.mock.calls[0][0]).toBe('/general/file/upload/image')
  })

  it('uploadFile 同样置空 Content-Type（与 uploadImage 一致）', async () => {
    await uploadFile({ file: new Blob(['x']), category: 'image' })
    const config = post.mock.calls[0][2] as { headers: Record<string, unknown> }
    expect(config.headers['Content-Type']).toBeUndefined()
    expect(post.mock.calls[0][0]).toBe('/general/file/upload')
  })
})
