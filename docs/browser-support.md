# 浏览器兼容性：最低 Chrome 86

> 适用范围：`@xmdrizzol/drizzol-ui` 与消费它的宿主项目。
> 关联文档：`CLAUDE.md`（硬性约定与踩坑记录）、`packages/ui/README.md`「浏览器兼容性」（概览）。

## 一、基线与机制

- 最低支持 **Chrome 86**（2020-10 基线，覆盖校内机房、老旧 Chromium 壳、部分国产浏览器兼容模式等部署环境）。
- **构建声明**：库与 playground 的 `vite.config.ts` 均设 `build.cssTarget: 'chrome86'`。Vite 8 的 `cssMinify` 默认 lightningcss，压缩目标取自 `build.target`（默认 `baseline-widely-available`，即 chrome111/edge111/firefox114/safari16.4/ios16.4）——不声明就会把 CSS "现代化"：合并出 `inset`、把经典媒体查询改写成 range 语法。**真正生效的旋钮是 `build.cssTarget`**；`css.lightningcss.targets` 会被压缩路径无条件覆盖（只在 `css.transformer: 'lightningcss'` 的转换路径有效），勿用。
- **双护栏**：`npm test`（`src/__tests__/css-baseline.test.ts`）扫源码与构建配置，pre-commit 即拦；`npm run build` 末尾 `scripts/check-css-baseline.mjs` 扫产物——无 `inset` / range 媒体查询 / `color-mix` / scoped `:root`、`aspect-ratio` 必须带 padding 兜底、去重必须已生效、被 `animation` 引用的关键帧必须有定义，违规直接构建失败。

## 二、修复记录（2026-09-26）

**现象与根因**：0.6.0 产物在 Chrome 86 下弹窗/抽屉错位、语义底色消失、移动端适配失效。两类原因：① 产物问题来自构建——库未声明目标浏览器，压缩器按默认 chrome111 目标把干净的源码 "现代化"（`inset` 合并 ×6、range 媒体查询改写 ×11）；② 源码引入 `color-mix()` ×46（Chrome 111+），其中 44 处引用 `var(--dz-*)`/`currentColor`，任何构建工具都算不出等价静态色，无法靠构建降级。

**解决分四层**：

1. **构建声明**：`packages/ui/vite.config.ts` 与 `playground/vite.config.ts` 增 `build.cssTarget: 'chrome86'`（附注释说明为何不是 `css.lightningcss.targets`）。
2. **源码回退**：
   - `_variables.scss`：新增 `--dz-{primary,success,warning,danger,gray-7,gray-9,bg}-rgb` 逗号三元组（亮/暗各一份，经 `rgb-triplet()` 从同一色板变量派生——SCSS 改色板重编译自动同步；宿主运行时覆盖 CSS 变量仍需成对）+ `--dz-code-block-text-rgb`、`--dz-scrim-strong-rgb`（恒定）；暗色 `--dz-primary-hover-2` 由 `color-mix(...)` 改为 `rgba(var(--dz-primary-rgb), 0.18)`。
   - 46 处 `color-mix()` 全部改写（tag / button 用组件内局部变量 `--dz-tag-rgb`、`--dz-tag-close-rgb`、`--dz-btn-rgb` 按变体取值）。其中**原本不透明**的那些（消息/通知卡片底与描边、按钮朴素底与描边、实心语义变体 hover 底与描边）改写成 `@include tint-on-bg()`——不透明底色 + inset 阴影罩层（罩层在内容之下、描边压在同一层不透明底上），因为 `color-mix(X p%, var(--dz-bg))` 的结果是**不透明**色：若直接写成 `background: rgba(X, p)`，卡片就变成半透明罩层，消息/通知这种 `position: fixed` 浮层会透出下层内容（修复过程中自查发现并纠正的一处偏差，已在测试加断言防回退）。**原本就半透明**的（tag 底与描边、代码块头部与复制按钮、引用块、骨架屏微光、page-hero 遮罩、暗色 `--dz-primary-hover-2`）保留 `rgba(...)` 写法。`float-bar` 的 hover 改成 "12% 白罩层 + 自身底色" 两层背景（最后一层是不透明底色）。
   - `page-hero` / `skeleton` 的 3 处 `inset:` → `@include absolute(0,0,0,0)`。
   - `d-video`：容器加 `.d-video__inner` 绝对定位挂载层 + `::before` 的 `padding-top` 兜底（由新增纯函数 `ratioToPaddingTop` 从 `ratio` 解析），现代内核仍走 `aspect-ratio`，两者高度数学等价。
