// 布局系统：DLayout / DHeader / DAside / DMain / DFooter
import { withInstall } from '@ui/with-install'
import Layout from './index.vue'
import Header from './header.vue'
import Aside from './aside.vue'
import Main from './main.vue'
import Footer from './footer.vue'

export { LAYOUT_KEY } from './layout-key'

/** d-layout 布局容器（含 DHeader/DAside/DMain/DFooter 组合） */
export const DLayout = withInstall(Layout, 'DLayout')
/** d-header 顶部栏（垂直方向容器内） */
export const DHeader = withInstall(Header, 'DHeader')
/** d-aside 侧边栏（存在时布局自动水平排列） */
export const DAside = withInstall(Aside, 'DAside')
/** d-main 内容区（占满剩余空间） */
export const DMain = withInstall(Main, 'DMain')
/** d-footer 底部栏 */
export const DFooter = withInstall(Footer, 'DFooter')

export default DLayout
