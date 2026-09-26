---
'@xmdrizzol/drizzol-ui': minor
---

新增 `DProgress` 进度条组件：

- `value` 0-100 自动收敛并取整，宽度变化带过渡动画；`role="progressbar"` + aria 属性齐备。
- `status` 语义色（primary / success / warning / danger）；`text` 显示右侧百分比，`#text` 插槽可自定义文案（如"第 3 / 10 题"）。
- 高度与配色经 `--dz-progress-height` / `--dz-progress-fill` / `--dz-progress-track` 调节，默认样式即 upload-notify 内部同款。
- `showUploadNotification` 正文已改用 DProgress 渲染（行为不变，实现去重）。
