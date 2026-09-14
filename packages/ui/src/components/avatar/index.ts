import { withInstall } from '@ui/with-install'
import Avatar from './index.vue'

/** d-avatar 头像（图片/文字兜底，圆/方，fileRef 解析与 DImage 同一套规则） */
export const DAvatar = withInstall(Avatar, 'DAvatar')

export default DAvatar
