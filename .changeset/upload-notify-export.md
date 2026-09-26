---
'@xmdrizzol/drizzol-ui': minor
---

从包根导出 `showUploadNotification` / `UploadNotifyControl`，上传进度通知样式统一：

- **导出**：`components/upload` 转发 `upload-notify`，包根 `import { showUploadNotification } from '@xmdrizzol/drizzol-ui'` 可用——可独立于 DUpload 使用（自行封装上传逻辑/直传场景）。
- **布局沿用通知默认头部**：标题行显示文件名（类型图标由 DNotification 提供），正文只放进度条 + 百分比；容器加宽至 260px，等宽数字防百分比抖动。
- **取消 ✕ 在标题行右侧**（标准位置）：传入 `onCancel` 时经 DNotification 的 `beforeClose` 先弹确认框（取消上传 / 继续上传），确认才触发 `onCancel` 并关闭；不传 `onCancel` 则 ✕ 直接关闭（纯进度展示）。
- **移除失效隐藏规则**：清理误写的 `.el-notification__title` 残留选择器（从未生效过）。
- **行为**：`update()` 收敛 0-100 并取整。
