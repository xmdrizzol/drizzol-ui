---
'@xmdrizzol/drizzol-ui': minor
---

新增 `DImage` / `DImageGroup` 图片组件（点击预览大图基于 vue-photo-preview-next）：

- `DImage`：`src` 统一接受完整 URL（http/blob/data）或文件引用（`image/xxx.png` 带类型前缀自动拆解、纯存储文件名按 image 拼接访问前缀）；加载失败显示兜底占位（`fallback-text` 或 `#fallback` 插槽）；`width`/`height`/`radius`/`fit`/`lazy` 常规图片属性齐备。
- 点击预览大图默认开启（`:preview="false"` 关闭），基于 vue-photo-preview-next（MIT，与 DVideo 封装 ArtPlayer、DCropper 封装 cropperjs 同为内部封装的功能库）；`DImageGroup` 分组后预览可左右切换，`mask-closable`/`loop` 等参数透传。
- 运行时新增依赖 `vue-photo-preview-next@^0.0.8`（已列入 vite external）。
