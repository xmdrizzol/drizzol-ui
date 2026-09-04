import { withInstall } from '@ui/with-install'
import Row from './row.vue'
import Col from './col.vue'

export type { GridBreak } from './col.vue'

/** d-row 栅格行（24 分栏，配合 DCol） */
export const DRow = withInstall(Row, 'DRow')
/** d-col 栅格列（span/offset + xs/sm/md/lg/xl 响应式断点） */
export const DCol = withInstall(Col, 'DCol')

export default DRow
