// @drizzol/ui 入口：全量安装插件 + 具名导出
import type { App } from 'vue'
import './styles/index.scss'

import { DIcon, DIconSprite } from './components/icon'
import { DCard } from './components/card'
import { DButton } from './components/button'
import { DInput } from './components/input'
import { DForm } from './components/form'
import { DFormItem } from './components/form-item'
import { DModal } from './components/modal'
import { DDropdown } from './components/dropdown'
import { DUpload } from './components/upload'
import { DCropper } from './components/cropper'
import { DVideo } from './components/video'
import { DPageHero } from './components/page-hero'
import { DPageCover } from './components/page-cover'
import { DFloatBar } from './components/float-bar'
import { DSearch } from './components/search'
import { DSort } from './components/sort'

/** 全部组件（插件安装时按序注册） */
const components = [
  DIcon, DIconSprite, DCard, DButton, DInput, DForm, DFormItem,
  DModal, DDropdown, DUpload, DCropper, DVideo, DPageHero, DPageCover,
  DFloatBar, DSearch, DSort
]

/**
 * 全量安装插件：app.use(DrizzolUI) 注册全部组件
 */
export function install(app: App) {
  components.forEach(c => app.use(c))
}

export default { install }

// 组件具名导出
export * from './components/icon'
export * from './components/card'
export * from './components/button'
export * from './components/input'
export * from './components/form'
export * from './components/form-item'
export * from './components/modal'
export * from './components/dropdown'
export * from './components/upload'
export * from './components/cropper'
export * from './components/video'
export * from './components/page-hero'
export * from './components/page-cover'
export * from './components/float-bar'
export * from './components/search'
export * from './components/sort'

// 工具与组合式函数
export * from './utils'
export * from './composables/useClickOutside'
export * from './composables/useDevice'
export * from './composables/useInView'
export * from './composables/useScrollListen'

// 通用类型
export * from './types/api'
