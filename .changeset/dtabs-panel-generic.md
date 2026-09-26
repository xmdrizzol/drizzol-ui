---
'@xmdrizzol/drizzol-ui': minor
---

DTabs 支持无面板模式与泛型 key：

- **`panel` 属性（默认 true，向后兼容）**：`false` 时只渲染标签行、不渲染面板与插槽——切换后由宿主自行拉取数据渲染（排序/筛选页签场景）；`update:modelValue` / `change` 事件、禁用与 tablist/tab 语义不变。
- **`DTabItem<T extends string>` 泛型**：宿主可写 `DTabItem<'latest' | 'hot'>[]` 获得编译期约束；默认 `string` 不破坏现有用法。
- **指示条样式统一**：由近全宽（left/right 12px、圆角 99px）改为 24px 居中短条、圆角 2px、active 0.9375rem/600；`bottom: 0` 与 bar 滚动容器的约束注释保持不变。
