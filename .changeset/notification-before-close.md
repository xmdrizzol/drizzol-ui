---
'@xmdrizzol/drizzol-ui': minor
---

DNotification 新增 `beforeClose` 关闭前拦截：

- `beforeClose?: () => boolean | Promise<boolean>`——仅头部 ✕ 触发（程序化 `close()` 不经过它，语义与 Element Plus 对话框一致）；返回 `false` 或 Promise reject 阻止关闭，其余放行。
- 典型场景："关闭前先确认"——如上传通知点 ✕ 需弹确认框，确认才真正取消并关闭。
