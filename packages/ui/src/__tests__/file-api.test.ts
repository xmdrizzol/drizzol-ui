// file-api 单测：断言上传请求不把 Content-Type 写死成 multipart/form-data，接口路径可配置
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// post 用 vi.hoisted 提升，供 vi.mock 工厂闭包引用
const { post } = vi.hoisted(() => ({ post: vi.fn().mockResolvedValue({ code: 200, data: {} }) }))
vi.mock('@ui/utils/request', () => ({
  default: { post: (...args: unknown[]) => post(...args) },
}))

import { uploadFile, uploadImage, configureFileApi } from '@ui/utils/file-api'

// 默认契约路径（与 file-api.ts 模块状态一致；测试改过配置后用它还原）
const DEFAULT_UPLOAD_URL = '/general/file/upload'
const DEFAULT_UPLOAD_IMAGE_URL = '/general/file/upload/image'

describe('file-api 上传请求头', () => {
  beforeEach(() => post.mockClear())

  afterEach(() => configureFileApi({ uploadUrl: DEFAULT_UPLOAD_URL, uploadImageUrl: DEFAULT_UPLOAD_IMAGE_URL }))

  it('uploadImage 的 Content-Type 置空，交给浏览器补 boundary', async () => {
    await uploadImage({ file: new Blob(['x']) })
    const config = post.mock.calls[0][2] as { headers: Record<string, unknown> }
    // 手动写成 'multipart/form-data' 会顶掉 boundary，必须为 undefined
    expect(config.headers['Content-Type']).toBeUndefined()
    expect(post.mock.calls[0][0]).toBe(DEFAULT_UPLOAD_IMAGE_URL)
  })

  it('uploadFile 同样置空 Content-Type（与 uploadImage 一致）', async () => {
    await uploadFile({ file: new Blob(['x']), category: 'image' })
    const config = post.mock.calls[0][2] as { headers: Record<string, unknown> }
    expect(config.headers['Content-Type']).toBeUndefined()
    expect(post.mock.calls[0][0]).toBe(DEFAULT_UPLOAD_URL)
  })
})

describe('file-api 接口路径自定义', () => {
  beforeEach(() => {
    post.mockClear()
    configureFileApi({ uploadUrl: DEFAULT_UPLOAD_URL, uploadImageUrl: DEFAULT_UPLOAD_IMAGE_URL })
  })

  it('configureFileApi 全局调整上传地址（对后续所有调用生效）', async () => {
    configureFileApi({ uploadUrl: '/v2/file/upload', uploadImageUrl: '/v2/file/upload-image' })

    await uploadFile({ file: new Blob(['x']) })
    expect(post.mock.calls[0][0]).toBe('/v2/file/upload')

    await uploadImage({ file: new Blob(['x']) })
    expect(post.mock.calls[1][0]).toBe('/v2/file/upload-image')
  })

  it('params.url 单次覆盖全局配置，且不影响后续调用', async () => {
    await uploadFile({ file: new Blob(['x']), url: '/avatar/upload' })
    expect(post.mock.calls[0][0]).toBe('/avatar/upload')

    await uploadFile({ file: new Blob(['x']) })
    expect(post.mock.calls[1][0]).toBe(DEFAULT_UPLOAD_URL)

    await uploadImage({ file: new Blob(['x']), url: 'https://api.example.com/crop-upload' })
    expect(post.mock.calls[2][0]).toBe('https://api.example.com/crop-upload')
  })
})
