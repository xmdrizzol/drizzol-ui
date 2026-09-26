/**
 * 产物基线校验：最低支持 Chrome 86（约定见 README「浏览器兼容性」）。
 *
 * 放在 build 链最后一步：任何一次构建都要自查产物，把"构建引入了高于基线的语法"变成红灯，
 * 而不是上线后在宿主项目的旧内核浏览器里才发现。
 *
 * 用法：node scripts/check-css-baseline.mjs [产物路径，默认 dist/style.css]
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dedupeCss } from './css-dedupe.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_TARGET = path.resolve(__dirname, '../dist/style.css')

const count = (css, re) => (css.match(re) ?? []).length

/**
 * 校验产物 CSS 是否满足 Chrome 86 基线。
 * @param {string} css
 * @returns {{ failures: string[], notes: string[] }}
 */
export function checkCssBaseline(css) {
  const failures = []
  const notes = []

  const forbidden = [
    {
      name: 'inset 简写（Chrome 87+，旧内核整条丢弃 → 遮罩/弹窗错位）',
      hits: count(css, /(?:^|[;{\s])inset\s*:/g),
    },
    {
      name: 'range 语法媒体查询（Chrome 104+，旧内核整条失效 → 移动端适配失效）',
      hits: count(css, /@media[^{]*\(\s*(?:width|height)\s*[<>]/g),
    },
    {
      name: 'color-mix()（Chrome 111+，旧内核整条声明的颜色丢失 → 语义底色不可见）',
      hits: count(css, /color-mix\(/g),
    },
    {
      name: 'scoped :root 死规则（应已由 scripts/css-dedupe.mjs 剔除）',
      hits: count(css, /\[data-v-[0-9a-zA-Z]+\]:root/g) + count(css, /:root\.dark\[data-v-[0-9a-zA-Z]+\]/g),
    },
  ]
  for (const item of forbidden) {
    if (item.hits > 0) failures.push(`${item.name}：${item.hits} 处`)
  }

  // aspect-ratio（Chrome 88+）允许保留，但必须有 padding 兜底供旧内核撑出同一比例
  if (/aspect-ratio\s*:/.test(css) && !/\.d-video[^{]*:{1,2}before\s*\{[^}]*padding-top\s*:/.test(css)) {
    failures.push('aspect-ratio 缺少 .d-video::before 的 padding-top 兜底（旧内核比例会失效）')
  }

  // 去重必须已经跑过（幂等）：还有可删的卷 token/无用关键帧副本 → build 链漏了 css-dedupe.mjs
  const { droppedRootRules, droppedKeyframes, referencedKeyframes } = dedupeCss(css)
  if (droppedRootRules > 0 || droppedKeyframes > 0) {
    failures.push(`产物未去重：还可剔除 scoped :root ${droppedRootRules} 条、无用 @keyframes 副本 ${droppedKeyframes} 段`)
  }

  // 去重不得删掉在用的关键帧：animation 里带 scope 哈希后缀的名字必须仍有定义
  const defined = new Set()
  let match
  const defRe = /@keyframes\s+([A-Za-z0-9_-]+)\s*\{/g
  while ((match = defRe.exec(css)) !== null) defined.add(match[1])

  const referencedHashes = new Set()
  const declRe = /(?:^|[;{])\s*(?:-[a-z]+-)?animation(?:-name)?\s*:\s*([^;}]+)/g
  while ((match = declRe.exec(css)) !== null) {
    for (const raw of match[1].split(/[,\s]+/)) {
      const token = raw.replace(/^["']|["']$/g, '')
      if (/[0-9a-f]{6,8}$/.test(token)) referencedHashes.add(token)
    }
  }
  const missing = [...referencedHashes].filter((name) => !defined.has(name))
  if (missing.length > 0) failures.push(`被 animation 引用（带 scope 哈希）却没有定义的 @keyframes：${missing.join('、')}`)

  notes.push(`未加 scope 的 :root 规则 ${count(css, /[,{}]:root\s*[,{]/g)} 条（应为 1 条全量令牌）`)
  notes.push(`被引用的关键帧 ${referencedKeyframes.size} 个、定义 ${defined.size} 个`)
  notes.push(`产物大小 ${(css.length / 1024).toFixed(1)}KB`)

  return { failures, notes }
}

function runCli(target) {
  let css
  try {
    css = readFileSync(target, 'utf8')
  } catch {
    console.error(`[check-css-baseline] 读不到产物 ${target}，请先执行构建`)
    process.exit(1)
  }

  const { failures, notes } = checkCssBaseline(css)
  for (const note of notes) console.log(`[check-css-baseline] ${note}`)

  if (failures.length > 0) {
    console.error('[check-css-baseline] 产物不满足 Chrome 86 基线：')
    for (const failure of failures) console.error(`  ✗ ${failure}`)
    console.error('[check-css-baseline] 修复方向见 README「浏览器兼容性」/ CLAUDE.md 硬性约定')
    process.exit(1)
  }
  console.log('[check-css-baseline] ✓ 产物满足 Chrome 86 基线（无 inset / range 媒体查询 / color-mix / scoped :root，且已去重）')
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  runCli(process.argv[2] ?? DEFAULT_TARGET)
}
