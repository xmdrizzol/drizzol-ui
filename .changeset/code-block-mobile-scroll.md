---
'@xmdrizzol/drizzol-ui': patch
---

修复代码块在窄屏横向滚动时的显示错误：

- `pre > code`（全局排版与 prose 排版同步修改）宽度改为 `max-content` + `min-width: 100%`：长行把深色代码盒一起撑宽，横向滚动时背景/边框始终包住文本（此前 `white-space: pre` 的长行会溢出到深色盒子外，滚动后文字悬在盒外）。
- DCodeBlock：`__body` 的横向内边距移到内部 `code`（宽度跟随内容），长代码滚到最右仍保留右侧留白（滚动容器自身的右内边距在滚尽时会被吃掉）。
