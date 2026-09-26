// 产物基线守门测试：源码与构建配置不得越过「最低支持 Chrome 86」约定（见 README「浏览器兼容性」）
//
// 与 scripts/check-css-baseline.mjs 的分工：
// - 这里在 npm test / pre-commit 阶段扫源码与配置，快、无需构建，拦的是"有人又写了 color-mix 这类源码语法"；
// - 那边在每次 build 后扫产物，拦的是"压缩器按现代目标把 CSS 现代化"（inset 合并、range 媒体查询改写）。
// 两者缺一不可：0.6.0 的回归就是后者造成的，源码一直是干净的。
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import uiConfig from '../../vite.config'
import { dedupeCss } from '../../scripts/css-dedupe.mjs'
import { checkCssBaseline } from '../../scripts/check-css-baseline.mjs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const SRC = path.join(ROOT, 'src')

/** 去掉注释后再扫：规则约束的是声明，注释里提到旧写法（如"原 color-mix(...)"）是允许的 */
function stripComments(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1')
}

/** 取出 .vue 的 <style> 块（.scss 整文件即样式），测试自身排除：里面写着待禁模式的字面量 */
function styleSources() {
  return readdirSync(SRC, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.parentPath?.includes('__tests__'))
    .filter((entry) => /\.(vue|scss)$/.test(entry.name))
    .map((entry) => {
      const abs = path.join(entry.parentPath ?? entry.path, entry.name)
      const raw = readFileSync(abs, 'utf8')
      const style = entry.name.endsWith('.scss')
        ? raw
        : (raw.match(/<style[^>]*>[\s\S]*?<\/style>/g) ?? []).join('\n')
      return { rel: path.relative(SRC, abs).split(path.sep).join('/'), code: stripComments(style) }
    })
}

