<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">网络·文件·存储<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">
                依赖后端契约或有副作用的工具（请求层、文件上传/访问、Cookie）以用法示例为主；
                <code>getFileAccessUrl</code> 与 cookie 读写为纯前端、可现场试。请求层约定与后端字段可在宿主项目按需改 <code>baseURL</code> / 前缀。
            </p>
        </header>

        <demo-block title="请求实例" anchor-id="request"
            desc="默认 request 实例：响应拦截器已解包 res.data，非 2xx 统一 DMessage.error 报错、401 触发清理。">
            <d-code-block language="ts" copyable :code="requestDoc" />
        </demo-block>

        <demo-block title="运行时配置" anchor-id="configure"
            desc="库构建后 import.meta.env 不存在，baseURL / 401 回调等一律运行时注入（宿主入口调用一次）。">
            <d-code-block language="ts" copyable :code="configureDoc" />
        </demo-block>

        <demo-block title="后端契约" anchor-id="contract"
            desc="响应统一 { code, msg, data }，code === 200 为成功；不符时改 baseURL 或自行封装 request。">
            <d-code-block language="ts" copyable :code="contractDoc" />
        </demo-block>

        <demo-block title="文件上传" anchor-id="upload"
            desc="uploadFile / uploadImage 对接文件接口，字段 File + CustomCategory，multipart 头交给浏览器补 boundary。">
            <d-code-block language="ts" copyable :code="uploadDoc" />
        </demo-block>

        <demo-block title="文件访问地址" anchor-id="fileaccess"
            desc="getFileAccessUrl 把 fileRef 拼成可访问 URL；已是完整地址（http/blob/data 或含前缀）则原样返回（幂等）。">
            <div class="demo-block__stack api-col">
                <d-input v-model="fileRef" placeholder="如 image/e6fe8463.png 或 storedFileName" />
                <div class="api-types">
                    <d-button v-for="t in fileTypes" :key="t" size="small"
                        :type="fileType === t ? 'primary' : 'default'" @click="fileType = t">{{ t }}</d-button>
                </div>
                <div class="api-url">
                    <span class="api-url__label">访问 URL</span>
                    <code class="api-url__val">{{ accessUrl }}</code>
                </div>
                <p class="api-note">自定义前缀：<code>configureFileAccessPrefix('https://files.example.com/access')</code></p>
            </div>
        </demo-block>

        <demo-block title="Cookie 读写" anchor-id="cookie"
            desc="原始串走 get/setCookie（读写对称），对象走 get/setJSONCookie，用户信息走 get/setUserCookie（userInfo 键薄封装）。">
            <div class="demo-block__stack api-col">
                <div class="api-actions">
                    <d-button @click="writeRaw">写入字符串 cookie</d-button>
                    <d-button @click="writeJson">写入 JSON cookie</d-button>
                    <d-button plain @click="clearDemo">清除</d-button>
                </div>
                <div class="api-readout">
                    <span>普通串 <code>dz_demo</code> →</span> <b>{{ rawVal === null ? '（无）' : rawVal }}</b>
                </div>
                <div class="api-readout">
                    <span>JSON <code>dz_demo_json</code> →</span> <b>{{ jsonVal === null ? '（无）' : JSON.stringify(jsonVal) }}</b>
                </div>
                <div class="api-readout">
                    <span>isLogin() →</span> <b>{{ String(login) }}</b>
                </div>
            </div>
        </demo-block>

        <demo-block title="设备判定" anchor-id="device"
            desc="isMobile / isTablet / isDesktop 基于 userAgent + 视口宽度的纯函数（非响应式；需响应式用 useIsMobile）。">
            <div class="api-types">
                <d-tag :type="device.isMobile ? 'warning' : 'info'">isMobile: {{ device.isMobile }}</d-tag>
                <d-tag :type="device.isTablet ? 'warning' : 'info'">isTablet: {{ device.isTablet }}</d-tag>
                <d-tag :type="device.isDesktop ? 'success' : 'info'">isDesktop: {{ device.isDesktop }}</d-tag>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    getFileAccessUrl,
    setCookie, getCookie, setJSONCookie, getJSONCookie, removeCookie,
    setUserCookie, removeUserCookie, isLogin,
    isMobile, isTablet, isDesktop,
} from '@xmdrizzol/drizzol-ui'
import DemoBlock from '@/components/demo-block'

