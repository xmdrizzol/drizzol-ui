# CLAUDE.md

本文件是 drizzol-ui 仓库的开发约定与维护规则，供 AI 协作与贡献者参考。

## 项目结构

- `packages/ui/` — `@xmdrizzol/drizzol-ui` 核心库（组件 + 工具 + 样式 + 类型），唯一发布包
- `playground/` — 演示站（npm workspace，`vite` alias 直接消费库源码）
- `docs/PLUGIN.md` — 插件包开发规范
- `.changeset/` — changesets 版本管理

## 常用命令

- `npm run dev` — 启动 playground（端口 5177，改库源码即时生效）
- `npm run build` — 构建库：`vite build`（es+cjs）→ `vue-tsc --emitDeclarationOnly`（dist/types）→ `scripts/copy-styles.mjs`（dist/styles）
- `npm test` — vitest（单测 + 冒烟）
- `npm run typecheck` — playground 类型检查
- `npm run changeset` / `npm run version-packages` — 版本变更集 / 应用版本
- git 提交经 husky 校验：pre-commit 跑 typecheck + test，commit-msg 跑 commitlint（Conventional Commits）

## 硬性约定

- **命名**：组件 `D` 前缀（PascalCase，模板 kebab-case `d-button`）；目录 kebab-case 三件套（`index.vue` + `index.ts` barrel）；CSS 类 `d-*`、BEM 式；CSS 变量一律 `--dz-*`，**禁止写死色值**（深浅主题靠变量）
- **颜色/主题**：`_variables.scss` 的 `:root` / `:root.dark` 双色板是唯一色值来源；新组件配色只用 `var(--dz-*)`
- **组件导出**：每组件 `index.ts` 用 `withInstall(Comp, 'DComp')` 导出具名 + default，并由库入口 `src/index.ts` 登记进 `components` 数组（全量安装）与 `export *`（具名导入）；图标组件例外（`DIcon` + `DIconSprite`）
- **样式注入**：`vite.config.ts`（库+playground）的 scss `additionalData` 全局注入 `_mixin.scss`/`_animations.scss`，**库内组件不得自行 `@use '@/styles/mixin'` 重复引入**（保留 `_variables` 的 `@use` 亦可，但注意别形成循环）
- **px→rem**：库与 playground 构建均挂 `postcss-pxtorem`（`rootValue: 16`、`minPixelValue: 2`），**SCSS 源码写 px、构建自动换算 rem**；组件内 `:style` 等 JS 生成的尺寸走 `src/utils/pxToRem`（`1rem = 16px`）。1px 细边框因 `minPixelValue` 保持 px，**勿手写 rem 视觉不准**；受此影响 `var(--dz-*, px)` 的 px 兜底不会被插件换算，默认尺寸可写 px 让其转换
- **依赖**：`vue` 为 peer（宿主安装，vue-router 可选）；axios/js-cookie/cropperjs/artplayer 为运行时依赖并列入 vite `external`；**不依赖任何第三方 UI 库**（提示/通知/确认/抽屉为自研四件套（DMessage/DNotification/DConfirm/DDrawer，命令式组件同走 D 前缀））
- **许可合规**：内置图标一律取自 **Lucide（ISC）**，经 Iconify API 拉取 SVG 后并入 `icon/symbols.vue`；**禁止**从 iconfont.cn 等用户上传平台下载内联（再分发授权不可确认），**禁止**内置第三方品牌 logo（github/discord/qq 等商标）。运行时依赖（axios/js-cookie/cropperjs/artplayer）全部 MIT；**勿引入非宽松许可的依赖**（gsap 曾因 No-Charge 许可被移除）
- **工具函数**：库构建后 `import.meta.env` 不复存在——request 的 baseURL、file 前缀等一律运行时配置（`configureRequest`/`configureFileAccessPrefix`）
- **语言**：注释、回复、文档一律中文（JSDoc 风格）；命令、路径、标识符保留原文
- **测试**：新增/修改组件必须同步冒烟测试（`src/__tests__/components.smoke.test.ts`）；纯函数改动补单测

## 维护规则

- 通用组件/工具/样式**只在本库维护**；宿主项目只消费发版产物
- 宿主发现缺陷：改库 → 补测试 → `npm run changeset` → 发版 → 宿主升级；不得绕过库直接改宿主内的拷贝
- 0.x 阶段版本：patch=修复，minor=新增能力/新组件，破坏性变更限期 deprecation 后升 major
- 新组件发布前必须：README 组件清单登记 + 冒烟测试 + `--dz-*` 变量核查（grep `--primary` 等裸变量为零）
- 插件包对 `@xmdrizzol/drizzol-ui` 使用同主版本 peer 段；插件不修改核心包源码

## 踩坑记录

- **is-hotkey 不要用**：vite dev 预打包把 CJS default 解析成 exports 对象，运行时抛 TypeError（仅 dev 崩）。快捷键匹配需自写纯函数
- **v-html 注入内容无 scope 属性**：富文本等 v-html 注入内容的排版样式必须非 scoped 或 `:deep`
- **`@use` 循环风险**：`additionalData` 注入的 mixin/animations 文件名与组件内 `@use` 的路径一致；库内新增 scss 文件时勿与注入项同名
- **gsap 已移除（教训保留）**：被打断的 gsap tween 中间值会污染下段动画（DDropdown 连点下坠），且其 No-Charge 许可禁止再分发进产物。组件动画一律用 Vue `<Transition>` + CSS 过渡实现，不要再引入 gsap
- **后台渲染冻结 rAF 时勿以 DOM 判断开闭**：rAF 冻结后 Vue Transition/gsap 停摆，`display` 永远不落地，DOM 读数全是假象；应读 Vue 组件响应式状态（沿 `#app.__vue_app__._instance` 组件树找 setupState）或用 mock 回调的单测
