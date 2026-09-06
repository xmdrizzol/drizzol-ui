# 插件开发规范

Drizzol UI 采用「核心包 + 独立插件包」的体系：核心包 `@drizzol/ui` 提供组件、工具、样式、类型；**领域性的组件**（富文本编辑器、评论、相册浏览等）做成可选的独立包，需要时按装。

## 为什么独立成包

- 领域组件往往带第三方大依赖（如编辑器 wangEditor、代码高亮 shiki），塞进核心包会让不用的宿主也下载
- 插件与后端契约耦合较强，独立包可独立版本演进（不随核心包发版频率）
- 核心包只维护「每个项目都要用」的能力，体积与 API 面可控

## 包结构约定

```
packages/ui-editor/                 # 插件包 @drizzol/ui-editor（以编辑器插件为例）
├── package.json
├── vite.config.ts                  # 同核心包的 lib 配置 + external（含 @drizzol/ui）
├── tsconfig.json / tsconfig.build.json
└── src/
    ├── index.ts                    # 插件入口：install(app) + 具名导出（同核心包模式）
    ├── with-install.ts?            # 不必重复：从 '@drizzol/ui' 导入 withInstall
    ├── components/                 # 插件组件（d- 前缀延续，如 d-editor / d-content）
    └── utils/ / composables/       # 插件私有能力（或在插件内用核心包 utils）
```

## package.json 模板

```json
{
  "name": "@drizzol/ui-editor",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": { "types": "./dist/types/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./style.css": "./dist/style.css",
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build && vue-tsc -p tsconfig.build.json --emitDeclarationOnly && node scripts/copy-styles.mjs"
  },
  "peerDependencies": {
    "vue": "^3.5.0",
    "element-plus": "^2.8.0",
    "@drizzol/ui": "^0.1.0"
  },
  "dependencies": {
    "@wangeditor/editor": "^5.1.23"
  }
}
```

要点：

- `@drizzol/ui` 必须是 **peerDependency**（复用同一实例与样式变量；避免两套 vue 运行时）
- 插件自带依赖写入 `dependencies`（编辑器插件：`@wangeditor/editor`、`@wangeditor/editor-for-vue`、`shiki`）
- 插件入口**只 install 自己的组件**；核心库的全量安装不受影响
- 样式拷贝脚本可参照核心包 `scripts/copy-styles.mjs` 在插件内放一份（拷插件自己的 `src/styles` → `dist/styles`）

## 入口约定

```ts
// src/index.ts
import type { App } from 'vue'
import { withInstall } from '@drizzol/ui'
import Editor from './components/editor'

const DEditor = withInstall(Editor, 'DEditor')

export function install(app: App) {
  app.use(DEditor) // 按需串接
}

export { DEditor }
export default { install }
```

宿主用法（二选一）：

```ts
// 全量插件
import DrizzolEditor from '@drizzol/ui-editor'
app.use(DrizzolEditor)

// 具名导入
import { DEditor } from '@drizzol/ui-editor'
```

## 共享能力（不要重复造）

插件直接 `import { ... } from '@drizzol/ui'`：

- 样式变量与主题：`setTimeout` 外一律 `var(--dz-*)`；深浅主题自动适配
- `withInstall`、`request`/`configureRequest`、`theme`、`pxToRem`、`debounce`、`useClickOutside` 等
- 弹层：直接用 `DModal` / `DDropdown`（或 element-plus 的 ElMessage/ElNotification）
- 上传：`uploadFile` / `getFileAccessUrl` / `DCropper` 与文件接口契约

插件如需扩展主题变量（如编辑器的 `--dz-editor-*`），在插件样式的 `:root` / `:root.dark` 内声明，沿用 `--dz-<plugin>-*` 命名。

## 版本与发布

- 插件包与核心包**独立版本**，均在根仓库用 changesets 管理：`npm run changeset` 选择对应包
- 插件对核心包声明宽 peer 段（如 `^0.1.0`），核心包 minor/breaking 发版时同步检查插件兼容性
- 发布：`npm run release`（会构建全部包后依次 publish）
- 新增插件后：根 `package.json` 的 build/test 脚本无需改动（`npm -w` 逐包执行），README 插件列表加一条

## 以 m-editor 为样板的二期步骤（从 drizzol-nook 迁移）

1. 建 `packages/ui-editor/`：拷 `src/components/m-editor`（改 `d-` 前缀）、`m-content`、`m-anchor` 及 `custom-types.d.ts`（wangEditor Slate 类型扩展）
2. 宏系统独立为插件模块：`use-macro-settings`（模块级单例保留）、`register-macro-menu.ts`（**Boot.registerMenu 必须在模块顶层注册**，多实例会 Duplicated key）
3. 排版：`@mixin prose` 已随核心包 `styles/_prose.scss` 输出，编辑器与展示侧共用；wangEditor 深色主题的 `--w-e-*` 变量移到插件内（核心包已删）
4. 快捷键匹配用自实现纯函数（**勿用 is-hotkey**，见核心包 CLAUDE 踩坑）
5. 宏设置 UI 可导出为插件组件 `DEditorMacroSettings`，宿主放账号页任意位置
6. 冒烟测试 `packages/ui-editor/src/__tests__/`；README 插件清单登记

## 测试与维护

- 插件包自带 vitest（环境依赖 jsdom），`npm -w @drizzol/ui-editor test`
- 核心包更新 API 时，插件包 CI/本地需同步验证
- 插件禁止修改核心包源码；需要核心能力时向核心包提变更