3. **护栏**：新增 `packages/ui/scripts/check-css-baseline.mjs`（build 链末尾断言产物）与 `packages/ui/src/__tests__/css-baseline.test.ts`（pre-commit 扫源码与构建配置，另含浅底必须走 `tint-on-bg` 的不透明断言）。
4. **产物瘦身**：新增 `packages/ui/scripts/css-dedupe.mjs`（库与 playground build 链各挂一处）。实测 263,441 → 66,431 字节（0.6.0 发版产物为 245,594 字节）：剔除 scoped `:root` 72 条（36 个组件各一份 `[data-v-*]:root` 与 `:root.dark[data-v-*]`，`<html>` 永远不带组件 data-v 属性）与无用 `@keyframes` 副本 467 段（vue 会把注入的关键帧按组件重命名成 `fadeIn-<scopeId>`，其中绝大多数从未被 `animation` 引用）。根因是 scss `additionalData` 注入链把令牌与关键帧带进了每个组件，业界正解是修源码结构，去重是止血（已记入 CLAUDE.md 踩坑记录）。

**实测验收**（`packages/ui/dist/style.css`）：

```bash
grep -c "inset:0" dist/style.css            # 0
grep -oE "@media[^{]*width *[<>]=" dist/style.css   # 无输出
grep -c "color-mix(" dist/style.css         # 0
grep -c "aspect-ratio" dist/style.css       # 1（带 padding 兜底）
grep -ao "@keyframes" dist/style.css | wc -l # 22（13 全局 + 9 组件内在用，无重复副本）
```

**等价性与待复核事项**：替换后的颜色与旧 `color-mix` 值逐条按 premultiplied sRGB 比对，107/108 完全一致（唯一偏差：`page-hero` 标题阴影暗色 0.375 → 0.35，源码注释已记录，视觉不可辨）；红横幅实测卡片不透底（偏差 0）；视频容器 640×360 = 16:9。**真机 Chrome 86 的弹窗开合/遮罩铺满、语义底色可见、窄屏根字号 14px 与栅格断点三项待宿主复核**（本机无 86 内核，以上产物断言与几何/色彩核对为客观代理）。

## 三、宿主侧清单（升级到修复版后必做）

1. **宿主自建构建必须声明同一基线**，否则宿主打包会把 `dist/style.css` 重新压缩回现代语法，修复被静默抵消：

   ```ts
   // 宿主 vite.config.ts
   export default defineConfig({
     build: { cssTarget: 'chrome86' }, // 与库一致；css.lightningcss.targets 无效
   })
   ```

2. **宿主自己的同类写法也要处理**：`color-mix()` 只能用 `rgba()` 静态值替代（可参考本库的 `--dz-*-rgb` 三元组写法）；`aspect-ratio` 建议配 padding 兜底——本库已导出纯函数 `ratioToPaddingTop('16 / 9') → '56.25%'`，可直接复用。宿主自己的样式开发参照下文「四、开发写法规范」执行：

   ```vue
   <div class="video" :style="{ '--ratio-pad': ratioToPaddingTop(ratio) ?? '' }">…</div>
   ```

3. **改语义色时**：`--dz-<名>` 与 `--dz-<名>-rgb` 成对覆盖（例如覆盖 `--dz-primary` 时同时给 `--dz-primary-rgb: r, g, b`），否则浅底/描边仍是旧色。
4. `d-video` 的第三方 ArtPlayer 注入样式自带 16 处 `inset:`（不经过本库构建），旧内核下播放器内部浮层（如网页全屏）可能偏位；如需彻底修复，宿主可用 patch-package 处理该依赖的 CSS（本库不硬编码第三方内部类名）。

## 四、开发写法规范（新增/修改样式必读）

