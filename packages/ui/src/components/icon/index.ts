import { withInstall } from '@/with-install'
import Icon from './index.vue'
import Sprite from './symbols.vue'

/** d-icon 图标组件（依赖宿主在根节点渲染一次 <d-icon-sprite />） */
export const DIcon = withInstall(Icon, 'DIcon')

/** d-icon-sprite 雪碧图注入组件（根节点渲染一次，提供 #dz-icon-* symbols） */
export const DIconSprite = withInstall(Sprite, 'DIconSprite')

export default DIcon
