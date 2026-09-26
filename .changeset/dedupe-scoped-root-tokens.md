---
'@xmdrizzol/drizzol-ui': patch
---

产物去重：`dist/style.css` 从 245KB 降到约 65KB（-73%），剔除的规则此前永不命中。

- **scoped `:root` 令牌块**：vite 的 scss `additionalData` 把 `_animations.scss` 注入每个组件的 `<style>`，它 `@use` 的 `_variables.scss` 带顶层 `:root` / `:root.dark` 输出，于是 36 个组件各自重新输出一份全量令牌，被 vue 的 scoped 变换改写成 `[data-v-*]:root`；`<html>` 永远不会带组件的 data-v 属性，这些规则从不命中（0.6.0 里占 133KB / 54%）。
- **无用的 scoped `@keyframes` 副本**：同一份注入让每个组件都输出全部 13 个关键帧，vue 会按组件改名成 `fadeIn-<scopeId>`，其中未被任何 `animation` 声明引用、且存在同内容全局定义的副本被删除（库与宿主的 JS 都不引用动画名）。
- 新增 `scripts/css-dedupe.mjs`（纯函数 + CLI，含单测），库与 playground 的 build 链各挂一处；`check-css-baseline.mjs` 会断言去重已生效、且被引用的关键帧仍有定义。
