# 浏览器兼容性需求：最低支持 Chrome 86

> 提出方：宿舍/校园论坛前端（`campus-forum`，Vue 3 + drizzol-ui 的宿主项目）
> 提出时间：2026-09-26
> 当前库版本：`@xmdrizzol/drizzol-ui` 0.6.0（`packages/ui/dist/style.css` 与发版产物同源）
> 关联模板：`.github/ISSUE_TEMPLATE/bug_report.md`（本文件按该模板的信息结构组织）

## 一、需求

把库的**最低支持浏览器定为 Chrome 86**（2020-10 基线，校内机房、老旧 Chromium 壳、部分定制浏览器仍在使用），并把它落成库的硬性约定：

> **构建产物不得引入高于基线的 CSS 语法**；源码里不可避免的现代语法（如 `color-mix()`）必须在产物中带有等价回退。

理由：宿主项目的实际部署环境包含该版本浏览器，目前弹窗不可用、多个组件底色丢失，属于"页面能用但功能不可用"级别的问题。

## 二、环境

- `@xmdrizzol/drizzol-ui`：**0.6.0**
- 构建链：Vite **8.0.x**（`cssMinify` 默认 `lightningcss`）+ sass + `postcss-pxtorem`
- 宿主项目：Vue 3.5 + drizzol-ui，Vite 8，同样挂 `postcss-pxtorem`（`rootValue: 16`、`minPixelValue: 2`）
- 复现浏览器：**Chrome 86.0.4240.198**（Windows 10）

## 三、现象

在该浏览器下打开宿主项目的任一页面：

1. **弹窗/抽屉完全不可用**：遮罩不铺满视口，对话框塌到页面底部静态位置，关闭按钮点不到（`.d-modal`、`.d-drawer`、`.d-drawer__mask`）；
2. **部分背景不显示**：`d-tag` 各语义变体、`d-message`、`d-notification`、`d-button` 的语义/plain 变体、`d-code-block` 头部与复制按钮、`d-float-bar` 悬浮项 hover、`d-skeleton` 的微光层都失去底色（只剩文字）；
3. **移动端适配失效**：根字号不缩放（`html` 仍是 16px，本应 14px），`d-col` 栅格断点、`d-aside`/`d-header` 的移动端尺寸整条不生效；
4. **`d-video` 容器比例失效**：视频容器不再保持传入的 `ratio`（如 16:9）。

## 四、根因（源码定位 + 产物证据）

三条问题分两类：**两条是构建压缩器"优化"出来的（源码本身是干净的）**，一条来自源码。

### 4.1 `inset: 0`（Chrome 87+）—— 压缩器合并产出

- **源码**：`packages/ui/src/styles/_mixin.scss:61` 的 `absolute()`、`:79` 的 `fixed()` 写的是四个长写属性：

  ```scss
  @mixin fixed($top: null, $right: null, $bottom: null, $left: null) {
      position: fixed;
      top: $top; right: $right; bottom: $bottom; left: $left;
  }
  ```

  组件里的用法（`components/skeleton/index.vue:89`、`components/page-hero/index.vue:60/66`）也是长写。
- **产物**：`dist/style.css` 里变成 `inset:0`，共 **6 处**：

  ```css
  .d-modal[data-v-…]{z-index:2000;background:var(--dz-mask);position:fixed;inset:0}
  .d-drawer[data-v-…]{z-index:2000;position:fixed;inset:0}
  .d-drawer__mask[data-v-…]{background:var(--dz-mask);position:absolute;inset:0}
  .d-skeleton__row[data-v-…]:after{…;position:absolute;inset:0}
  .d-page-hero__cover[data-v-…]{position:absolute;inset:0}
  .d-page-hero__scrim[data-v-…]{z-index:1;background:var(--dz-hero-scrim);position:absolute;inset:0}
  ```

- **为什么是致命的**：`inset` 在 Chrome 86 里是**未知属性，整条声明被丢弃**（不是回退到 0），于是这些元素只剩 `position: fixed/absolute` 而没有偏移量 → 收缩成内容尺寸、停在静态位置。`.d-modal` 的遮罩与容器因此完全错位，弹窗事实上不可用。

### 4.2 range 语法媒体查询（Chrome 104+）—— 压缩器改写产出

