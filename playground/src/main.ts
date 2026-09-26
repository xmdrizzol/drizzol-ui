import { createApp } from 'vue'
import DrizzolUi, { initTheme, watchSystemTheme, configureFileApi, configureFileAccessPrefix } from '@xmdrizzol/drizzol-ui'
import router from '@/router'
import App from './App.vue'
import ShikiCodeBlock from './components/shiki-code-block'
import './styles.scss'

initTheme()
watchSystemTheme()

// 库源码不内置后端地址：演示站按 drizzol 契约在入口配置（宿主项目同款写法，见 README）
configureFileApi({ uploadUrl: '/general/file/upload', uploadImageUrl: '/general/file/upload/image' })
configureFileAccessPrefix('/api/general/file/access/')

const app = createApp(App).use(DrizzolUi)
// 同名覆写：演示站的 d-code-block 换成带 Shiki 高亮的包装版（props 对齐，页面零改动）。
// 库产物不内置 Shiki——宿主想要同样效果，照 demo 页「配合 Shiki 预高亮」的插槽写法接入即可
app.component('DCodeBlock', ShikiCodeBlock)
app.use(router).mount('#app')
