import { createApp } from 'vue'
import DrizzolUi, { initTheme, watchSystemTheme } from '@xmdrizzol/drizzol-ui'
import router from '@/router'
import App from './App.vue'
import './styles.scss'

initTheme()
watchSystemTheme()

createApp(App).use(DrizzolUi).use(router).mount('#app')