- **源码**一律是经典语法：`styles/_mixin.scss:32` 的 `@mixin mobile { @media screen and (max-width: 768px) }`，使用者包括 `styles/_global.scss:4-13`（移动端根字号 `font-size: 14px !important`）、`components/layout/header.vue:50`、`components/layout/aside.vue:51`、`components/grid/col.vue:100`（`@media (min-width: #{$bp})`）。
- **产物**被改写成 range 语法，共 **11 处（5 类模式）**：

  ```css
  @media screen and (width<=768px){html{font-size:.875rem!important}}
  @media screen and (width<=768px){.d-header[data-v-…]{height:3rem;padding:0 1rem}}
  @media screen and (width<=768px){.d-aside[data-v-…]{width:12.5rem}}
  @media (width>=768px){.d-col--sm-*{…}}
  @media (width>=992px|1200px|1600px){.d-col--md/lg/xl-*{…}}
  ```

- **后果**：整条媒体查询在 Chrome 86 里无效（选择器解析失败）→ 移动端根字号不缩放、栅格断点与布局组件的移动端样式全部失效。

### 4.3 `color-mix()`（Chrome 111+）—— 源码引入

源码共 **46 处**，逐文件：

| 文件 | 处数 | 主要用途 |
|---|---|---|
| `components/tag/index.vue` | 11 | 各语义变体的浅色底、关闭按钮 hover |
| `components/button/index.vue` | 11 | success/warning/danger/info 变体与 `is-plain`/`is-link` |
| `components/message/Message.vue` | 9 | 四态提示底色 |
| `components/notification/Notification.vue` | 6 | 四态通知底色 |
| `components/code-block/index.vue` | 4 | 头部条、复制按钮与 hover |
| `components/float-bar/index.vue` | 1 | 悬浮项 hover 底色 |
| `components/skeleton/index.vue` | 1 | 微光渐变 |
| `components/page-hero/index.vue` | 1 | 标题遮罩层 |
| `styles/_variables.scss` | 1 | 暗色主题 `--dz-primary-hover-2` |
| `styles/_typography.scss` / `styles/_prose.scss` | 各 1 | 引用块底色 |

产物里因全局样式按组件分块重复注入，`color-mix(` 出现 **81 处**。Chrome 86 里 `color-mix()` 是非法值 → 整条 `background` 声明被丢弃（不是回退到某个近似色），这正是"部分背景不显示"的直接原因；`.d-tag--primary` 这类变体连底色带边框色一起丢。

暗色令牌可对照 `styles/_variables.scss:257`（浅色：`--dz-primary-hover-2: var(--dz-primary-1)`）与 `:335`（深色：`color-mix(...)`）——浅色下没问题，深色下该令牌在旧浏览器里整个失效，而它被多处"主色浅底"复用。

### 4.4 `aspect-ratio`（Chrome 88+）—— 源码引入

`components/video/index.vue:117` 用 `aspect-ratio: v-bind('props.ratio')` 控制视频容器比例，产物中同样保留（**1 处**）。Chrome 86 下声明被丢弃 → 视频容器比例失效（`DVideo` 的 16:9 等比例约束不生效）。宿主项目里同类写法也需要回退。

### 4.5 机制：库构建未声明目标浏览器

- 库 `packages/ui/vite.config.ts` 只配了 `postcss-pxtorem` 与 lib 打包，**没有声明任何浏览器目标**（无 `build.target` / `build.cssTarget` / `css.lightningcss.targets`，也没有 browserslist）。
- Vite 8 的 `cssMinify` **默认就是 `lightningcss`**（Vite 自身类型定义中注明"`cssMinify` is `lightningcss` (the default)"），而 lightningcss 在**没有 targets 时按"面向现代浏览器"优化**：把四个长写属性合并成 `inset`、把经典媒体查询改写成 range 语法、并按现代浏览器输出 `color-mix()`。
- 因此 4.1 与 4.2 是**压缩器"优化"出来的回归**（库源码干净），4.3、4.4 是**源码遗留**（但 4.3 同样可以通过给压缩器 targets 自动降级；4.4 需要在源码里补回退）。

一句话：**产物问题集中在"库构建没有声明目标浏览器"这一处配置上。**

## 五、复现步骤

1. 装 `@xmdrizzol/drizzol-ui@0.6.0`，用 Chrome 86 打开 playground（`npm run dev`，5177）；
2. 打开 DModal / DDrawer 示例 → 遮罩不铺满、对话框位置异常；
3. 打开 DTag / DMessage / DNotification 示例 → 可见底色缺失；打开 DVideo 示例 → 容器比例失效；
4. 或用命令行核对产物（无需浏览器）：

