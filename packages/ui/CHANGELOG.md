# @xmdrizzol/drizzol-ui

## 0.5.0

### Minor Changes

- d272199: 新增 `DAvatar` 头像组件（移植自 drizzol-nook 应用层的头像实现）：

  - `src` 统一接受完整 URL（http/blob/data）或文件引用，解析规则与 DImage 一致（新增公共工具 `resolveAccessUrl`：带类型前缀的 fileRef 自动拆解、纯存储文件名按类型拼接访问前缀）。
  - `shape` 圆形（默认）/方形，`size` 数字按 px 转 rem。
  - 图片为空或加载失败时显示 `fallbackText`（如用户名首字），`#fallback` 插槽可完全自定义；src 换回有效地址后自动重试。
  - DImage 同步修复：src 变化后重置失败态（此前加载失败后换图不会重试）。

## 0.4.0

### Minor Changes

- d2f58e0: 新增 `DImage` / `DImageGroup` 图片组件（点击预览大图基于 vue-photo-preview-next）：

  - `DImage`：`src` 统一接受完整 URL（http/blob/data）或文件引用（`image/xxx.png` 带类型前缀自动拆解、纯存储文件名按 image 拼接访问前缀）；加载失败显示兜底占位（`fallback-text` 或 `#fallback` 插槽）；`width`/`height`/`radius`/`fit`/`lazy` 常规图片属性齐备。
  - 点击预览大图默认开启（`:preview="false"` 关闭），基于 vue-photo-preview-next（MIT，与 DVideo 封装 ArtPlayer、DCropper 封装 cropperjs 同为内部封装的功能库）；`DImageGroup` 分组后预览可左右切换，`mask-closable`/`loop` 等参数透传。
  - 运行时新增依赖 `vue-photo-preview-next@^0.0.8`（已列入 vite external）。

- 8e64cec: DIcon 新增 7 个 Lucide 图标，覆盖编辑器工具条场景：

  `search`（搜索）、`image`（图片）、`video`（视频）、`bold`（加粗）、`italic`（斜体）、`underline`（下划线）、`list`（无序列表）。

  取自 Lucide（ISC 许可），经 Iconify API 拉取后并入雪碧图，现共 60 个 symbol；`<d-icon name="bold" />` 即用。

### Patch Changes

- 25a3562: 修复代码块在窄屏横向滚动时的显示错误：

  - `pre > code`（全局排版与 prose 排版同步修改）宽度改为 `max-content` + `min-width: 100%`：长行把深色代码盒一起撑宽，横向滚动时背景/边框始终包住文本（此前 `white-space: pre` 的长行会溢出到深色盒子外，滚动后文字悬在盒外）。
  - DCodeBlock：`__body` 的横向内边距移到内部 `code`（宽度跟随内容），长代码滚到最右仍保留右侧留白（滚动容器自身的右内边距在滚尽时会被吃掉）。

## 0.3.1

### Patch Changes

- 59ab318: 修复 DDropdown 菜单越出视口导致显示不全：定位计算加入视口边界夹取（shift 适配）。

  - 水平越界时菜单整体平移收进视口（两侧各留 8px 安全边距），箭头反向跟随、继续指向触发器，跟随不到时夹在菜单边内不戳出。
  - 触发器贴近视口底部、菜单下方放不下时整体上移适配，此时箭头自动隐藏（不再指向触发器）。
  - 菜单打开期间监听窗口缩放与容器滚动，边界关系变化实时重算；首帧定位改在 `nextTick` 后用真实菜单尺寸计算，避免先渲染错误位置再跳正。
  - 定位计算抽为纯函数 `components/dropdown/position.ts`，边界场景补单测（jsdom 无布局，组件内测不了）。

