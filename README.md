# Drizzol UI

Vue 3 组件库 —— 组件、工具函数、样式体系的统一基准。基于 `@drizzol/ui`，可作为个人/小型项目前端基建直接使用。

- 组件全部 `D` 前缀（`DButton` → 模板 `<d-button>`）
- 样式全部走 `--dz-*` CSS 变量（深浅双主题 `:root.dark`）
- 工具函数（request 拦截器、theme、cookie、pxToRem 等）随包导出
- 插件体系见 [docs/PLUGIN.md](docs/PLUGIN.md)

## 安装

```bash
npm i @drizzol/ui element-plus vue
```

`vue` 与 `element-plus` 为 peerDependencies，宿主自行安装。

## 快速开始

```ts
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import DrizzolUi from '@drizzol/ui'
import '@drizzol/ui/style.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(DrizzolUi) // 全量注册 d-* 组件
app.mount('#app')
```

```vue
<!-- App.vue：根节点渲染一次雪碧图即可 -->
<template>
  <d-icon-sprite />
  <d-card is-hover>
    <d-button type="primary" icon="dz-icon-add">新增</d-button>
  </d-card>
</template>
```

也可以按需具名导入（配合 tree-shaking）：

```ts
import { DCard, DButton, request, applyTheme } from '@drizzol/ui'
```

## 组件清单

| 组件 | 说明 |
| --- | --- |
| `DIcon` / `DIconSprite` | 图标（内联 52 个 symbol 雪碧图，根节点渲染一次 sprite） |
| `DCard` | 卡片（`is-hover` 悬浮） |
| `DButton` | 按钮（type/link/round/block/plain/small） |
| `DInput` | 输入框（text/password/textarea/number） |
| `DForm` / `DFormItem` | 表单与字段校验（required/min/max/validator） |
| `DModal` | 弹窗（Teleport + 过渡动画，mask 可关） |
| `DDropdown` | 下拉（click/hover 触发，gsap 过渡） |
| `DUpload` | 上传（进度通知/取消/多文件，对接文件接口契约） |
| `DCropper` | 图片裁剪（cropperjs，输出尺寸可配） |
| `DVideo` | 视频播放器（ArtPlayer 封装） |
| `DPageHero` / `DPageCover` | 页面横幅 / 视差封面 |
| `DFloatBar` | 右下浮动按钮（返回顶部/目录，threshold 可配） |
| `DSearch` | 搜索框（防抖） |
| `DSort` | 排序筛选（字段/时间范围/状态选项可配） |

## 工具函数（`import { ... } from '@drizzol/ui'`）

| 分类 | 导出 |
| --- | --- |
| 请求 | `request`（默认实例）、`createRequest`、`configureRequest`、`getBaseUrl`；统一解包 `res.data`、401 白名单、取消静默、ElMessage 错误提示 |
| 主题 | `Theme`、`applyTheme`、`initTheme`、`watchSystemTheme`、`isSystemDarkMode`、`THEME_KEY` |
| 文件 | `getFileAccessUrl`、`configureFileAccessPrefix`、`uploadFile`、`uploadImage` |
| 通用 | `pxToRem`、`formatDate`、`debounce`、`throttle`、cookie（set/get/remove 系列） |
| 组合式 | `useClickOutside`、`useIsMobile`、`useInView`、`useScrollListener` |

### 请求配置示例

```ts
import { configureRequest } from '@drizzol/ui'

configureRequest({
  baseURL: '/api',
  onUnauthorized: () => userStore.clear(), // 401 时清理宿主登录态
})
```

后端契约约定：响应 `{ code, msg, data }` 包一层，`code === 200` 为成功；文件上传 `POST /api/general/file/upload[/image]`（字段 `File` + `CustomCategory`），访问 `GET /api/general/file/access/{type}/{fileRef}`。后端不同时，修改 `baseURL` / `configureFileAccessPrefix` 或自行封装 request。

## 样式与主题

- 组件 CSS 随包导出于 `dist/style.css`（已含 `--dz-*` 变量定义），保持 px 单位——pxtorem 等转换属宿主项目决策
- 主题切换：`<html>` 挂 `dark` class（`applyTheme` 三态：auto/light/dark，localStorage 持久化）
- 自定义品牌色：改 `_variables.scss` 的 `$light-primary-*` / `$dark-primary-*` 两套 10 级色板重新编译，或直接在宿主覆盖 `--dz-primary` 等 CSS 变量
- SCSS 源文件随包输出（`@drizzol/ui/styles`），`@mixin prose` 正文排版、`mobile`/`flex` 等 mixin 可被宿主 `@use`

```scss
@use '@drizzol/ui/styles/_mixin.scss' as *;
// vite 可选：与库一致的 additionalData 全局注入
```

## 版本与发布（changesets）

仓库使用 [changesets](https://github.com/changesets/changesets) 管理语义化版本：

1. 改动后写变更集：`npm run changeset`，选择影响包（`@drizzol/ui`、插件包）与 bump 类型（0.x 阶段：patch=修复/文档，minor=新增能力）
2. 发版前：`npm run version-packages`（自动版本号 + CHANGELOG），提交生成的变更
3. 构建并发布：`npm run release`（`npm run build && changeset publish`）
4. 发布需 npmjs 账号（`npm login`），产物由 `files: ["dist"]` 控制

## 本地开发

```bash
npm install
npm run dev        # playground 演示站（端口 5177，直接消费库源码）
npm run build      # 构建库（es + cjs + d.ts + styles）
npm test           # vitest 单测 + 组件冒烟
```

> Windows 下若配置了本地代理（如 Clash 7890）且未启动，npm 命令需去掉代理环境变量：`env -u HTTPS_PROXY -u HTTP_PROXY npm install`

## 仓库约定

开发规范、维护规则、插件开发流程见 [CLAUDE.md](CLAUDE.md) 与 [docs/PLUGIN.md](docs/PLUGIN.md)。
