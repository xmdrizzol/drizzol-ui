---
'@xmdrizzol/drizzol-ui': minor
---

布局系统增强与修复：

- **修复高宽属性失效**：`height="48"` 这类纯属性（字符串）此前输出无单位、非法的 `height: 48` 被浏览器丢弃，现统一经 `pxToRem` 转成 rem（`48 → 3rem`），并支持 `rem/%/auto/px` 等带单位值原样透传。
- **尺寸改用 rem**：JS 内联尺寸走 `pxToRem`（1rem = 16px）；SCSS 源码写 px，构建时经 `postcss-pxtorem` 自动换算（`minPixelValue: 2` 保留 1px 细边框）。
- **`fixed` 悬浮**：DHeader / DFooter / DAside 新增 `fixed` 属性（sticky 吸顶/吸底）；DMain 去掉默认 `overflow: auto`，使外层/页面可滚动，sticky 真正生效。
- **修复 DAside `fixed` 不生效**：侧栏作为 flex 项被默认拉伸到与布局容器等高，sticky 没有可位移空间（等同 static）；`fixed` 时改为 `align-self: flex-start`，自身收缩为内容高度后正常吸附。上方存在吸顶头部时用 `--dz-aside-sticky-top` 让出头部高度（如 `48px`），默认 `0`。
- 补齐基础样式与边距，移动端默认收窄；修正 DLayout 方向推断（改为渲染期检测插槽是否含 DAside，嵌套布局不再丢失 row/column）。
