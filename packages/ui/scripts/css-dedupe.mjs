/**
 * 构建产物去重：剔除永不命中的 scoped `:root` 规则与组件内无用的 `@keyframes` 副本。
 *
 * 背景一：vite 的 scss `additionalData` 会给每个组件的 <style> 注入 `_animations.scss`，
 * 而它 `@use` 的 `_variables.scss` 带顶层 `:root` / `:root.dark` 输出 → 每个组件都重新输出一份
 * 全量令牌，被 vue 的 scoped 变换改写成 `[data-v-xxx]:root`。`<html>` 永远不会带组件的 data-v 属性，
 * 这些规则是死代码（0.6.0 产物里占 133KB / 54%）。
 *
 * 背景二：同一份注入让每个组件都输出全部 13 个 `@keyframes`，vue 会按组件作用域重命名
 * （`fadeIn-<scopeId>`），因此"字节完全一致"根本匹配不到——真正可去的是**没有被任何 animation
 * 声明引用、且存在同内容全局定义**的 scoped 副本（库与宿主的 JS 都不引用动画名，见 docs 说明）。
 *
 * 只做三件可证伪的事，不做通用 CSS 压缩：
 * 1. 选择器组里每一段都同时含 `[data-v-*]` 与 `:root` 的规则 → 丢弃（永不命中）；
 * 2. 同名同内容的 `@keyframes` 只保留首次；
 * 3. 未被引用且存在同内容全局定义的 scoped `@keyframes` 副本 → 丢弃。
 *
 * CLI: node scripts/css-dedupe.mjs <文件或目录> [更多路径]
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const DATA_V_RE = /\[data-v-[0-9a-zA-Z]+\]/
/** vue 的 scoped 关键帧重命名后缀：`fadeIn-7ba5bd90` */
const SCOPED_NAME_RE = /-[0-9a-f]{6,8}$/
/** animation / animation-name 声明（含厂商前缀） */
const ANIMATION_DECL_RE = /(?:^|[;{])\s*(?:-[a-z]+-)?animation(?:-name)?\s*:\s*([^;}]+)/g

/** 选择器组是否全为 scoped `:root`（永不命中 <html>） */
function isDeadScopedRoot(prelude) {
  if (!prelude.includes(':root')) return false
  const selectors = prelude.split(',').map((s) => s.trim()).filter(Boolean)
  if (selectors.length === 0) return false
  return selectors.every((s) => DATA_V_RE.test(s) && s.includes(':root'))
}

/** 跳过字符串字面量，返回结束引号的下标 */
function skipString(css, start) {
  const quote = css[start]
  for (let i = start + 1; i < css.length; i++) {
    if (css[i] === '\\') { i++; continue }
    if (css[i] === quote) return i
  }
  return css.length - 1
}

/** 找下一个 `{`，跳过注释与字符串 */
function findNextBrace(css, from) {
  for (let i = from; i < css.length; i++) {
    const ch = css[i]
    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2)
      if (end === -1) return -1
      i = end + 1
      continue
    }
    if (ch === '"' || ch === "'") { i = skipString(css, i); continue }
    if (ch === '{') return i
  }
  return -1
}

/** 返回与 openIndex 处 `{` 配对的 `}` 下标（跳过注释与字符串） */
function matchBrace(css, openIndex) {
  let depth = 0
  for (let i = openIndex; i < css.length; i++) {
    const ch = css[i]
    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2)
      if (end === -1) return css.length - 1
      i = end + 1
      continue
    }
    if (ch === '"' || ch === "'") { i = skipString(css, i); continue }
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return i
    }
  }
  return css.length - 1
}

/**
 * 把 CSS 切成"规则块"序列（`@media` 等嵌套块整体当一个块，不做递归改写）。
 * @returns {Array<{ kind: 'text', text: string } | { kind: 'rule', prelude: string, block: string, keyframesName?: string }>}
 */