- e0177db: 上传接口地址支持自定义（此前写死为后端契约路径 `/general/file/upload[/image]`）：

  - 新增 `configureFileApi({ uploadUrl?, uploadImageUrl? })`：全局调整上传文件 / 裁剪图片的接口路径，与 `configureRequest`、`configureFileAccessPrefix` 同属运行时配置，宿主在入口调用一次。
  - `DUpload` / `DCropper` 新增 `action` 属性：按组件实例覆盖上传地址（如头像上传走独立接口）。
  - `uploadFile` / `uploadImage` 的参数新增 `url` 字段：单次调用覆盖，优先级 `params.url` > 全局配置 > 默认契约。
  - 默认值不变，未配置时行为与旧版完全一致。

## 0.3.0

### Minor Changes

- 011138e: 布局系统增强与修复：

  - **修复高宽属性失效**：`height="48"` 这类纯属性（字符串）此前输出无单位、非法的 `height: 48` 被浏览器丢弃，现统一经 `pxToRem` 转成 rem（`48 → 3rem`），并支持 `rem/%/auto/px` 等带单位值原样透传。
  - **尺寸改用 rem**：JS 内联尺寸走 `pxToRem`（1rem = 16px）；SCSS 源码写 px，构建时经 `postcss-pxtorem` 自动换算（`minPixelValue: 2` 保留 1px 细边框）。
  - **`fixed` 悬浮**：DHeader / DFooter / DAside 新增 `fixed` 属性（sticky 吸顶/吸底）；DMain 去掉默认 `overflow: auto`，使外层/页面可滚动，sticky 真正生效。
  - **修复 DAside `fixed` 不生效**：侧栏作为 flex 项被默认拉伸到与布局容器等高，sticky 没有可位移空间（等同 static）；`fixed` 时改为 `align-self: flex-start`，自身收缩为内容高度后正常吸附。上方存在吸顶头部时用 `--dz-aside-sticky-top` 让出头部高度（如 `48px`），默认 `0`。
  - 补齐基础样式与边距，移动端默认收窄；修正 DLayout 方向推断（改为渲染期检测插槽是否含 DAside，嵌套布局不再丢失 row/column）。

## 0.2.2

### Patch Changes

- docs: 重写包内 README 面向 npm 消费者——徽章与 GitHub/文档站链接置顶、组件清单补全反馈四件套、移除维护者向内容（本地开发/仓库约定/CLAUDE 引用）

## 0.2.1

### Patch Changes

- docs: 补充包内 README（npm 页面此前无 README 展示）；链接改为仓库绝对地址

## 0.2.0

### Minor Changes

