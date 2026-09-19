import { createApp } from 'vue'
import DrizzolUi, { initTheme, watchSystemTheme, configureFileApi, configureFileAccessPrefix } from '@xmdrizzol/drizzol-ui'
import router from '@/router'
import App from './App.vue'
import './styles.scss'

initTheme()
watchSystemTheme()

// 库源码不内置后端地址：演示站按 drizzol 契约在入口配置（宿主项目同款写法，见 README）
configureFileApi({ uploadUrl: '/general/file/upload', uploadImageUrl: '/general/file/upload/image' })
configureFileAccessPrefix('/api/general/file/access/')

createApp(App).use(DrizzolUi).use(router).mount('#app')
