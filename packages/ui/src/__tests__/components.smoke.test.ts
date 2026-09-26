// 组件挂载冒烟测试：16 个组件逐一 mount，断言根类名与基础行为
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import asideSource from '@ui/components/layout/aside.vue?raw'
import tabsSource from '@ui/components/tabs/index.vue?raw'
import { DProgress } from '@ui/components/progress'

// 重依赖 mock：artplayer 在 jsdom 下无法真实创建播放器，cropperjs 注册浏览器特定能力
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

import DIcon from '@ui/components/icon'
import { DIconSprite } from '@ui/components/icon'
import { DLayout, DHeader, DAside, DMain, DFooter } from '@ui/components/layout'
import { DMenu } from '@ui/components/menu'
import DCard from '@ui/components/card'
import DButton from '@ui/components/button'
import DInput from '@ui/components/input'
import DForm from '@ui/components/form'
import DFormItem from '@ui/components/form-item'
import DModal from '@ui/components/modal'
import DDropdown from '@ui/components/dropdown'

import DUpload from '@ui/components/upload'
import DCropper from '@ui/components/cropper'
import DVideo from '@ui/components/video'
import DPageHero from '@ui/components/page-hero'
import DPageCover from '@ui/components/page-cover'
import DFloatBar from '@ui/components/float-bar'
import DSearch from '@ui/components/search'
import DSort from '@ui/components/sort'
import { DRow, DCol } from '@ui/components/grid'
import { DTag } from '@ui/components/tag'
import { DBadge } from '@ui/components/badge'
import { DSkeleton } from '@ui/components/skeleton'
import { DEmpty } from '@ui/components/empty'
import DImage from '@ui/components/image'
import { configureFileAccessPrefix } from '@ui/utils/file'
import { DImageGroup } from '@ui/components/image'
import DAvatar from '@ui/components/avatar'
import { DPagination } from '@ui/components/pagination'
import { DCodeBlock } from '@ui/components/code-block'
import { DTabs } from '@ui/components/tabs'

