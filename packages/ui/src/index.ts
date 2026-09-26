// @xmdrizzol/drizzol-ui 入口：全量安装插件 + 具名导出
import type { App } from 'vue'
import './styles/index.scss'

import { DIcon, DIconSprite } from './components/icon'
import { DLayout, DHeader, DAside, DMain, DFooter } from './components/layout'
import { DRow, DCol } from './components/grid'
import { DMenu } from './components/menu'
import { DTabs } from './components/tabs'
import { DPagination } from './components/pagination'
import { DTag } from './components/tag'
import { DBadge } from './components/badge'
import { DSkeleton } from './components/skeleton'
import { DEmpty } from './components/empty'
import { DImage, DImageGroup } from './components/image'
import { DAvatar } from './components/avatar'
import { DProgress } from './components/progress'
import { DCodeBlock } from './components/code-block'
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
import { DDrawer } from './components/drawer'

/** 全部组件（插件安装时按序注册） */
const components = [
  DIcon, DIconSprite, DLayout, DHeader, DAside, DMain, DFooter, DRow, DCol, DMenu, DTabs, DPagination,
  DTag, DBadge, DSkeleton, DEmpty, DImage, DImageGroup, DAvatar, DProgress, DCodeBlock, DCard, DButton, DInput, DForm, DFormItem,
  DModal, DDropdown, DUpload, DCropper, DVideo, DPageHero, DPageCover,
  DFloatBar, DSearch, DSort, DDrawer
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
export * from './components/layout'
export * from './components/grid'
export * from './components/menu'
export * from './components/tabs'
export * from './components/pagination'
export * from './components/tag'
export * from './components/badge'
export * from './components/skeleton'
export * from './components/empty'
export * from './components/image'
export * from './components/avatar'
export * from './components/progress'
export * from './components/code-block'
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
export * from './components/drawer'

// 命令式提示（message / notification / confirm）
export * from './components/message'
export * from './components/notification'
export * from './components/confirm'

// 工具与组合式函数
export * from './utils'
export * from './composables/useClickOutside'
export * from './composables/useDevice'
export * from './composables/useInView'
export * from './composables/useScrollListen'

// 通用类型
export * from './types/api'
