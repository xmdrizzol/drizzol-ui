/**
 * 文档站专用：Shiki 懒加载高亮（细粒度包 + JS 正则引擎，不引 WASM、不进主包）。
 *
 * 只在演示站使用——库产物不内置 Shiki（体积由消费方按需承担），
 * 库的 DCodeBlock 通过默认插槽接收这里的预高亮 HTML。
 */
import type { HighlighterCore } from 'shiki/core'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

/** 演示页用到的语言集合（按需再增），JS 正则引擎不支持的语言会走降级 */
const LANG_IMPORTS = {
    typescript: () => import('@shikijs/langs/typescript'),
    javascript: () => import('@shikijs/langs/javascript'),
    vue: () => import('@shikijs/langs/vue'),
    scss: () => import('@shikijs/langs/scss'),
    css: () => import('@shikijs/langs/css'),
    html: () => import('@shikijs/langs/html'),
    bash: () => import('@shikijs/langs/bash'),
    json: () => import('@shikijs/langs/json'),
} as const

type LangName = keyof typeof LANG_IMPORTS

/** 演示页的语言标识 → Shiki 语言（匹配不到返回 null，走纯文本降级） */
function normalizeLang(language: string): LangName | null {
    const map: Record<string, LangName> = {
        ts: 'typescript',
        typescript: 'typescript',
        js: 'javascript',
        javascript: 'javascript',
        vue: 'vue',
        scss: 'scss',
        css: 'css',
        html: 'html',
        bash: 'bash',
        sh: 'bash',
        shell: 'bash',
        json: 'json',
    }
    return map[language.trim().toLowerCase()] ?? null
}

let highlighterPromise: Promise<HighlighterCore> | null = null

function getHighlighter(): Promise<HighlighterCore> {
    highlighterPromise ??= createHighlighterCore({
        // dark-plus：与库代码块的恒定深色（#1e1e1e）同一套语言，两主题下观感一致
        themes: [import('@shikijs/themes/dark-plus')],
        langs: Object.values(LANG_IMPORTS).map((load) => load()),
        // forgiving：个别语法规则 JS 引擎不支持时降级为纯色，不抛错
        engine: createJavaScriptRegexEngine({ forgiving: true }),
    })
    return highlighterPromise
}

function escapeHtml(text: string): string {
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
}

/** ThemedToken.fontStyle 位标记（shiki types） */
const FONT_STYLE = { italic: 1, bold: 2, underline: 4 } as const

function tokenStyle(color: string | undefined, fontStyle: number | undefined): string {
    let style = `color:${color ?? 'inherit'}`
    if (fontStyle) {
        if (fontStyle & FONT_STYLE.italic) style += ';font-style:italic'
        if (fontStyle & FONT_STYLE.bold) style += ';font-weight:600'
        if (fontStyle & FONT_STYLE.underline) style += ';text-decoration:underline'
    }
    return style
}

/**
 * 代码 → 预高亮 HTML（仅 span + 内联样式，放进 DCodeBlock 的默认插槽）。
 * 语言不支持或高亮失败时返回 null，调用方降级为纯文本。
 */
export async function highlightToHtml(code: string, language: string): Promise<string | null> {
    const lang = normalizeLang(language)
    if (!lang || !code.trim()) return null
    try {
        const highlighter = await getHighlighter()
        const { tokens } = highlighter.codeToTokens(code, { lang, theme: 'dark-plus' })
        return tokens
            .map((line) => line
                .map((token) => `<span style="${tokenStyle(token.color, token.fontStyle)}">${escapeHtml(token.content)}</span>`)
                .join(''))
            .join('\n')
    } catch {
        // 高亮失败不影响内容展示，降级纯文本
        return null
    }
}
