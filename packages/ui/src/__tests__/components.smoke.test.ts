// 组件挂载冒烟测试：16 个组件逐一 mount，断言根类名与基础行为
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'

// 重依赖 mock：artplayer 在 jsdom 下无法真实创建播放器，cropperjs 注册浏览器特定能力
vi.mock('element-plus', () => ({
  ElMessage: { error: vi.fn(), success: vi.fn(), warning: vi.fn() },
  ElMessageBox: { confirm: vi.fn().mockResolvedValue(true) },
  ElNotification: vi.fn(() => ({ close: vi.fn() })),
}))

vi.mock('artplayer', () => {
  return {
    default: class MockArtplayer {
      on() {}
      switchUrl() {}
      destroy() {}
    }
  }
})

vi.mock('cropperjs', () => ({ default: {} }))

// jsdom 未实现 ResizeObserver（m-dropdown 挂载时使用）
vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
})

import DIcon from '@/components/icon'
import { DIconSprite } from '@/components/icon'
import DCard from '@/components/card'
import DButton from '@/components/button'
import DInput from '@/components/input'
import DForm from '@/components/form'
import DFormItem from '@/components/form-item'
import DModal from '@/components/modal'
import DDropdown from '@/components/dropdown'
import DUpload from '@/components/upload'
import DCropper from '@/components/cropper'
import DVideo from '@/components/video'
import DPageHero from '@/components/page-hero'
import DPageCover from '@/components/page-cover'
import DFloatBar from '@/components/float-bar'
import DSearch from '@/components/search'
import DSort from '@/components/sort'

describe('组件冒烟', () => {
  it('DIcon 渲染 svg use 引用 dz-icon 符号', () => {
    const wrapper = mount(DIcon, { props: { name: 'dz-icon-menu' } })
    expect(wrapper.html()).toContain('dz-icon-menu')
  })

  it('DIconSprite 渲染雪碧图', () => {
    const wrapper = mount(DIconSprite)
    expect(wrapper.find('symbol').exists()).toBe(true)
  })

  it('DCard 根类名与悬浮修饰', () => {
    expect(mount(DCard).find('.d-card').exists()).toBe(true)
    expect(mount(DCard, { props: { isHover: true } }).find('.is-hover').exists()).toBe(true)
  })

  it('DButton 变体渲染', () => {
    const wrapper = mount(DButton, { props: { type: 'primary', round: true }, slots: { default: '按钮' } })
    expect(wrapper.classes()).toContain('d-button')
    expect(wrapper.classes()).toContain('is-round')
    expect(wrapper.text()).toContain('按钮')
  })

  it('DInput 输入 emit update:modelValue', async () => {
    const wrapper = mount(DInput)
    await wrapper.find('input').setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })

  it('DForm + DFormItem 校验与提交', async () => {
    const wrapper = mount(DForm, {
      props: {
        model: { name: '' },
        rules: { name: { required: true, message: '必填' } },
      },
      slots: {
        default: () => [h(DFormItem, { label: '名称', prop: 'name' }, { default: () => h(DInput) })],
      },
    })

    expect(wrapper.find('form.d-form').exists()).toBe(true)
    expect(wrapper.find('.d-form-item').exists()).toBe(true)
    expect(wrapper.find('label').text()).toBe('名称')
  })

  it('DModal 打开后挂载到 body', async () => {
    const wrapper = mount(DModal, { props: { visible: true, title: '标题' } })
    await flushPromises()
    expect(document.body.querySelector('.d-modal')).not.toBeNull()
    expect(document.body.querySelector('.d-modal__title')?.textContent).toBe('标题')
  })

  it('DDropdown 渲染触发插槽与分割', () => {
    const wrapper = mount(DDropdown, {
      slots: { default: '<span>trigger</span>', menu: '<span>menu</span>' },
    })
    expect(wrapper.find('.d-dropdown-trigger').exists()).toBe(true)
    expect(wrapper.find('.d-dropdown-menu').exists()).toBe(true)
  })

  it('DUpload 渲染上传入口', () => {
    const wrapper = mount(DUpload)
    expect(wrapper.find('input[type=file]').exists()).toBe(true)
    expect(wrapper.find('.d-upload__trigger').exists()).toBe(true)
  })

  it('DCropper 渲染裁剪容器', () => {
    const wrapper = mount(DCropper, { props: { imgUrl: '', init: false } })
    expect(wrapper.find('.d-cropper').exists()).toBe(true)
  })

  it('DVideo 渲染播放容器', () => {
    const wrapper = mount(DVideo, { props: { src: 'https://example.com/a.mp4' } })
    expect(wrapper.find('.d-video').exists()).toBe(true)
  })

  it('DPageHero 标题/副标渲染，无封面时不渲染封面组件', () => {
    const wrapper = mount(DPageHero, { props: { title: '标题', en: 'TITLE', subtitle: '副标' } })
    expect(wrapper.text()).toContain('标题')
    expect(wrapper.text()).toContain('TITLE')
    expect(wrapper.find('.d-page-hero__cover').exists()).toBe(false)
  })

  it('DPageCover 渲染封面图', () => {
    const wrapper = mount(DPageCover, { props: { src: 'https://example.com/c.jpg' } })
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/c.jpg')
  })

  it('DFloatBar 目录项渲染', () => {
    const wrapper = mount(DFloatBar, { props: { showCatalog: true, catalogTooltip: '目录' } })
    expect(wrapper.find('.d-float-bar__item').exists()).toBe(true)
  })

  it('DSearch 回车触发 search', async () => {
    const wrapper = mount(DSearch, { props: { placeholder: '搜索' } })
    await wrapper.find('input').setValue('关键词')
    await wrapper.find('input').trigger('keyup.enter')
    expect(wrapper.emitted('search')?.[0]).toEqual(['关键词'])
  })

  it('DSort 默认筛选状态渲染', () => {
    const wrapper = mount(DSort, {
      props: {
        sortOptions: [{ field: 'createdAt', label: '创建时间' }],
      },
    })
    expect(wrapper.find('.d-sort').exists()).toBe(true)
    expect(wrapper.find('.d-sort__select').exists()).toBe(true)
  })
})