- 修复按钮/表单/工具函数/组合式函数等一批缺陷，清理组件与全局裸色值，补齐弹窗可访问性

  组件：

  - **DButton**：变体类名改为 computed，`link/round/block/plain/size` 动态绑定实时生效；原生按钮固定 `type="button"`，置于 form 内不再误触提交；尺寸类 `d-button--small` 统一为 `is-small`
  - **DButton**：`type` 扩展为六色语义（default 中性白 / primary 蓝 / success / warning / danger / info），并使 `type` 真正生效（原实现 type 为摆设、按钮恒为蓝色）；颜色全部由 `--dz-btn-*` 变量驱动，plain/link 形态自动消费类型色（plain hover 转实心）。⚠️ **default 按钮由蓝色实心改为中性白**（对齐 EP 语义，取消类按钮不再与主操作混淆），需要蓝色无类型语义的按钮请显式传 `type="primary"`
  - **DFormItem**：`0`/`false` 不再被必填校验误判为空值；number 值参与 min/max 校验不再崩溃（按字面长度比较）；未置于 `DForm` 内时不再抛错；规则支持分规则文案 `requiredMessage`/`minMessage`/`maxMessage`（缺省时回退 `message`，再缺省用内置默认文案）
  - **DModal**：支持 Escape 关闭，容器补充 `role="dialog"` / `aria-modal` 语义
  - **DCard**：移除 `& + &` 相邻兄弟 `margin-top: 20px` 规则——该规则在 grid/flex 横向布局中会把同排卡片整体推低 20px 造成错位（首页特性卡即中招）；竖排堆叠间距改由父容器 `gap` 控制，宿主若有依赖请自行加间距容器。附带修复 `isHover` 非响应式问题（与 DButton 同类）
  - **DDropdown**：动画由 gsap 补间迁移为 **Vue `<Transition>` + CSS 过渡**（淡入 + 自 `offset` 距离下滑落位），并**移除 `gsap` 运行时依赖**——其 No-Charge 许可禁止再分发进产物，移除后库内依赖全部 MIT；纯 CSS 过渡被打断时天然平滑，不再需要补间基线管理。附带修复：打开状态下卸载组件时未移除全局点击监听的泄漏；箭头类名错配（`.arrow` → `.d-dropdown__arrow`，样式此前从未生效）
  - **DMenu**：hover 背景由 `--dz-bg` 改为 `--dz-gray-4`——侧边栏透明露出 body、演示卡片底均为 `--dz-bg`，白上白导致 hover 背景自组件诞生起就不可见；gray-4 在浅/深主题与任意承载面上均可见
  - **DTabs**：激活下划线 `bottom: -1px` 改为 `bottom: 0`——bar 是 `overflow-x` 滚动容器（另一轴随之变 auto），下划线叠进边框的 1px 会撑出纵向滚动条（Windows 风格滚动条带上下箭头按钮）
  - **DPageHero**：标题显式声明 `color: var(--dz-on-fill)`——此前依赖从 `__inner` 继承白色，但全局排版给 `h1~h6` 直接设了 `var(--dz-text-h)`，元素选择器压过继承，浅色主题下标题变深灰、压在深色蒙版图片上不可读；深色主题因 `text-h` 接近白色而侥幸看不出来

  工具函数：

  - **cookie**：新增通用 `getJSONCookie<T>(key)` / `setJSONCookie(key, value, days, path)`（诚实命名，对象读写）；`setUserCookie`/`getUserCookie`/`removeUserCookie` 收敛为其上 `USER_INFO_KEY` 的薄封装
  - **cookie ⚠️ 行为变更**：`getCookie` 改为原样返回字符串（返回类型 `any → string | null`），与 `setCookie` 对称——旧实现对普通字符串做 `JSON.parse`，导致 `"abc"`/`"true"`/`"42"` 一律读回 `null`；需要解析对象请改用 `getJSONCookie`
  - **cookie**：`clearAllCookies` 去掉残留的 `console.log` 调试输出
  - **theme**：`applyTheme` 改用 `classList.toggle('dark', …)` 而非整串赋值 `className`，避免抹掉宿主挂在 `<html>` 上的其它类（语言标记、UA 检测等）
  - **throttle-debounce**：`debounce` 的 `immediate` 模式改为仅首边缘触发一次、不再尾触发重复执行（旧实现在一次连点里会 leading + trailing 跑两遍）
  - **file-api**：`uploadImage` 的 `Content-Type` 由手写的 `multipart/form-data` 改为 `undefined`，交由浏览器生成带 `boundary` 的请求头（旧写法顶掉 boundary，后端 multipart 解析会失败），与 `uploadFile` 保持一致

  Composables：

  - **useInView**：改用 `watch(targetRef, …, { immediate: true })` 观察，元素晚于挂载才出现（`v-if`/异步渲染）时也能挂上——旧实现只在 `onMounted` 里 `if (targetRef.value) observe`，挂载瞬间 ref 为 null 则永远观察不到、`isInView` 恒为 false（该 API 此前库内无调用，属面向宿主的健壮性补齐）
  - 新增 `composables.test.ts`：覆盖 `useClickOutside`（内/外点击、多 ref、removeListener）、`useScrollListener`（无节流/节流窗口/卸载清定时器）、`useInView`（含晚挂载目标回归）、`useIsMobile`（初始判定 + resize 更新 + 卸载无泄漏）

  依赖与反馈系统：

  - **移除 `element-plus`**（原 peerDependencies）：宿主不再需要安装任何第三方 UI 库
  - **新增自研反馈四件套**（API 形状对齐 element-plus，迁移成本趋近于零）：
    - `DMessage`：顶部 toast，`DMessage.success/error/warning/info(text)`，返回句柄可手动关闭；类型图标 + 卡片底/边框染类型色（color-mix 随主题自适应），辨识度对齐 ElMessage
    - `DNotification`：右上角通知，正文支持 VNode，`duration: 0` 常驻 + `close()` 手动关（上传进度场景）；同款类型图标与卡片色罩
    - `DConfirm(text, title?, options?)`：基于 `DModal` 的命令式确认框，确定 `resolve('confirm')`、取消 `reject('cancel')`（对齐 `ElMessageBox.confirm` 语义）
    - `DDrawer`：抽屉组件（`v-model:visible`、四方向滑出 `direction: rtl/ltr/ttb/btt`、`size` 对应宽或高且支持百分比、Esc/遮罩可关、header/footer 插槽、`before-close` 关闭前回调、`open/opened/close/closed` 生命周期事件、嵌套时 Esc 仅关闭最上层）
  - **迁移指南**：`ElMessage.error(x)` → `DMessage.error(x)`；`ElMessageBox.confirm(m, t, o)` → `DConfirm(m, t, o)`（then/catch 写法不变）；`ElNotification(o)` → `DNotification(o)`（`handle.close()` 不变）
  - 清理 `_global.scss` 的 `.el-drawer` 覆盖与 `--el-drawer-bg-color` 变量（库已不含 element-plus）
  - **基础排版**：列表项 `li` 间距由 4px 放宽至 8px（`_typography` 与 `_prose` 同步），行高维持正文 1.8，长句列表不再拥挤
  - **表单控件字体**：`DInput`（input/textarea）与 `DButton` 显式声明 `font-family: inherit`——表单控件默认不继承父级字体，会掉进浏览器默认字体
  - **链接样式**：`--dz-link/hover/visited` 由橙色调（#fdae6d 系）改为主色派生（link=primary、hover=primary-7、visited=primary-6），与全库主色系统一；全局 `a` 默认无下划线、hover 加下划线（`text-underline-offset: 3px`）

  图标（许可合规）：

  - 内置雪碧图整体重绘为 **[Lucide](https://lucide.dev)（ISC 许可）**，替换原先来源不明的 iconfont 内联图标（`fd-*` 成套集 + 通用图标）；`dz-icon-*` 命名与组件 API 保持不变
  - **移除第三方品牌 logo**（github / discord / qq / bilibili），规避商标风险；需要指向某平台时由宿主自行引入
  - `DIcon` 适配 Lucide 描边模型：`svg` 由 `fill: currentColor` 改为 `fill: none; stroke: currentColor`（symbol 内容自带 `stroke=currentColor`，随主题文字色变化）
  - 提供 4 个 `*-fill` 填充变体（`heart-fill` / `circle-close-fill` / `fd-star-fill` / `fd-moon-fill`），用 `fill=currentColor` 实现、自动随主题色，无需按深浅主题各备色值
  - 图标数由 52 调整为 53（45 描边 + 4 填充 + 4 状态图标 circle-check/circle-x/circle-alert/info，供 DMessage/DNotification 类型标识使用）

  样式：

  - 新增 `--dz-on-fill`（实心填充前景）、`--dz-scrim`/`--dz-scrim-strong`（媒体浮层）、`--dz-hero-scrim`（横幅压暗渐变）、`--dz-code-block-*`（恒定深色代码块全家桶：bg/head-bg/head-border/border/border-hover/text/text-d/copied）变量；组件与全局排版（`_typography`/`_prose`/`_global` 的代码块系列）全部改走变量，组件与样式内不再出现裸色值；`DPageCover` 遮罩改用 `--dz-bg`，深色主题下不再出现白色雾面；`DVideo` 主题色兜底由 `#409eff` 修正为库主色 `#1677ff`；`DCodeBlock` 复位全局 `pre > code` 的边框/外边距，消除内部双重盒子
