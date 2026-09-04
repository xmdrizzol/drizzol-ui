import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/home.vue'
import ThemeDemo from './views/theme-demo.vue'
import BasicDemo from './views/basic-demo.vue'
import AdvancedDemo from './views/advanced-demo.vue'

/**
 * 组件库门户路由：
 * - /                      总览
 * - /theme                 主题色板
 * - /components/basic      基础组件（条目带 #fc-* 锚点）
 * - /components/advanced   增强组件
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/theme', name: 'theme', component: ThemeDemo },
    { path: '/components/basic', name: 'basic', component: BasicDemo },
    { path: '/components/advanced', name: 'advanced', component: AdvancedDemo },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
