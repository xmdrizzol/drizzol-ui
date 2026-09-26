# Drizzol UI

[![npm](https://img.shields.io/npm/v/@xmdrizzol/drizzol-ui?color=1677ff)](https://www.npmjs.com/package/@xmdrizzol/drizzol-ui)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/xmdrizzol/drizzol-ui/blob/main/LICENSE)
[![docs](https://img.shields.io/badge/%E5%9C%A8%E7%BA%BF%E6%96%87%E6%A1%A3-ui.drizzol.top-1677ff)](https://ui.drizzol.top)

Vue 3 组件库 —— 组件、工具函数、样式体系的统一基准。基于 `@xmdrizzol/drizzol-ui`，可作为个人/小型项目前端基建直接使用。

📦 [npm](https://www.npmjs.com/package/@xmdrizzol/drizzol-ui) · 🐙 [GitHub](https://github.com/xmdrizzol/drizzol-ui) · 🖥 [在线演示](https://ui.drizzol.top) · 📖 [贡献指南](https://github.com/xmdrizzol/drizzol-ui/blob/main/CONTRIBUTING.md)

- 组件全部 `D` 前缀（`DButton` → 模板 `<d-button>`）
- 样式全部走 `--dz-*` CSS 变量（深浅双主题 `:root.dark`）
- 工具函数（request 拦截器、theme、cookie、pxToRem 等）随包导出
- 提示/通知/确认/抽屉均为库内自研，**不依赖任何第三方 UI 库**

## 安装

```bash
npm i @xmdrizzol/drizzol-ui vue
```

`vue` 为 peerDependency（宿主自行安装；`vue-router` 可选）。

## 快速开始

```ts
// main.ts
import { createApp } from 'vue'
import DrizzolUi from '@xmdrizzol/drizzol-ui'
import '@xmdrizzol/drizzol-ui/style.css'

const app = createApp(App)
app.use(DrizzolUi) // 全量注册 d-* 组件
app.mount('#app')
```

```vue
<!-- App.vue：根节点渲染一次雪碧图即可 -->
<template>
  <d-icon-sprite />
  <d-card is-hover>
    <d-button type="primary" icon="add">新增</d-button>
  </d-card>
</template>
```

也可以按需具名导入（配合 tree-shaking）：

```ts
import { DCard, DButton, message, applyTheme } from '@xmdrizzol/drizzol-ui'
```

## 组件清单

| 组件 | 说明 |
| --- | --- |
| `DLayout` / `DHeader` / `DAside` / `DMain` / `DFooter` | 布局系统（容器 + 头/侧/内容/脚，存在侧栏时自动水平排列） |
| `DMenu` | 导航菜单（分组/平铺、图标、路由链接、禁用、激活高亮；vue-router 为可选依赖） |
| `DTabs` | 标签页（v-model 激活 key，内容按 key 同名插槽；`panel=false` 为无面板模式——只渲染标签行，key 支持泛型 `DTabItem<'a' \| 'b'>`） |
| `DPagination` | 分页（页码窗口 + 省略号，total/pageCount 两种模式） |
| `DRow` / `DCol` | 24 分栏栅格（gutter 列间距、span/offset、xs~xl 响应式断点） |
| `DTag` | 语义标签（default/primary/success/warning/danger/info，round/small/closable） |
| `DBadge` | 角标（数值截断 max+、红点、零值/隐藏策略） |
| `DSkeleton` | 骨架屏（rows/title/avatar，流光动画） |
| `DEmpty` | 空状态（占位图标 + 描述 + 操作区插槽） |
| `DProgress` | 进度条（`value` 0-100 自动收敛；`status` 语义色；`text` 百分比与 `#text` 插槽；高度/配色经 `--dz-progress-height/fill/track` 可调，upload-notify 内部同款） |
| `DCodeBlock` | 代码块承载壳（语言标识 + 复制按钮 + 移动端横滚，恒定深色与正文代码同语言）；不做高亮——纯文本直接传 `code`，或用任意高亮库（Shiki / Prism 等）生成 HTML 经默认插槽传入 |
| `DIcon` / `DIconSprite` | 图标（内联 53 个 symbol 雪碧图，源自 [Lucide](https://lucide.dev) ISC 许可，含 4 个 `*-fill` 填充版与状态图标（circle-check/circle-alert 等）；根节点渲染一次 sprite） |
| `DCard` | 卡片（`is-hover` 悬浮） |
| `DButton` | 按钮（type 六色 default/primary/success/warning/danger/info + link/round/plain/block/small，支持图标插槽） |
| `DInput` | 输入框（text/password/textarea/number） |
| `DForm` / `DFormItem` | 表单与字段校验（required/min/max/validator，支持分规则文案 requiredMessage/minMessage/maxMessage） |
| `DModal` | 弹窗（Teleport + 过渡动画，mask 可关） |
| `DDrawer` | 抽屉（右/左/上/下四方向滑出 `direction`，v-model:visible，Esc 可关） |
| `DMessage` | 命令式消息 toast（顶部居中，success/error/warning/info，自动消失/句柄关闭） |
| `DNotification` | 命令式通知（右上角，支持 VNode 正文，句柄关闭） |
| `DConfirm` | 命令式确认框（基于 DModal，对齐 ElMessageBox 语义） |
| `DDropdown` | 下拉（click/hover 触发，CSS 过渡动画） |
| `DUpload` | 上传（进度通知/取消/多文件，对接文件接口契约） |
| `DCropper` | 图片裁剪（cropperjs，输出尺寸可配） |
| `DVideo` | 视频播放器（ArtPlayer 封装） |
| `DPageHero` / `DPageCover` | 页面横幅 / 视差封面 |
| `DFloatBar` | 右下浮动按钮（返回顶部/目录，threshold 可配） |
| `DSearch` | 搜索框（防抖） |
| `DSort` | 排序筛选（字段/时间范围/状态选项可配） |

## 工具函数（`import { ... } from '@xmdrizzol/drizzol-ui'`）

| 分类 | 导出 |
| --- | --- |
| 请求 | `request`（默认实例）、`createRequest`、`configureRequest`、`getBaseUrl`；统一解包 `res.data`、401 白名单、取消静默、`DMessage.error` 错误提示 |
| 提示 | `DMessage`（顶部 toast：success/error/warning/info）、`DNotification`（右上角通知，支持 VNode 正文）、`DConfirm`（基于 DModal 的命令式确认框）、`showUploadNotification`（上传进度通知：两行式进度 + ✕ 取消确认，可独立于 DUpload 使用）、`DLoadingBar`（页面顶部加载进度条：`start()/done()` 命令式，路由切换常配） |
| 主题 | `Theme`、`applyTheme`、`initTheme`、`watchSystemTheme`、`isSystemDarkMode`、`THEME_KEY` |
| 文件 | `getFileAccessUrl`、`resolveAccessUrl`（宽容解析：类型前缀拆解/纯文件名拼接）、`configureFileAccessPrefix`、`configureFileAccessResolver`（完全接管 src → URL）、`configureFileApi`、`uploadFile`、`uploadImage` |
| 通用 | `pxToRem`、`ratioToPaddingTop`（宽高比 → `padding-top` 百分比，`aspect-ratio` 的旧内核兜底）、`formatDate`、`debounce`、`throttle`、cookie（`get/setCookie` 原始串、`get/setJSONCookie` 对象、`get/setUserCookie` userInfo 薄封装、remove 系列） |
| 组合式 | `useClickOutside`、`useIsMobile`、`useInView`、`useScrollListener` |

### 请求配置示例

```ts
import { configureRequest } from '@xmdrizzol/drizzol-ui'

configureRequest({
  baseURL: '/api',
  onUnauthorized: () => userStore.clear(), // 401 时清理宿主登录态
})
```

后端契约约定：响应 `{ code, msg, data }` 包一层，`code === 200` 为成功；文件上传 `POST /api/general/file/upload[/image]`（字段 `File` + `CustomCategory`），访问 `GET /api/general/file/access/{type}/{fileRef}`。

**库源码不内置任何后端地址**——上传路径与访问前缀默认为空，文件地址完全由宿主声明。按上述契约使用时，在应用入口配置一次：

```ts
import { configureFileApi, configureFileAccessPrefix } from '@xmdrizzol/drizzol-ui'

// 上传接口路径（DUpload / DCropper 组件也可传 action，uploadFile / uploadImage 可传 url 覆盖）
configureFileApi({ uploadUrl: '/general/file/upload', uploadImageUrl: '/general/file/upload/image' })

// 文件访问前缀：fileRef（如 image/xxx.png 或裸存储文件名）按 `前缀 + type/fileRef` 拼接
configureFileAccessPrefix('/api/general/file/access/')
```

图片类组件（DImage / DAvatar / DUpload 预览）的 `src` 语义：`http(s)` / `blob:` / `data:` 开头的完整地址与 `/` 开头的同源相对路径（如 `/uploads/xxx.png`）**原样使用**；其余视为 fileRef——已配置前缀时按 `前缀 + type/fileRef` 拼接，未配置时原样返回。拼接规则不满足后端约定时，`configureFileAccessResolver(src => ...)` 可完全接管 src → URL 的解析（优先于前缀配置，传 `undefined` 恢复内置规则）。

## 样式与主题

- 组件 CSS 随包导出于 `dist/style.css`（已含 `--dz-*` 变量定义与基础排版：h1~h6/p/code/pre/kbd 字号阶梯与边距），保持 px 单位——pxtorem 等转换属宿主项目决策
- 主题切换：`<html>` 挂 `dark` class（`applyTheme` 三态：auto/light/dark，localStorage 持久化）
- 自定义品牌色：改 `_variables.scss` 的 `$light-primary-*` / `$dark-primary-*` 两套 10 级色板重新编译（语义浅底三元组同源派生，自动同步），或直接在宿主覆盖 `--dz-primary` 等 CSS 变量（运行时覆盖需成对覆盖对应 `-rgb` 三元组，见「浏览器兼容性」）
- SCSS 源文件随包输出（`@xmdrizzol/drizzol-ui/styles`），`@mixin prose` 正文排版、`mobile`/`flex` 等 mixin 可被宿主 `@use`

```scss
@use '@xmdrizzol/drizzol-ui/styles/_mixin.scss' as *;
// vite 可选：与库一致的 additionalData 全局注入
```

### 浏览器兼容性（最低 Chrome 86）

产物基线为**最低支持 Chrome 86**：源码不使用高于该基线的 CSS 语法，构建声明 `build.cssTarget: 'chrome86'`（否则 Vite 8 默认目标会让压缩器产出旧内核无法解析的 `inset`、range 媒体查询等），并以 `npm test` 扫源码 + `npm run build` 末尾扫产物的双护栏防回归。

**宿主自建构建同样要声明**，否则打包时会把库产物重新压缩回现代语法、静默抵消兼容性：

```ts
// 宿主 vite.config.ts
export default defineConfig({
  build: { cssTarget: 'chrome86' }, // 与库保持一致
})
```

写法规范（四个模板 + 禁写清单 + 语义色成对维护）、修复记录与宿主侧清单详见 [`docs/browser-support.md`](https://github.com/xmdrizzol/drizzol-ui/blob/main/docs/browser-support.md)。

## 贡献

欢迎 Issue 与 PR！提交前请阅读 [CONTRIBUTING.md](https://github.com/xmdrizzol/drizzol-ui/blob/main/CONTRIBUTING.md)：

- Bug 报告请附版本、复现步骤与期望/实际行为（[Issue 模板](https://github.com/xmdrizzol/drizzol-ui/issues/new/choose)）
- PR 走 fork + 分支，**不要直接 push main**；提交遵循 Conventional Commits
- `npm test` / `npm run typecheck` 必须通过；发布物改动需附 changeset

## 许可与致谢

本库源码基于 [MIT](https://github.com/xmdrizzol/drizzol-ui/blob/main/LICENSE) 许可开源。

- 内置图标来自 [Lucide](https://lucide.dev)（ISC 许可），经 Iconify 拉取后内联
- 运行时依赖 axios / js-cookie / cropperjs / artplayer 均为 MIT
- 各依赖与图标的详细许可说明见[在线文档「介绍」页](https://ui.drizzol.top)