const requestDoc = `import { request } from '@xmdrizzol/drizzol-ui'

// 响应拦截器已解包 res.data，业务码约定 code === 200 为成功
const list = await request.get('/posts', { params: { page: 1 } })
await request.post('/posts', { title: 'hi' })

// 非 2xx 统一 DMessage.error 报错；502 提示“服务器错误”；401 触发登出（见下）`

const configureDoc = `import { configureRequest, getBaseUrl, Theme } from '@xmdrizzol/drizzol-ui'

configureRequest({
  baseURL: '/api',
  timeout: 15000,
  // 401（非白名单）时清理宿主登录态；并发 401 只触发一次
  onUnauthorized: () => userStore.logout(),
  // 登录/注册/验证码等接口命中 401 时只提示、不清登录态
  noLogoutApis: ['/login', '/register', '/sendCode'],
})

getBaseUrl('/upload')  // 'https://api.example.com/upload'（供直连场景拼接）`

const contractDoc = `// 后端统一响应包：非 200 会被 reject，交给你 catch 或全局处理
interface ApiResponse<T> {
  code: number   // 200 = 成功
  msg: string
  data: T
}

// 因此泛型按整包标注：
const res = await request.get<ApiResponse<Post[]>>('/posts')
const posts = res.data`

const uploadDoc = `import { uploadFile, uploadImage } from '@xmdrizzol/drizzol-ui'

// POST /general/file/upload（字段 File + CustomCategory）
const { data } = await uploadFile({ file: rawFile, category: 'image' })
// data: { storedFileName, accessUrl }

// POST /general/file/upload/image（裁剪图等 Blob）
await uploadImage({ file: blob })
// 注：multipart 的 Content-Type 交给浏览器补 boundary，切勿手写死`

// getFileAccessUrl 现场试用
const fileTypes = ['image', 'video', 'document', 'other'] as const
const fileType = ref<'image' | 'video' | 'document' | 'other'>('image')
const fileRef = ref('e6fe8463.png')
const accessUrl = computed(() => getFileAccessUrl(fileRef.value, fileType.value))

// cookie 现场试用
const rawVal = ref<string | null>(getCookie('dz_demo'))
const jsonVal = ref<unknown>(getJSONCookie('dz_demo_json'))
const login = ref(isLogin())
function refreshCookies() {
    rawVal.value = getCookie('dz_demo')
    jsonVal.value = getJSONCookie('dz_demo_json')
    login.value = isLogin()
}
function writeRaw() {
    setCookie('dz_demo', 'hello-' + Date.now() % 1000)
    refreshCookies()
}
function writeJson() {
    setJSONCookie('dz_demo_json', { id: 7, tags: ['a', 'b'] })
    setUserCookie({ id: 7, name: 'kosame' })
    refreshCookies()
}
function clearDemo() {
    removeCookie('dz_demo')
    removeCookie('dz_demo_json')
    removeUserCookie()
    refreshCookies()
}

const device = { isMobile: isMobile(), isTablet: isTablet(), isDesktop: isDesktop() }
</script>

<style scoped lang="scss">
.component-page__desc code,
.api-note code {
    padding: 1px 5px;
    border-radius: 4px;
    background: var(--dz-code-bg);
    font-family: var(--dz-ff-mono);
    font-size: 0.8125rem;
}

.api-col {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.api-types {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.api-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.api-url {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    &__label {
        font-size: 0.8125rem;
        color: var(--dz-text-d);
    }

    &__val {
        padding: 4px 10px;
        border-radius: 6px;
        border: 1px solid var(--dz-border);
        background: var(--dz-bg);
        font-family: var(--dz-ff-mono);
        font-size: 0.8125rem;
        color: var(--dz-primary);
        word-break: break-all;
    }
}

.api-note {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--dz-text-l);
}

.api-readout {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 0.875rem;
    color: var(--dz-text-d);

    b {
        font-family: var(--dz-ff-mono);
        color: var(--dz-text);
        word-break: break-all;
    }
}
</style>