function parseItems(css) {
  const items = []
  let i = 0
  while (i < css.length) {
    const openIndex = findNextBrace(css, i)
    if (openIndex === -1) {
      items.push({ kind: 'text', text: css.slice(i) })
      break
    }
    const prelude = css.slice(i, openIndex)
    const closeIndex = matchBrace(css, openIndex)
    const block = css.slice(openIndex, closeIndex + 1)
    const keyframeAt = prelude.lastIndexOf('@keyframes')
    const item = { kind: 'rule', prelude, block }
    if (keyframeAt !== -1) item.keyframesName = prelude.slice(keyframeAt + '@keyframes'.length).trim()
    items.push(item)
    i = closeIndex + 1
  }
  return items
}

/** animation 声明里实际用到的关键帧名（CSS 里唯一能触发动画的途径；支持带引号的写法） */
function collectReferencedNames(css, names) {
  const referenced = new Set()
  let match
  ANIMATION_DECL_RE.lastIndex = 0
  while ((match = ANIMATION_DECL_RE.exec(css)) !== null) {
    for (const raw of match[1].split(/[,\s]+/)) {
      const token = raw.replace(/^["']|["']$/g, '')
      if (names.has(token)) referenced.add(token)
    }
  }
  return referenced
}

/**
 * 去重产物的 CSS 文本（纯函数，便于单测）。
 * @param {string} css
 * @returns {{ css: string, droppedRootRules: number, droppedKeyframes: number, referencedKeyframes: Set<string> }}
 */
export function dedupeCss(css) {
  const items = parseItems(css)
  const names = new Set(items.filter((item) => item.keyframesName).map((item) => item.keyframesName))
  const referenced = collectReferencedNames(css, names)
  // 全局（未重命名）定义的内容指纹：scoped 副本只有在它们有等价全局定义时才可删
  const globalBodies = new Set(
    items.filter((item) => item.keyframesName && !SCOPED_NAME_RE.test(item.keyframesName)).map((item) => item.block)
  )

  const parts = []
  const seenKeyframes = new Set()
  let droppedRootRules = 0
  let droppedKeyframes = 0

  for (const item of items) {
    if (item.kind === 'text') {
      parts.push(item.text)
      continue
    }
    if (isDeadScopedRoot(item.prelude)) {
      droppedRootRules++
      continue
    }
    if (item.keyframesName) {
      const fingerprint = `${item.keyframesName}${item.block}`
      const isDuplicate = seenKeyframes.has(fingerprint)
      seenKeyframes.add(fingerprint)
      const isUnusedScopedCopy =
        SCOPED_NAME_RE.test(item.keyframesName) &&
        !referenced.has(item.keyframesName) &&
        globalBodies.has(item.block)
      if (isDuplicate || isUnusedScopedCopy) {
        droppedKeyframes++
        continue
      }
    }
    parts.push(item.prelude, item.block)
  }

  return { css: parts.join(''), droppedRootRules, droppedKeyframes, referencedKeyframes: referenced }
}

/** 收集路径下的所有 .css 文件（目录递归） */
function collectCssFiles(target) {
  const stat = statSync(target)
  if (stat.isFile()) return target.endsWith('.css') ? [target] : []
  return readdirSync(target, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
    .map((entry) => path.join(entry.parentPath ?? entry.path, entry.name))
}

function runCli(targets) {
  for (const target of targets) {
    for (const file of collectCssFiles(target)) {
      const before = readFileSync(file, 'utf8')
      const result = dedupeCss(before)
      if (result.droppedRootRules === 0 && result.droppedKeyframes === 0) {
        console.log(`[css-dedupe] ${path.relative(process.cwd(), file)}：无需去重`)
        continue
      }
      writeFileSync(file, result.css)
      const saved = before.length - result.css.length
      console.log(
        `[css-dedupe] ${path.relative(process.cwd(), file)}：` +
        `丢弃 scoped :root ${result.droppedRootRules} 条、无用 @keyframes 副本 ${result.droppedKeyframes} 段，` +
        `${before.length} → ${result.css.length} 字节（-${(saved / 1024).toFixed(1)}KB）`
      )
    }
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  const targets = process.argv.slice(2)
  if (targets.length === 0) {
    console.error('[css-dedupe] 用法：node scripts/css-dedupe.mjs <文件或目录> [更多路径]')
    process.exit(1)
  }
  runCli(targets)
}
