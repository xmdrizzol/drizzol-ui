import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home'
import Theme from '@/views/theme'
import Intro from '@/views/intro'
import Utils from '@/views/utils'
import UtilsApi from '@/views/utils/api.vue'

import DLayout from '@/views/components/dlayout'
import DMenu from '@/views/components/dmenu'
import DGrid from '@/views/components/dgrid'
import DTag from '@/views/components/dtag'
import DBadge from '@/views/components/dbadge'
import DSkeleton from '@/views/components/dskeleton'
import DEmpty from '@/views/components/dempty'
import DImage from '@/views/components/dimage'
import DAvatar from '@/views/components/davatar'
import DPagination from '@/views/components/dpagination'
import DCodeBlock from '@/views/components/dcodeblock'
import DTabs from '@/views/components/dtabs'

import DCard from '@/views/components/dcard'
import DButton from '@/views/components/dbutton'
import DInput from '@/views/components/dinput'
import DForm from '@/views/components/dform'
import DFormItem from '@/views/components/dformitem'
import DModal from '@/views/components/dmodal'
import DDropdown from '@/views/components/ddropdown'
import DMessage from '@/views/components/dmessage'
import DNotification from '@/views/components/dnotification'
import DConfirm from '@/views/components/dconfirm'
import DDrawer from '@/views/components/ddrawer'
import DIcon from '@/views/components/dicon'
import DSearch from '@/views/components/dsearch'
import DSort from '@/views/components/dsort'
import DFloatBar from '@/views/components/dfloatbar'
import DPageHero from '@/views/components/dpagehero'
import DPageCover from '@/views/components/dpagecover'
import DVideo from '@/views/components/dvideo'
import DCropper from '@/views/components/dcropper'
import DUpload from '@/views/components/dupload'
import NotFound from '@/views/error/404.vue'

/**
 * 组件库文档站路由：
 * - /                      总览
 * - /theme                 主题色板
 * - /components/:slug      每个组件独立页（16 个）
 * - 未知路径 → 404
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/intro', name: 'intro', component: Intro },
    { path: '/theme', name: 'theme', component: Theme },
    { path: '/utils', name: 'utils', component: Utils },
    { path: '/utils/api', name: 'utils-api', component: UtilsApi },
    { path: '/components/dlayout', name: 'dlayout', component: DLayout },
    { path: '/components/dmenu', name: 'dmenu', component: DMenu },
    { path: '/components/dgrid', name: 'dgrid', component: DGrid },
    { path: '/components/dtag', name: 'dtag', component: DTag },
    { path: '/components/dbadge', name: 'dbadge', component: DBadge },
    { path: '/components/dskeleton', name: 'dskeleton', component: DSkeleton },
    { path: '/components/dempty', name: 'dempty', component: DEmpty },
    { path: '/components/dimage', name: 'dimage', component: DImage },
    { path: '/components/davatar', name: 'davatar', component: DAvatar },
    { path: '/components/dpagination', name: 'dpagination', component: DPagination },
    { path: '/components/dcodeblock', name: 'dcodeblock', component: DCodeBlock },
    { path: '/components/dtabs', name: 'dtabs', component: DTabs },

    { path: '/components/dcard', name: 'dcard', component: DCard },
    { path: '/components/dbutton', name: 'dbutton', component: DButton },
    { path: '/components/dinput', name: 'dinput', component: DInput },
    { path: '/components/dform', name: 'dform', component: DForm },
    { path: '/components/dformitem', name: 'dformitem', component: DFormItem },
    { path: '/components/dmodal', name: 'dmodal', component: DModal },
    { path: '/components/ddropdown', name: 'ddropdown', component: DDropdown },
    { path: '/components/dmessage', name: 'dmessage', component: DMessage },
    { path: '/components/dnotification', name: 'dnotification', component: DNotification },
    { path: '/components/dconfirm', name: 'dconfirm', component: DConfirm },
    { path: '/components/ddrawer', name: 'ddrawer', component: DDrawer },
    { path: '/components/dicon', name: 'dicon', component: DIcon },
    { path: '/components/dsearch', name: 'dsearch', component: DSearch },
    { path: '/components/dsort', name: 'dsort', component: DSort },
    { path: '/components/dfloatbar', name: 'dfloatbar', component: DFloatBar },
    { path: '/components/dpagehero', name: 'dpagehero', component: DPageHero },
    { path: '/components/dpagecover', name: 'dpagecover', component: DPageCover },
    { path: '/components/dvideo', name: 'dvideo', component: DVideo },
    { path: '/components/dcropper', name: 'dcropper', component: DCropper },
    { path: '/components/dupload', name: 'dupload', component: DUpload },
    { path: '/:pathMatch(.*)*', name: '404', component: NotFound },
  ],
})

export default router
