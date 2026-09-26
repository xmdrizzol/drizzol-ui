import { withInstall } from '@ui/with-install'
import Upload from './index.vue'

/** d-upload 组件 */
export const DUpload = withInstall(Upload, 'DUpload')

// 上传进度通知（包根经 src/index.ts 的 export * 透出，可独立于 DUpload 使用）
export * from './upload-notify'

export default DUpload
