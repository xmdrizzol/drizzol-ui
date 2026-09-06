# 贡献指南（Contributing）

感谢愿意为 Drizzol UI 贡献！提交 Issue 或 PR 前，请先阅读本指南。

## 开发环境

- Node **≥ 20.19**（Vite 8 要求）
- Node.js 生态包管理器：npm（仓库使用 npm workspaces）

```bash
npm install          # 安装依赖
npm run dev          # 启动演示站（端口 5177，改库源码即时生效）
npm test             # vitest 全量测试
npm run typecheck    # 类型检查
npm run build        # 构建发布产物（es + cjs + d.ts + styles）
```

## 开发规范

完整规范见 [CLAUDE.md](./CLAUDE.md)，重点摘要：

- 组件一律 **`D` 前缀**（模板 kebab-case `<d-button>`），目录 kebab-case 三件套（`index.vue` + `index.ts`）
- 样式**只允许 `--dz-*` CSS 变量**，禁止裸色值；深浅主题靠变量双色板
- **一个组件一个文档页**（`playground/src/views/components/<name>/`），演示一律使用库组件排版
- **新增/修改组件必须同步测试**（`packages/ui/src/__tests__/`），纯函数改动补单测
- 涉及发布产物的改动必须附 **changeset**（`npm run changeset`，patch=修复 / minor=新增能力）
- 内置图标一律取自 **Lucide（ISC）**，经 Iconify 拉取；禁止 iconfont 内联与第三方品牌 logo

## 提交规范（Conventional Commits）

提交信息格式：`type(scope?): subject`

- `feat`：新能力（0.x 阶段对应 minor）
- `fix`：修复（对应 patch）
- `docs` / `refactor` / `test` / `chore`：按性质选择
- 主题行中文即可，一行说清改了什么

husky 会在 `commit-msg` 校验格式、在 `pre-commit` 运行 typecheck + 全量测试，不通过无法提交。

## Issue 规范

提交前请先**搜索已有 Issue**，避免重复。

**Bug 报告必须包含**：

1. `@drizzol/ui` 版本与 Vue / Element Plus 版本（如仍在使用 EP 宿主环境）
2. 浏览器与操作系统
3. **最小复现步骤**（或可运行的最小示例/仓库链接）
4. 期望行为 与 实际行为
5. 必要时的截图 / 控制台报错

**Feature 建议**：说明使用场景与期望 API 形状；通用性不足或与库定位（通用组件/工具/样式）冲突的提议可能会被婉拒。

## PR 规范

1. **Fork 仓库**（或协作成员从 `main` 拉分支），分支命名 `feat/xxx`、`fix/xxx`、`docs/xxx`
2. 一个 PR 聚焦一件事；大改动建议先开 Issue 讨论
3. 提交信息遵循 Conventional Commits（PR 内多个 commit 会在合并时压缩）
4. **必须通过**：`npm test`、`npm run typecheck`；UI 改动请附演示站截图
5. 涉及 `@drizzol/ui` 发布产物的改动**必须附 changeset**；破坏性变更需说明迁移方式
6. PR 描述写清：改了什么、为什么、如何验证；关联 Issue 用 `Closes #xx`
7. 通过 Review 后由维护者合并（squash）

## push 与分支规则

- **`main` 分支受保护**：禁止直接 push，所有改动一律走 PR 合入
- `main` 始终保持可构建、可测试的最新稳定态
- 发布由维护者执行：`npm run release`（构建 + changesets publish）

## 许可

提交即表示同意你的贡献以 [MIT](./LICENSE) 许可随本仓库分发。
