---
'@xmdrizzol/drizzol-ui': minor
---

从包根导出 `showUploadNotification` / `UploadNotifyControl`，上传进度通知升级为两行式布局：

- **导出**：`components/upload` 转发 `upload-notify`，包根 `import { showUploadNotification } from '@xmdrizzol/drizzol-ui'` 可用——可独立于 DUpload 使用（自行封装上传逻辑/直传场景）。
- **两行式布局**：行1 状态图标 + 文件名（超长 ellipsis）+ 取消 ✕（右对齐），行2 进度条（8px 圆角）+ 右对齐百分比；容器加宽至 260px。
- **header 隐藏收进库**：修复失效的 `.el-notification__title` 残留选择器，`.d-upload-notify-root` 内直接隐藏通知默认头部，宿主不再需要 CSS hack。
- **行为**：`update()` 收敛 0-100 并取整；`onCancel` 改为可选（不传不出 ✕，纯进度展示）；确认取消文案保留（取消上传 / 继续上传）。
