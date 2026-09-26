---
'@xmdrizzol/drizzol-ui': minor
---

新增 `DLoadingBar` 页面顶部加载进度条（nprogress 式命令式服务）：

- `DLoadingBar.start()` 开始后自动缓慢自增（封顶 90%，剩余留给收尾冲刺）；`done()` 冲刺到 100% 后淡出隐藏；`set(n)` 手动指定进度。
- **最短展示时长**（`start({ minDuration })`，默认 400ms）：SPA 路由经常瞬间完成，done 早于此时长会延迟到凑满再淡出，保证肉眼可见。
- 全局单例：重复 `start` 不叠加；未 `start` 直接 `done` 安全收尾；淡出途中 `start` 会重置重新开始。
- 外观默认 `--dz-primary` 填充、2px 高，经 `start({ height, color })` 可调；`z-index` 高于弹窗与通知。
- 常配路由切换：`beforeEach` 里 `start()`、`afterEach`/`onError` 里 `done()`（演示站自身即此用法）。