```bash
cd packages/ui
grep -c "inset:0" dist/style.css                     # 期望 0，当前 6
grep -oE "@media[^{]*width *[<>]=" dist/style.css    # 期望无输出，当前 11 处
grep -c "color-mix(" dist/style.css                  # 期望 0 或全部带 @supports 回退，当前 81
grep -c "aspect-ratio" dist/style.css                # 期望 0（或带回退），当前 1
```

## 六、期望行为

- 产物中不再出现 `inset:` 与 range 语法媒体查询；
- `color-mix()` 要么被降级为 `rgba()` + `@supports` 回退，要么在 targets 下保留（仅当目标支持）；
- Chrome 86 下：弹窗/抽屉能正常开合、遮罩铺满视口；各组件的语义底色可见；移动端根字号与栅格断点生效。

## 七、建议（按优先级）

### 1. 给库构建声明目标浏览器（首选，一条配置覆盖全部三条）

保留 lightningcss 压缩器并明确 targets（在库 `vite.config.ts`）：

```ts
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

export default defineConfig({
  css: {
    lightningcss: {
      targets: browserslistToTargets(browserslist('chrome >= 86')),
    },
  },
  build: {
    cssMinify: 'lightningcss',   // Vite 8 默认已是它，显式写出以免将来默认值变化
    // 若改用 esbuild 压缩器，则必须同时设 build.cssTarget，否则同样会按现代浏览器优化，
    // 且 esbuild 无法降级 color-mix —— 所以推荐维持 lightningcss
  },
})
```

预期效果：不再合并出 `inset`、不再改写媒体查询。

> **修正（修复时实读 Vite 8.2.2 源码）**：上面的写法**不生效**——`vite/dist/node/chunks/node.js` 的 CSS 压缩路径先展开 `...config.css.lightningcss`，紧接着用 `targets: convertTargets(config.build.cssTarget)` 无条件覆盖 `targets`；`css.lightningcss.targets` 只在 `css.transformer: 'lightningcss'`（默认是 `postcss`）的转换路径才起作用。**真正生效的旋钮是 `build.cssTarget`（esbuild 风格字符串，如 `'chrome86'`）**。另两点实测修正：① 产物问题的直接诱因是 Vite 8 默认 `build.target = 'baseline-widely-available'`（chrome111/edge111/firefox114/safari16.4/ios16.4），压缩器按这个目标"现代化"了本来干净的源码；② **`color-mix()` 无法靠压缩器降级**——46 处里 44 处引用 `var(--dz-*)`/`currentColor`，任何构建工具都算不出等价静态色，所以必须动源码（已按 七.2 的思路收敛为 `--dz-*-rgb` 三元组 + `rgba()`）。

### 2. 源码侧 color-mix 令牌化（可选，不依赖构建）

若不希望把兼容性寄托在构建降级上，可把语义底色收敛成令牌，源码自带回退，语义也更显式：

```scss
/* _variables.scss：:root 与 :root.dark 各给一份静态值 */
--dz-tag-primary-bg: rgb(64 112 255 / 12%);
// 组件里只用令牌
background: var(--dz-tag-primary-bg);
```

宿主的既有做法可参考：宿主只用 `--dz-primary-1` 这类浅色令牌表达"主色浅底"，不写 `color-mix`。至少建议给**暗色主题的 `--dz-primary-hover-2`** 一个静态回退值（它在深色下是 `color-mix(in srgb, var(--dz-primary-6) 18%, transparent)`，是全库唯一被多个组件依赖的 color-mix 令牌）。

### 3. 把基线写进约定并加产物检查

- `README.md` / `CLAUDE.md` 增补一条硬性约定：**最低支持 Chrome 86**，新增样式不得直接使用高于该基线的语法（`inset`、range 语法媒体查询、`color-mix()`、`:is()/:where()/:has()`、`aspect-ratio`、`translate/rotate/scale` 独立属性等）；库内已有的 `d-video` 的 `aspect-ratio` 属于存量待处理项（见 4.4）；
- CI 增加产物断言（grep 上节三条命令），把"构建又引入现代语法"变成红灯而不是上线后才发现。

## 八、影响面

- 凡是在旧内核浏览器（校内机房、老旧 Chromium 壳、部分国产浏览器兼容模式）访问的宿主项目，**弹窗/抽屉类交互完全不可用**，标签/提示/通知等视觉降级，移动端适配失效；
- 宿主无法在不违反库维护规则的前提下解决：按 `CLAUDE.md`「宿主发现缺陷：改库 → 补测试 → `npm run changeset` → 发版 → 宿主升级；**不得绕过库直接改宿主**」，本次不引入宿主侧兜底样式（否则等于在每个宿主里重复覆盖 `inset`/`color-mix`，并把库的构建缺陷长期固化下来）。