describe('组件冒烟', () => {
  it('DLayout 布局组合渲染', () => {
    const wrapper = mount(DLayout, {
      slots: {
        default: () => [
          h(DHeader, { height: 56 }, { default: () => 'header' }),
          h(DMain, null, { default: () => 'main' }),
          h(DFooter, { height: 48 }, { default: () => 'footer' }),
        ],
      },
    })
    expect(wrapper.find('.d-layout').exists()).toBe(true)
    expect(wrapper.find('.d-header').exists()).toBe(true)
    expect(wrapper.find('.d-main').exists()).toBe(true)
    expect(wrapper.find('.d-footer').exists()).toBe(true)
  })

  it('DLayout 含 DAside 时自动水平排列', async () => {
    const wrapper = mount(DLayout, {
      slots: {
        default: () => [h(DAside, { width: 200 }, { default: () => 'aside' }), h(DMain)],
      },
    })
    await flushPromises()
    expect(wrapper.find('.d-layout').attributes('style')).toContain('row')
  })

  it('DHeader：height 数字按 px 转 rem，传 fixed 加 is-fixed，不传 height 无内联', () => {
    const withH = mount(DHeader, { props: { height: 48, fixed: true }, slots: { default: () => 'x' } })
    expect(withH.find('.d-header').attributes('style')).toContain('3rem')
    expect(withH.find('.d-header').classes()).toContain('is-fixed')
    withH.unmount()

    const withoutH = mount(DHeader, { slots: { default: () => 'x' } })
    expect(withoutH.find('.d-header').attributes('style')).toBeUndefined()
    withoutH.unmount()
  })

  it('DHeader：纯属性字符串 height="48" 也转 rem（修复无单位导致的非法 CSS）', () => {
    const w = mount(DHeader, { props: { height: '48' }, slots: { default: () => 'x' } })
    const style = w.find('.d-header').attributes('style')
    expect(style).toBeTruthy()
    expect(style).toContain('3rem')
  })

  it('DFooter/DAside：尺寸转 rem，fixed 加 is-fixed', () => {
    const footer = mount(DFooter, { props: { height: 48, fixed: true }, slots: { default: () => 'x' } })
    expect(footer.find('.d-footer').attributes('style')).toContain('3rem')
    expect(footer.find('.d-footer').classes()).toContain('is-fixed')

    const aside = mount(DAside, { props: { width: 200, fixed: true }, slots: { default: () => 'x' } })
    expect(aside.find('.d-aside').attributes('style')).toContain('12.5rem')
    expect(aside.find('.d-aside').classes()).toContain('is-fixed')
  })

  it('DAside：带单位字符串原样透传（auto/%），数字/Npx 转 rem', () => {
    const auto = mount(DAside, { props: { width: 'auto' }, slots: { default: () => 'x' } })
    expect(auto.find('.d-aside').attributes('style')).toContain('auto')
    auto.unmount()

    const pct = mount(DAside, { props: { width: '50%' }, slots: { default: () => 'x' } })
    expect(pct.find('.d-aside').attributes('style')).toContain('50%')
    pct.unmount()

    const pxStr = mount(DAside, { props: { width: '200px' }, slots: { default: () => 'x' } })
    expect(pxStr.find('.d-aside').attributes('style')).toContain('12.5rem')
    pxStr.unmount()
  })

  // sticky 的失效点是被 flex 拉伸到与容器等高（无位移空间），jsdom 无布局算不出，故守护样式源码不变量
  it('DAside：fixed 样式保证 sticky 生效（收缩自身高度 + 留出吸顶偏移）', () => {
    const fixedBlock = asideSource.match(/&\.is-fixed\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(fixedBlock).toContain('align-self: flex-start')
    expect(fixedBlock).toContain('position: sticky')
    expect(fixedBlock).toContain('var(--dz-aside-sticky-top')
  })

  it('DMenu 平铺模式渲染与选中事件', async () => {
    const wrapper = mount(DMenu, {
      props: {
        items: [
          { key: 'home', label: '总览' },
          { key: 'theme', label: '主题色板' },
          { key: 'destroy', label: '禁用项', disabled: true },
        ],
      },
    })
    expect(wrapper.findAll('.d-menu__item')).toHaveLength(3)
    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['home'])
    expect(wrapper.emitted('select')?.[0][0]).toMatchObject({ key: 'home' })
    // 禁用项不响应
    await wrapper.findAll('button')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.length).toBe(1)
  })

  it('DMenu 分组模式渲染小标题', () => {
    const wrapper = mount(DMenu, {
      props: {
        groups: [
          { label: '概况', items: [{ key: 'home', label: '总览' }] },
          { label: '组件', items: [{ key: 'dcard', label: 'DCard' }] },
        ],
      },
    })
    expect(wrapper.findAll('.d-menu__group-title')).toHaveLength(2)
    expect(wrapper.text()).toContain('概况')
    expect(wrapper.text()).toContain('DCard')
  })

  it('DMenu 安装 router 后带 to 条目渲染 router-link', async () => {
    const { createRouter, createMemoryHistory } = await import('vue-router')
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div />' } }, { path: '/theme', component: { template: '<div />' } }],
    })
    const wrapper = mount(DMenu, {
      props: {
        items: [{ key: 'theme', label: '主题色板', to: '/theme' }],
      },
      global: { plugins: [router] },
    })
    expect(wrapper.find('a.d-menu__item').exists()).toBe(true)
    expect(wrapper.find('a.d-menu__item').attributes('href')).toBe('/theme')
  })

  it('DIcon 渲染 svg use 引用 dz-icon 符号（name 传裸名）', () => {
    const wrapper = mount(DIcon, { props: { name: 'menu' } })
    const href = wrapper.find('use').attributes('href') ?? wrapper.find('use').attributes('xlink:href')
    expect(href).toBe('#dz-icon-menu')
  })

  it('DIconSprite 渲染雪碧图', () => {
    const wrapper = mount(DIconSprite)
    expect(wrapper.find('symbol').exists()).toBe(true)

    // 编辑器场景的 7 个新增图标在雪碧图中真实存在
    const ids = wrapper.findAll('symbol').map(s => s.attributes('id'))
    for (const name of ['search', 'image', 'video', 'bold', 'italic', 'underline', 'list']) {
      expect(ids).toContain(`dz-icon-${name}`)
    }
  })

  it('DCard 根类名与悬浮修饰', async () => {
    expect(mount(DCard).find('.d-card').exists()).toBe(true)
    expect(mount(DCard, { props: { isHover: true } }).find('.is-hover').exists()).toBe(true)
    // isHover 动态变化时类名同步更新
    const wrapper = mount(DCard)
    expect(wrapper.classes()).not.toContain('is-hover')
    await wrapper.setProps({ isHover: true })
    expect(wrapper.classes()).toContain('is-hover')
  })

  it('DButton 变体渲染', () => {
    const wrapper = mount(DButton, { props: { type: 'primary', round: true }, slots: { default: '按钮' } })
    expect(wrapper.classes()).toContain('d-button')
    expect(wrapper.classes()).toContain('is-round')
    expect(wrapper.classes()).toContain('d-button--primary')
    expect(wrapper.text()).toContain('按钮')
  })

  it('DButton 六种类型生成对应修饰类', async () => {
    for (const type of ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const) {
      const w = mount(DButton, { props: { type }, slots: { default: '按钮' } })
      expect(w.classes()).toContain(`d-button--${type}`)
      w.unmount()
    }
  })

  it('DButton 变体响应式更新且原生 type=button', async () => {
    const wrapper = mount(DButton, { slots: { default: '按钮' } })
    // 原生按钮固定 type=button，避免置于 form 内触发表单提交
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.classes()).not.toContain('is-round')
    await wrapper.setProps({ round: true, link: true, size: 'small' })
    expect(wrapper.classes()).toContain('is-round')
    expect(wrapper.classes()).toContain('is-link')
    expect(wrapper.classes()).toContain('is-small')
    await wrapper.setProps({ round: false })
    expect(wrapper.classes()).not.toContain('is-round')
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

  it('DForm 必填校验：0/false 不视为空值，空串/空数组视为空值', async () => {
    const wrapper = mount(DForm, {
      props: {
        model: { count: 0, flag: false, name: '', tags: [] },
        rules: {
          count: { required: true },
          flag: { required: true },
          name: { required: true, message: '必填' },
          tags: { required: true },
        },
      },
      slots: {
        default: () => [
          h(DFormItem, { prop: 'count' }),
          h(DFormItem, { prop: 'flag' }),
          h(DFormItem, { prop: 'name' }),
          h(DFormItem, { prop: 'tags' }),
        ],
      },
    })
    const items = wrapper.findAllComponents(DFormItem)
    expect((items[0].vm as any).validate()).toBe(true)
    expect((items[1].vm as any).validate()).toBe(true)
    expect((items[2].vm as any).validate()).toBe(false)
    expect((items[3].vm as any).validate()).toBe(false)
  })

  it('DForm 校验文案：优先分规则 message，number 值不崩溃', async () => {
    const wrapper = mount(DForm, {
      props: {
        model: { name: '', age: 12, count: 12345 },
        rules: {
          name: { required: true, min: 2, requiredMessage: '请输入名称', minMessage: '至少 2 个字' },
          age: { min: 3, max: 10 },
          count: { min: 3, max: 10 },
        },
      },
      slots: {
        default: () => [
          h(DFormItem, { prop: 'name' }),
          h(DFormItem, { prop: 'age' }),
          h(DFormItem, { prop: 'count' }),
        ],
      },
    })
    const items = wrapper.findAllComponents(DFormItem)
    // 空值命中 required → 用 requiredMessage
    expect((items[0].vm as any).validate()).toBe(false)
    await flushPromises()
    expect(items[0].find('.d-form-item__error').text()).toBe('请输入名称')
    // 改为过短值 → 用 minMessage
    await wrapper.setProps({ model: { name: 'a', age: 12, count: 12345 } })
    expect((items[0].vm as any).validate()).toBe(false)
    await flushPromises()
    expect(items[0].find('.d-form-item__error').text()).toBe('至少 2 个字')
    // number 值按字面长度比较，不抛错：12 长度 2 < min 3
    expect((items[1].vm as any).validate()).toBe(false)
    await flushPromises()
    expect(items[1].find('.d-form-item__error').text()).toBe('长度不能少于 3 个字符')
    // 12345 长度 5，落在 [3, 10] 内
    expect((items[2].vm as any).validate()).toBe(true)
  })

  it('DFormItem 脱离 DForm 单独使用不报错且校验直接通过', () => {
    const wrapper = mount(DFormItem, { props: { prop: 'name', label: '名称' } })
    expect(wrapper.find('.d-form-item').exists()).toBe(true)
    expect((wrapper.vm as any).validate()).toBe(true)
  })

  it('DModal 打开后挂载到 body', async () => {
    const wrapper = mount(DModal, { props: { visible: true, title: '标题' } })
    await flushPromises()
    expect(document.body.querySelector('.d-modal')).not.toBeNull()
    expect(document.body.querySelector('.d-modal__title')?.textContent).toBe('标题')
  })

  it('DModal Escape 触发关闭事件', async () => {
    const wrapper = mount(DModal, { props: { visible: true, title: '标题' } })
    await flushPromises()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('DDropdown 渲染触发插槽与分割', () => {
    const wrapper = mount(DDropdown, {
      slots: { default: '<span>trigger</span>', menu: '<span>menu</span>' },
    })
    expect(wrapper.find('.d-dropdown-trigger').exists()).toBe(true)
    expect(wrapper.find('.d-dropdown-menu').exists()).toBe(true)
  })

  it('DDropdown 点击开合驱动菜单显隐（CSS 过渡，无第三方动画库）', async () => {
    const wrapper = mount(DDropdown, {
      slots: { default: '<span>trigger</span>', menu: '<span>menu</span>' },
    })
    const trigger = wrapper.find('.d-dropdown-trigger')
    // 断言 v-show 写入的内联 display（jsdom 的 getComputedStyle 在多次开合后有陈旧缓存，不可靠）
    const display = () => (wrapper.find('.d-dropdown-menu').element as HTMLElement).style.display

    await trigger.trigger('click')
    await nextTick()
    expect(display()).toBe('')

    await trigger.trigger('click')
    // leave 过渡（0.25s）结束后 v-show 隐藏；jsdom 下由 Vue 的 setTimeout 兜底收尾
    await new Promise(r => setTimeout(r, 350))
    expect(display()).toBe('none')

    // 再开，反复切换状态正确
    await trigger.trigger('click')
    await nextTick()
    expect(display()).toBe('')
    wrapper.unmount()
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

describe('数据展示组件冒烟', () => {
  it('DRow/DCol 栅格渲染与 gutter 内边距', () => {
    const wrapper = mount(DRow, {
      props: { gutter: 16 },
      slots: { default: () => h(DCol, { span: 12 }, { default: () => '内容' }) },
    })
    expect(wrapper.find('.d-row').attributes('style')).toContain('-8px')
    const col = wrapper.find('.d-col')
    expect(col.classes()).toContain('d-col--span-12')
    expect(col.attributes('style')).toContain('8px')
  })

  it('DTag 语义类型与关闭事件', async () => {
    const wrapper = mount(DTag, { props: { type: 'success', closable: true }, slots: { default: '标签' } })
    expect(wrapper.find('.d-tag--success').exists()).toBe(true)
    await wrapper.find('.d-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('DBadge 数值截断与隐藏', () => {
    expect(mount(DBadge, { props: { value: 120 } }).text()).toContain('99+')
    expect(mount(DBadge, { props: { value: 0 } }).find('.d-badge__content').exists()).toBe(false)
    expect(mount(DBadge, { props: { value: 5, dot: true } }).find('.is-dot').exists()).toBe(true)
  })

  it('DSkeleton 行数与标题', () => {
    const wrapper = mount(DSkeleton, { props: { rows: 4, title: true } })
    expect(wrapper.findAll('.d-skeleton__row')).toHaveLength(4)
    expect(wrapper.find('.d-skeleton__title').exists()).toBe(true)
  })

  it('DEmpty 描述与内容插槽', () => {
    const wrapper = mount(DEmpty, { props: { description: '没有内容' }, slots: { default: () => h('button', '去创建') } })
    expect(wrapper.text()).toContain('没有内容')
    expect(wrapper.text()).toContain('去创建')
  })

  it('DImage fileRef 解析与失败兜底', async () => {
    // fileRef 拼接依赖宿主配置的前缀（库默认不内置后端地址），用例内显式配置
    configureFileAccessPrefix('/api/general/file/access/')
    // 带类型前缀 fileRef 拆类型拼接（不二次前缀）；完整 URL 原样返回
    const wrapper = mount(DImage, { props: { src: 'image/e6fe8463.png', alt: '示例图', fallbackText: '加载失败' } })
    expect(wrapper.find('img').attributes('src')).toBe('/api/general/file/access/image/e6fe8463.png')
    expect(wrapper.find('img').attributes('alt')).toBe('示例图')
    configureFileAccessPrefix('')

    const direct = mount(DImage, { props: { src: 'https://example.com/a.png' } })
    expect(direct.find('img').attributes('src')).toBe('https://example.com/a.png')

    // / 开头的同源相对路径（自建上传接口约定）原样使用，不拼访问前缀
    const relative = mount(DImage, { props: { src: '/uploads/abc.png' } })
    expect(relative.find('img').attributes('src')).toBe('/uploads/abc.png')

    // 加载失败 → fallback 占位；src 换回有效地址后自动重试
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('.d-image--error').exists()).toBe(true)
    expect(wrapper.text()).toContain('加载失败')
  })

  it('DImage 预览关闭与懒加载属性', () => {
    const off = mount(DImage, { props: { src: 'a.png', preview: false } })
    expect(off.findComponent({ name: 'PhotoConsumer' }).exists()).toBe(false)
    const lazy = mount(DImage, { props: { src: 'a.png', lazy: true } })
    expect(lazy.find('img').attributes('loading')).toBe('lazy')
  })

  it('DImageGroup 分组预览：组内不再自带 Provider', () => {
    // PhotoProvider 渲染为 Fragment（无对应 DOM 类名），按组件名查找
    const grouped = mount(DImageGroup, {
      slots: { default: () => [h(DImage, { src: 'a.png' }), h(DImage, { src: 'b.png' })] },
    })
    const groupedImages = grouped.findAllComponents(DImage)
    expect(groupedImages).toHaveLength(2)
    expect(groupedImages[0].findComponent({ name: 'PhotoConsumer' }).exists()).toBe(true)
    expect(groupedImages[0].findComponent({ name: 'PhotoProvider' }).exists()).toBe(false)
    // 无分组时单图自带 Provider 承载独立预览
    const alone = mount(DImage, { props: { src: 'a.png' } })
    expect(alone.findComponent({ name: 'PhotoProvider' }).exists()).toBe(true)
  })

  it('DImage src 换回有效地址后重置失败态', async () => {
    const wrapper = mount(DImage, { props: { src: 'broken.png' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('.d-image--error').exists()).toBe(true)
    await wrapper.setProps({ src: 'good.png' })
    expect(wrapper.find('.d-image--error').exists()).toBe(false)
  })

  it('DAvatar 尺寸形状与 fileRef 解析', () => {
    // fileRef 拼接依赖宿主配置的前缀（库默认不内置后端地址），用例内显式配置
    configureFileAccessPrefix('/api/general/file/access/')
    const wrapper = mount(DAvatar, { props: { src: 'image/e6fe8463.png', alt: '头像', size: 40 } })
    expect(wrapper.find('.d-avatar--circle').exists()).toBe(true)
    expect(wrapper.attributes('style')).toContain('2.5rem')
    expect(wrapper.attributes('title')).toBe('头像')
    expect(wrapper.find('img').attributes('src')).toBe('/api/general/file/access/image/e6fe8463.png')
    configureFileAccessPrefix('')

    // / 开头的同源相对路径原样使用，不拼访问前缀
    const relative = mount(DAvatar, { props: { src: '/uploads/abc.png', size: 40 } })
    expect(relative.find('img').attributes('src')).toBe('/uploads/abc.png')

    const square = mount(DAvatar, { props: { src: 'a.png', shape: 'square', size: '3rem' } })
    expect(square.find('.d-avatar--square').exists()).toBe(true)
    expect(square.attributes('style')).toContain('3rem')
  })

  it('DAvatar 空引用/加载失败进入兜底，src 恢复后重试', async () => {
    // 空引用直接兜底
    const empty = mount(DAvatar, { props: { fallbackText: '洛' } })
    expect(empty.find('.d-avatar--fallback').exists()).toBe(true)
    expect(empty.text()).toContain('洛')
    expect(empty.find('img').exists()).toBe(false)

    // 加载失败 → 兜底；#fallback 插槽可自定义
    const wrapper = mount(DAvatar, {
      props: { src: 'broken.png' },
      slots: { fallback: () => h('i', '自定义') },
    })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('.d-avatar--fallback').exists()).toBe(true)
    expect(wrapper.text()).toContain('自定义')
    // src 换成有效地址 → 自动重试回图片态
    await wrapper.setProps({ src: 'good.png' })
    expect(wrapper.find('.d-avatar__img').exists()).toBe(true)
  })

  it('DPagination 页码窗口与切换', async () => {
    const wrapper = mount(DPagination, { props: { total: 236, pageSize: 10, modelValue: 1 } })
    expect(wrapper.text()).toContain('…')
    await wrapper.findAll('button')[2].trigger('click') // 第 2 页
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    expect(wrapper.findAll('.is-active')).toHaveLength(1)
  })

  it('DProgress 收敛宽度与百分比文本', async () => {
    const wrapper = mount(DProgress, { props: { value: 150, text: true } })
    expect(wrapper.text()).toContain('100%')
    expect(wrapper.find('.d-progress__inner').attributes('style')?.replace(/\s+/g, '')).toContain('width:100%')
    await wrapper.setProps({ value: 62 })
    expect(wrapper.text()).toContain('62%')
    expect(wrapper.find('.d-progress__inner').attributes('style')?.replace(/\s+/g, '')).toContain('width:62%')
  })

  it('DProgress 状态色类、progressbar 语义与文本插槽', () => {
    const wrapper = mount(DProgress, {
      props: { value: 40, status: 'success', text: true },
      slots: { text: '第 4 / 10 题' },
    })
    expect(wrapper.classes()).toContain('d-progress--success')
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('40')
    expect(wrapper.text()).toContain('第 4 / 10 题')
  })

  it('DProgress 默认不显示文本', () => {
    const wrapper = mount(DProgress, { props: { value: 50 } })
    expect(wrapper.find('.d-progress__text').exists()).toBe(false)
  })

  it('DCodeBlock 渲染代码与复制按钮', () => {
    const wrapper = mount(DCodeBlock, { props: { code: 'const a = 1', language: 'ts' } })
    expect(wrapper.find('code').text()).toContain('const a = 1')
    expect(wrapper.find('.d-code-block__copy').exists()).toBe(true)
  })

  it('DTabs 标签切换与同名插槽内容', async () => {
    const wrapper = mount(DTabs, {
      props: {
        tabs: [{ key: 't1', label: '标签一' }, { key: 't2', label: '标签二' }, { key: 't3', label: '禁用', disabled: true }],
        modelValue: 't1',
      },
      slots: { t1: () => '内容一', t2: () => '内容二' },
    })
    expect(wrapper.text()).toContain('内容一')
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['t2'])
    // 受控组件：父级响应 v-model 后才切换内容
    await wrapper.setProps({ modelValue: 't2' })
    expect(wrapper.text()).toContain('内容二')
  })

  it('DTabs 无面板模式（panel=false）只渲染标签行，事件语义不变', async () => {
    const wrapper = mount(DTabs, {
      props: {
        tabs: [{ key: 'a', label: '甲' }, { key: 'b', label: '乙', disabled: true }],
        modelValue: 'a',
        panel: false,
      },
    })
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(false)
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    await wrapper.findAll('button')[1].trigger('click')
    // 禁用标签不触发
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.findAll('button')[0].trigger('click')
    // 同 key 不重复触发
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('DTabs 指示条为 24px 居中短条，滚动容器约束注释不得丢失', () => {
    // 约束注释：bar 是 overflow-x 滚动容器，指示条任何纵向 1px 溢出都会带出纵向滚动条
    expect(tabsSource).toContain('overflow-x 滚动容器')
    expect(tabsSource).toContain('bottom: 0')
    expect(tabsSource).toMatch(/width:\s*24px/)
    expect(tabsSource).toMatch(/border-radius:\s*2px/)
  })
})
