---
'@xmdrizzol/drizzol-ui': patch
---

把最低支持浏览器固化为 **Chrome 86**：产物不再出现 `inset` 简写、range 语法媒体查询与 `color-mix()`，旧内核下弹窗/抽屉遮罩、语义底色、移动端适配与视频容器比例恢复正常。

- **构建声明**：`build.cssTarget: 'chrome86'`。真正生效的是这个旋钮——`css.lightningcss.targets` 会被 Vite 压缩路径覆盖（此前产物被按 Vite 默认的 chrome111 目标"现代化"，正是本次问题的根因）。
- **宿主自建构建也要声明同一基线**：宿主打包会把 `dist/style.css` 重新压缩一遍，不声明就会把修复静默抵消（见 README「浏览器兼容性」）。
- **46 处 `color-mix()` 收敛为三元组**：新增 `--dz-{primary,success,warning,danger,gray-7,gray-9,bg}-rgb`（随主题切换）与 `--dz-code-block-text-rgb`、`--dz-scrim-strong-rgb`（恒定），浅底/描边/hover 罩层统一写 `rgba(var(--dz-*-rgb), <alpha>)`。**覆盖语义色时需与 `--dz-<名>` 成对同步**；暗色 `--dz-primary-hover-2` 同时改为静态值。
- **`d-video`**：容器比例加 `padding-top` 兜底（新增导出纯函数 `ratioToPaddingTop`），新增绝对定位的 `.d-video__inner` 挂载层保证旧内核下父盒高度确定。
- **`inset` 简写**（page-hero / skeleton 共 3 处）改为长写属性。
- **防回归**：`npm run build` 末尾新增产物基线校验（`inset` / range 媒体查询 / `color-mix` / scoped `:root` / 缺兜底的 `aspect-ratio` 直接构建失败），`npm test` 新增源码与构建配置扫描。
- 已知限制：`d-video` 依赖的 ArtPlayer 运行时注入样式自带 16 处 `inset:`（第三方代码，不经过本库构建），旧内核下播放器内部浮层（如网页全屏）可能偏位；如需彻底修复可在宿主侧用 patch-package 处理该依赖。
