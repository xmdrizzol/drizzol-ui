import { withInstall } from '@ui/with-install'
import Image from './index.vue'
import ImageGroup from './group.vue'

/** d-image 图片（fileRef 解析、加载失败兜底、点击预览大图） */
export const DImage = withInstall(Image, 'DImage')

/** d-image-group 图片分组（组内预览可左右切换，透传预览器配置） */
export const DImageGroup = withInstall(ImageGroup, 'DImageGroup')

export default DImage
