import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import DrizzolUi, { initTheme, watchSystemTheme } from '@drizzol/ui'
import router from '@/router'
import App from './App.vue'
import './styles.scss'

initTheme()
watchSystemTheme()

createApp(App).use(ElementPlus).use(DrizzolUi).use(router).mount('#app')
