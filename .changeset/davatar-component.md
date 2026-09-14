---
'@xmdrizzol/drizzol-ui': minor
---

新增 `DAvatar` 头像组件（移植自 drizzol-nook 应用层的头像实现）：

- `src` 统一接受完整 URL（http/blob/data）或文件引用，解析规则与 DImage 一致（新增公共工具 `resolveAccessUrl`：带类型前缀的 fileRef 自动拆解、纯存储文件名按类型拼接访问前缀）。
- `shape` 圆形（默认）/方形，`size` 数字按 px 转 rem。
- 图片为空或加载失败时显示 `fallbackText`（如用户名首字），`#fallback` 插槽可完全自定义；src 换回有效地址后自动重试。
- DImage 同步修复：src 变化后重置失败态（此前加载失败后换图不会重试）。