## 九、验收清单（附修复后实测）

- [x] `grep -c "inset:0" packages/ui/dist/style.css` → `0`（实测 0）
- [x] `grep -oE "@media[^{]*width *[<>]=" packages/ui/dist/style.css` → 无输出（实测 0）
- [x] `color-mix(` 在产物中为 0（实测 0：46 处源码全部改为 `rgba(var(--dz-*-rgb), <alpha>)`）
- [x] `aspect-ratio` 带回退（产物 1 处，同规则组内 `.d-video::before{padding-top:var(--v…)}` 兜底，`check-css-baseline.mjs` 断言）
- [ ] Chrome 86：DModal / DDrawer 开合正常、遮罩铺满；DTag / DMessage / DNotification / DButton 变体底色可见；`d-skeleton` 微光可见 —— **待宿主在真机 Chrome 86 复核**（本机无 86 内核；产物侧已断言无 `inset`/`color-mix`，源码侧已无超基线语法）
- [ ] Chrome 86：DVideo 容器比例正确（16:9 等）—— 比例修复已就位（`aspect-ratio` + `padding-top` 兜底），**真机待复核**
- [ ] Chrome 86 窄屏：`html` 根字号为 14px，`d-col` 栅格按断点生效 —— 产物中 `@media screen and (max-width:768px){html{font-size:.875rem!important}` 与 `@media (min-width:768px){.d-col--sm-*}` 已确认保留为经典语法，**真机待复核**
- [x] 现代浏览器无回归：色彩等价性用 `color-mix` 与替换值的逐条数值核对（premultiplied sRGB，阈值 1/255）——107/108 条完全一致，唯一偏差是 `page-hero` 标题阴影在暗色下 0.375 → 0.35（源码注释已记录，视觉不可辨）；视频容器几何实测 640×360（比例 0.5625 = 16:9，`::before` padding-top 360px）与 ArtPlayer 渲染正常
- [x] 不透明性实测：在消息卡片正后方铺一条纯红横幅（`#ff0033`），暗色下卡片内部像素实测 `(34,39,55)` vs 旧 `color-mix` 期望 `(33,40,56)`（横幅控制点确认为纯红），浅色下内部合成 `(236,244,255)`、hover 按钮底 `(108,205,60)`，与旧值偏差均为 0；卡片 `background-color` alpha = 1 且无 `opacity`/`filter`/`mix-blend-mode` → 确认不透底（截图目视一致）
- [x] 随修复补 `.changeset`（0.x 阶段 patch = 修复）与防回归断言（落在 `src/__tests__/css-baseline.test.ts` + 构建期 `scripts/check-css-baseline.mjs`，比塞进 `components.smoke.test.ts` 更合适：产物级断言不能在 pre-commit 跑——`dist/` 是 gitignore 的旧产物，容易测出假绿）
- [x] 额外收益（本次一并处理）：产物从 245KB 降到约 64.5KB —— 剔除 36 份永不命中的 scoped `:root` 令牌块与 467 段无用 scoped `@keyframes` 副本（详见 十一）

## 十、宿主侧清单（升级到修复版后必做）

1. **宿主自建构建必须声明同一基线**，否则宿主打包会把 `dist/style.css` 重新压缩回现代语法，修复被静默抵消：

   ```ts
   // 宿主 vite.config.ts
   export default defineConfig({
     build: { cssTarget: 'chrome86' }, // 与库一致；css.lightningcss.targets 无效
   })
   ```

2. **宿主自己的同类写法也要处理**：`color-mix()` 只能用 `rgba()` 静态值替代（可参考本库的 `--dz-*-rgb` 三元组写法）；`aspect-ratio` 建议配 padding 兜底——本库已导出纯函数 `ratioToPaddingTop('16 / 9') → '56.25%'`，可直接复用。宿主自己的样式开发参照下文「十二、开发写法规范」执行：

   ```vue
   <div class="video" :style="{ '--ratio-pad': ratioToPaddingTop(ratio) ?? '' }">…</div>
   ```