> 操作性速查：按顺序套下面的模板即可，不需要记住禁写清单的全部 rationale。护栏会兜底——`npm test` 扫源码与构建配置（pre-commit 即拦），`npm run build` 末尾扫产物；违规直接红灯，报错信息带替代写法。机制与修复记录见上文各节。

### 决策顺序：四个日常模板

**1. 引颜色** —— 一律 `--dz-*` 变量，深浅主题自动跟随，禁止写死色值：

```scss
color: var(--dz-text);
background: var(--dz-bg-secondary);
border: 1px solid var(--dz-border);
```

**2. 半透明罩层** —— 仅限**本该透出内容**的装饰（标签浅底、遮罩、微光、代码块头部、引用块）：

```scss
background: rgba(var(--dz-primary-rgb), 0.12);
```

被引用的颜色必须已有 `-rgb` 三元组（现有 primary / success / warning / danger / gray-7 / gray-9 / bg / code-block-text / scrim-strong；新增见下文「颜色维护」）。

**3. 不透明语义浅底 / 卡片底** —— 消息、通知、按钮这类**下面必须是实心的**面，用 mixin，不要写 `background: rgba(...)`（半透明会让卡片透出下层内容）：

```scss
// $fill 内部罩层强度、$line 描边强度（省略则不动描边）、$shadow 要保留的外阴影
@include tint-on-bg(--dz-success-rgb, 0.1, 0.4, var(--dz-shadow-sm));
```

判断标准：这层颜色下面必须是实心的 → 模板 3；本来就该透出内容 → 模板 2。

**4. 铺满定位与响应式**：

```scss
@include absolute(0, 0, 0, 0); // 铺满父级；禁止 inset: 0
@include fixed(0, 0, 0, 0);
@include mobile { … }          // 经典 max-width；禁止 (width <= 768px) range 语法
```

### 禁写清单（护栏会拦，报错带修复方向）

| 禁写 | 替代 |
| --- | --- |
| `color-mix()` | 罩层 `rgba(var(--dz-*-rgb), α)`；不透明浅底 `tint-on-bg` |
| `inset` 简写、逻辑属性（`margin-inline` 等） | `@include absolute()/fixed()`、物理方向属性 |
| range 媒体查询 `(width <= …)` | `@include mobile` / 经典 `min-width` |
| `:is()` / `:where()` / `:has()` | 展开选择器；父级状态用 Vue 响应式 class 绑定 |
| `dvh/svh/lvh`、独立 `translate/rotate/scale` 属性 | `vh/vw`、`transform` |
| 裸写 `aspect-ratio` | 参考 `d-video`：`aspect-ratio` + `::before` padding 兜底（`ratioToPaddingTop` 已导出可复用） |

### 颜色维护

- **SCSS 色板重编译**（改 `$light-*` / `$dark-*`）：`--dz-*-rgb` 经 `rgb-triplet()` 同源派生，重新编译自动同步，无需手改。
- **运行时覆盖 CSS 变量**：必须成对覆盖 `--dz-<名>` 与 `--dz-<名>-rgb`（如 `--dz-success: #7c3aed;` + `--dz-success-rgb: 124, 58, 237;`）——CSS 变量无法互相派生（Bootstrap/Tailwind 三元组同款要求）；只改颜色不改三元组，浅底/描边会停在旧色。
- **组件内派生变量成对翻转**：仿照 `d-button` 加类型色变量时，`--dz-btn-color` 与 `--dz-btn-rgb` 各变体一起写。
- 与既有约定叠加：SCSS 写 px（postcss-pxtorem 自动换算，1px 保留）；JS 生成的尺寸走 `pxToRem()`。

### 容差与已知限制

- 可保留（丢了只少一层装饰，不写兜底）：`text-underline-offset`、`scrollbar-width` 等。
- 第三方：ArtPlayer 运行时注入样式含 16 处 `inset:`（不经过本库构建），旧内核下播放器内部浮层（网页全屏等）可能偏位；宿主如需彻底修复可用 patch-package。
- 基线上调时的退出路径：`build.cssTarget` 改高 → 禁写清单删对应条目 → （可选）`rgba()` 罩层渐进迁回 `color-mix()`。约束是租金不是房贷，无沉淀技术债。