const FORBIDDEN = [
  {
    name: 'color-mix()',
    re: /color-mix\(/,
    fix: '改用 rgba(var(--dz-*-rgb), <alpha>)（语义色三元组见 _variables.scss）',
  },
  {
    name: 'inset 简写',
    re: /(?:^|[;{\s])inset\s*:/m,
    fix: '用 @include absolute()/fixed() 或四个长写属性',
  },
  {
    name: '逻辑属性（*-inline / *-block）',
    re: /(?:inset|margin|padding|border)-(?:inline|block)(?:-start|-end)?\s*:/,
    fix: '写物理方向属性',
  },
  {
    name: 'range 语法媒体查询',
    re: /@media[^{]*\(\s*(?:width|height)\s*[<>]/,
    fix: '写经典 min-width / max-width',
  },
  {
    name: ':is() / :where() / :has()',
    re: /:(?:is|where|has)\(/,
    fix: '展开成多个选择器',
  },
  {
    name: 'dvh/svh/lvh 视口单位与 @container/@layer/@scope',
    re: /\b(?:dvh|svh|lvh|dvw|svw|lvw)\b|@(?:container|layer|scope)\b/,
    fix: '用 vh/vw 或媒体查询',
  },
  {
    name: '独立 translate/rotate/scale 属性',
    re: /(?:^|[;{\s])(?:translate|rotate|scale)\s*:/m,
    fix: '用 transform',
  },
]

describe('源码不得使用高于 Chrome 86 的 CSS 语法', () => {
  const sources = styleSources()

  it.each(FORBIDDEN)('$name：0 处', ({ re }) => {
    const hits = sources.filter((source) => re.test(source.code)).map((source) => source.rel)
    expect(hits).toEqual([])
  })

  it('aspect-ratio 只出现在 d-video，且同文件必须有 padding 兜底', () => {
    const hits = sources.filter((source) => /aspect-ratio\s*:/.test(source.code))
    expect(hits.map((hit) => hit.rel)).toEqual(['components/video/index.vue'])
    expect(hits[0].code).toContain('ratioToPaddingTop')
    expect(hits[0].code).toMatch(/padding-top:\s*v-bind\('paddingTop'\)/)
  })
})

describe('构建配置声明了 Chrome 86 基线', () => {
  it('库 build.cssTarget 声明的 chrome 版本不高于 86', () => {
    const serialized = JSON.stringify(uiConfig.build?.cssTarget ?? null)
    const match = serialized.match(/chrome(\d+)/)
    expect(match, 'build.cssTarget 未声明 chrome 目标（Vite 默认目标是 chrome111）').toBeTruthy()
    expect(Number(match?.[1])).toBeLessThanOrEqual(86)
  })

  it('playground 构建同样声明（宿主自建构建的示范）', () => {
    const config = readFileSync(path.resolve(ROOT, '../../playground/vite.config.ts'), 'utf8')
    expect(config).toMatch(/cssTarget:\s*'chrome86'/)
  })

  it('build 链挂了产物去重与基线校验脚本', () => {
    const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
    expect(pkg.scripts.build).toContain('css-dedupe.mjs')
    expect(pkg.scripts.build).toContain('check-css-baseline.mjs')
  })
})

describe('产物去重（scripts/css-dedupe.mjs）', () => {
  it('丢弃永不命中的 scoped :root，保留未加 scope 的全量令牌', () => {
    const css = ':root{--a:1}[data-v-abc123]:root{--a:1}:root.dark[data-v-abc123]{--a:2}.x[data-v-abc123]{color:red}'
    const { css: out, droppedRootRules } = dedupeCss(css)
    expect(droppedRootRules).toBe(2)
    expect(out).toBe(':root{--a:1}.x[data-v-abc123]{color:red}')
  })

  it('选择器组里只要有一段不是 scoped :root 就整体保留', () => {
    expect(dedupeCss(':root,.x[data-v-abc]{--a:1}').droppedRootRules).toBe(0)
  })

  it('同名同内容的 @keyframes 只留首次；内容不同则都保留', () => {
    const same = '@keyframes fadeIn{from{opacity:0}}@keyframes fadeIn{from{opacity:0}}'
    expect(dedupeCss(same).css).toBe('@keyframes fadeIn{from{opacity:0}}')

    const different = '@keyframes fadeIn{from{opacity:0}}@keyframes fadeIn{from{opacity:.5}}'
    expect(dedupeCss(different).css).toBe(different)
  })

  it('未被引用、且存在同内容全局定义的 scoped 副本被丢弃（vue 会按组件重命名关键帧）', () => {
    const global = '@keyframes spin{to{transform:rotate(1turn)}}'
    const scopedCopy = '@keyframes spin-7ba5bd90{to{transform:rotate(1turn)}}'
    const { css: out, droppedKeyframes } = dedupeCss(global + scopedCopy + '.a[data-v-7ba5bd90]{color:red}')
    expect(droppedKeyframes).toBe(1)
    expect(out).toBe(global + '.a[data-v-7ba5bd90]{color:red}')
  })

  it('在用的 scoped 副本保留（animation 引用到它）', () => {
    const css = '@keyframes spin-7ba5bd90{to{transform:rotate(1turn)}}.a{animation:spin-7ba5bd90 1s linear}'
    expect(dedupeCss(css).droppedKeyframes).toBe(0)
  })

  it('没有全局同内容定义的 scoped 关键帧保守保留', () => {
    const css = '@keyframes d-message-in-7ba5bd90{from{opacity:0}}'
    expect(dedupeCss(css).css).toBe(css)
  })

  it('@media 等嵌套块原样保留（不做递归改写）', () => {
    const css = '@media screen and (max-width:768px){.x{color:red}}'
    expect(dedupeCss(css).css).toBe(css)
  })
})

describe('产物基线校验（scripts/check-css-baseline.mjs）', () => {
  const clean =
    ':root{--a:1}.d-tag[data-v-abc]{background:rgba(var(--dz-primary-rgb),.12)}' +
    '@media screen and (max-width:768px){.x{color:red}}' +
    '@keyframes fadeIn{from{opacity:0}}'

  it('干净产物通过', () => {
    expect(checkCssBaseline(clean).failures).toEqual([])
  })

  it('逐项拦截超基线语法', () => {
    expect(checkCssBaseline('.d-modal[data-v-a]{position:fixed;inset:0}').failures.join()).toContain('inset')
    expect(checkCssBaseline('@media (width<=768px){.x{color:red}}').failures.join()).toContain('range')
    expect(checkCssBaseline('.a{background:color-mix(in srgb,red 10%,blue)}').failures.join()).toContain('color-mix')
    expect(checkCssBaseline('[data-v-a]:root{--a:1}').failures.join()).toContain('scoped :root')
  })

  it('aspect-ratio 缺 padding 兜底时报错，带兜底则通过', () => {
    expect(checkCssBaseline('.d-video[data-v-a]{aspect-ratio:16/9}').failures.join()).toContain('padding-top')
    expect(
      checkCssBaseline('.d-video[data-v-a]{aspect-ratio:16/9}.d-video[data-v-a]::before{padding-top:56.25%}').failures
    ).toEqual([])
  })

  it('可继续去重（漏跑 css-dedupe.mjs）与重复 @keyframes 都报错', () => {
    const dup = '@keyframes fadeIn{from{opacity:0}}@keyframes fadeIn{from{opacity:0}}'
    expect(checkCssBaseline(dup).failures.join()).toContain('@keyframes')
    expect(checkCssBaseline(':root{--a:1}[data-v-a9]{--b:2}[data-v-a9]:root{--b:2}').failures.join()).toContain('未去重')
  })

  it('去重删掉在用的关键帧时报错（引用必须有定义）', () => {
    expect(checkCssBaseline('.x{animation:fadeIn-abc12345 1s}').failures.join()).toContain('没有定义')
  })
})