3. **改语义色时**：`--dz-<名>` 与 `--dz-<名>-rgb` 成对覆盖（例如覆盖 `--dz-primary` 时同时给 `--dz-primary-rgb: r, g, b`），否则浅底/描边仍是旧色。
4. `d-video` 的第三方 ArtPlayer 注入样式自带 16 处 `inset:`（不经过本库构建），旧内核下播放器内部浮层（如网页全屏）可能偏位；如需彻底修复，宿主可用 patch-package 处理该依赖的 CSS（本库不硬编码第三方内部类名）。

## 十一、修复记录（2026-09-26）

**构建声明**：`packages/ui/vite.config.ts` 与 `playground/vite.config.ts` 增 `build.cssTarget: 'chrome86'`（附注释说明为何不是 `css.lightningcss.targets`）。

**源码回退**：

- `_variables.scss`：新增 `--dz-{primary,success,warning,danger,gray-7,gray-9,bg}-rgb` 逗号三元组（亮/暗各一份，经 `rgb-triplet()` 从同一色板变量派生——SCSS 改色板重编译自动同步；宿主运行时覆盖 CSS 变量仍需成对）+ `--dz-code-block-text-rgb`、`--dz-scrim-strong-rgb`（恒定）；暗色 `--dz-primary-hover-2` 由 `color-mix(...)` 改为 `rgba(var(--dz-primary-rgb), 0.18)`。
- 46 处 `color-mix()` 全部改写（tag / button 用组件内局部变量 `--dz-tag-rgb`、`--dz-tag-close-rgb`、`--dz-btn-rgb` 按变体取值）。其中**原本不透明**的那些（消息/通知卡片底与描边、按钮朴素底与描边、实心语义变体 hover 底与描边）改写成 `@include tint-on-bg()` —— 不透明底色 + inset 阴影罩层（罩层在内容之下、描边压在同一层不透明底上），因为 `color-mix(X p%, var(--dz-bg))` 的结果是**不透明**色：若直接写成 `background: rgba(X, p)`，卡片就变成半透明罩层，消息/通知这种 `position: fixed` 浮层会透出下层内容（这是修复过程中自查发现并纠正的一处偏差，已在 `src/__tests__/css-baseline.test.ts` 加断言防回退）。**原本就半透明**的（tag 底与描边、代码块头部与复制按钮、引用块、骨架屏微光、page-hero 遮罩、暗色 `--dz-primary-hover-2`）保留 `rgba(...)` 写法。`float-bar` 的 hover 改成"12% 白罩层 + 自身底色"两层背景（最后一层是不透明底色）。
- `page-hero` / `skeleton` 的 3 处 `inset:` → `@include absolute(0,0,0,0)`。
- `d-video`：容器加 `.d-video__inner` 绝对定位挂载层 + `::before` 的 `padding-top` 兜底（由新增纯函数 `ratioToPaddingTop` 从 `ratio` 解析），现代内核仍走 `aspect-ratio`，两者高度数学等价。

**护栏**：新增 `packages/ui/scripts/check-css-baseline.mjs`（build 链末尾断言产物：无 `inset` / range 媒体查询 / `color-mix` / scoped `:root`，`aspect-ratio` 必须有 padding 兜底，去重必须已生效，引用的关键帧必须有定义）与 `packages/ui/src/__tests__/css-baseline.test.ts`（pre-commit 扫源码与构建配置）。

**产物瘦身**：新增 `packages/ui/scripts/css-dedupe.mjs`（库与 playground build 链各挂一处）。实测 263,031 → 64,521 字节：剔除 scoped `:root` 72 条（36 个组件各一份 `[data-v-*]:root` 与 `:root.dark[data-v-*]`）与无用 `@keyframes` 副本 467 段（vue 会把注入的关键帧按组件重命名成 `fadeIn-<scopeId>`，其中绝大多数从未被 `animation` 引用）。

**验收命令实测**（`packages/ui/dist/style.css`）：

```bash
grep -c "inset:0" dist/style.css            # 0
grep -oE "@media[^{]*width *[<>]=" dist/style.css   # 无输出
grep -c "color-mix(" dist/style.css         # 0
grep -c "aspect-ratio" dist/style.css       # 1（带 padding 兜底）
grep -ao "@keyframes" dist/style.css | wc -l # 22（13 全局 + 9 组件内在用，无重复副本）
```


## 十二、开发写法规范（新增/修改样式必读）

> 操作性速查：按顺序套下面的模板即可，不需要记住禁写清单的全部 rationale。护栏会兜底——`npm test` 扫源码与构建配置（pre-commit 即拦），`npm run build` 末尾扫产物；违规直接红灯，报错信息带替代写法。机制、根因与修复记录见上文各节。

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
