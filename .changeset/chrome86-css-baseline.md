---
'@xmdrizzol/drizzol-ui': patch
---

把最低支持浏览器固化为 **Chrome 86**：产物不再出现 `inset` 简写、range 语法媒体查询与 `color-mix()`，旧内核下弹窗/抽屉遮罩、语义底色、移动端适配与视频容器比例恢复正常。

- **构建声明**：`build.cssTarget: 'chrome86'`。真正生效的是这个旋钮——`css.lightningcss.targets` 会被 Vite 压缩路径覆盖（此前产物被按 Vite 默认的 chrome111 目标"现代化"，正是本次问题的根因）。
- **宿主自建构建也要声明同一基线**：宿主打包会把 `dist/style.css` 重新压缩一遍，不声明就会把修复静默抵消（见 README「浏览器兼容性」）。
- **46 处 `color-mix()` 收敛为三元组**：新增 `--dz-{primary,success,warning,danger,gray-7,gray-9,bg}-rgb`（随主题切换）与 `--dz-code-block-text-rgb`、`--dz-scrim-strong-rgb`（恒定）。三元组经 `rgb-triplet()` 从同一色板 SCSS 变量派生，改 `$light-*`/`$dark-*` 色板重新编译自动同步；宿主**运行时覆盖**语义色需与 `--dz-<名>` 成对覆盖 `--dz-<名>-rgb`（CSS 变量无法互相派生的固有限制）。暗色 `--dz-primary-hover-2` 同时改为静态值。
- **浅底保持不透明**：消息/通知卡片、按钮朴素底与实心语义变体 hover（原本是 `color-mix(X p%, var(--dz-bg))` 的不透明色）改用新增的 `@include tint-on-bg(--dz-x-rgb, $fill, $line, $shadow)`——不透明底色 + inset 阴影罩层，**不会透出下层内容**（若直接写 `rgba(X, p)`，固定定位的提示卡会变成半透明罩层），合成结果与旧值逐位一致。只有原本就半透明的罩层（tag 底、代码块头部、引用块、骨架屏微光）保留 `rgba(...)`。
- **`d-video`**：容器比例加 `padding-top` 兜底（新增导出纯函数 `ratioToPaddingTop`），新增绝对定位的 `.d-video__inner` 挂载层保证旧内核下父盒高度确定。
- **`inset` 简写**（page-hero / skeleton 共 3 处）改为长写属性。
- **防回归**：`npm run build` 末尾新增产物基线校验（`inset` / range 媒体查询 / `color-mix` / scoped `:root` / 缺兜底的 `aspect-ratio` 直接构建失败），`npm test` 新增源码与构建配置扫描。
- 已知限制：`d-video` 依赖的 ArtPlayer 运行时注入样式自带 16 处 `inset:`（第三方代码，不经过本库构建），旧内核下播放器内部浮层（如网页全屏）可能偏位；如需彻底修复可在宿主侧用 patch-package 处理该依赖。
