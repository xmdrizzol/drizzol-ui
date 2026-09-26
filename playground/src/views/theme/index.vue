<template>
    <div class="theme-demo">
        <h1 class="theme-demo__title">主题色板</h1>
        <p class="theme-demo__hint">点击右上角主题按钮切换 <code>浅色 / 深色 / 跟随系统</code>，色板与语义变量全部基于 <code>--dz-*</code> CSS 变量。</p>

        <section v-for="group in palettes" :key="group.name" class="theme-demo__section">
            <h2>{{ group.name }}</h2>
            <div class="theme-demo__grid">
                <div
                    v-for="n in 10"
                    :key="n"
                    class="theme-demo__item"
                    :style="{ background: `var(--${group.varName}-${n})` }"
                >
                    <span class="theme-demo__item-label">{{ `--${group.varName}-${n}` }}</span>
                    <span class="theme-demo__item-code"></span>
                </div>
            </div>
        </section>

        <section class="theme-demo__section">
            <h2>排版基础（全局内容排版语系）</h2>
            <div class="theme-demo__type">
                <h1>标题一 h1 — 22px</h1>
                <h2>标题二 h2 — 19px（章节锚点）</h2>
                <h3>标题三 h3 — 17px</h3>
                <h4>标题四 h4 — 16px</h4>
                <h5>标题五 h5 — 15px</h5>
                <h6>标题六 h6 — 14px</h6>
                <p>
                    段落 p：行高 <code>--dz-line-height: 1.8</code>；<small>小字 small</small>、
                    <strong>强调 strong</strong>、<kbd>Ctrl + K</kbd>、行内代码
                    <code>const x = 1</code>。
                </p>
                <ul>
                    <li>无序列表：圆点使用主色</li>
                    <li>行距节奏与正文一致</li>
                </ul>
                <blockquote>引用：半透明主色罩 + 左侧主色条（内容排版同款）。</blockquote>
                <d-code-block language="ts" :code="codeSample" />
                <table>
                    <thead>
                        <tr><th>表头 th</th><th>斑马纹</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>奇数行 td</td><td>背景为页面底</td></tr>
                        <tr><td>偶数行 td</td><td>背景为 --dz-bg-secondary</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="theme-demo__section">
            <h2>语义变量</h2>
            <ul class="theme-demo__list">
                <li v-for="name in semanticVars" :key="name" class="theme-demo__list-item">
                    <span class="theme-demo__swatch" :style="{ background: `var(${name})` }"></span>
                    <code class="theme-demo__var-name">{{ name }}</code>
                </li>
            </ul>
        </section>

        <section class="theme-demo__section">
            <h2>语义色三元组（浅底 / 罩层用）</h2>
            <p class="theme-demo__hint">
                写法 <code>rgba(var(--dz-&lt;名&gt;-rgb), &lt;alpha&gt;)</code>：最低支持 Chrome 86 无 <code>color-mix()</code>，
                浅底、描边、hover 罩层都用三元组表达。<strong>改语义色时必须与 <code>--dz-&lt;名&gt;</code> 成对同步</strong>，否则浅底会停在旧色。
            </p>
            <ul class="theme-demo__list">
                <li v-for="name in rgbVars" :key="name" class="theme-demo__list-item">
                    <span class="theme-demo__swatch" :style="{ background: `rgba(var(${name}), 0.5)` }"></span>
                    <code class="theme-demo__var-name">{{ name }}</code>
                </li>
            </ul>
        </section>

        <section class="theme-demo__section">
            <h2>阴影与遮罩</h2>
            <div class="theme-demo__grid theme-demo__grid--shadows">
                <div
                    v-for="name in shadowVars"
                    :key="name"
                    class="theme-demo__shadow"
                    :style="{ boxShadow: `var(${name})` }"
                >
                    <code>{{ name }}</code>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
const palettes = [
    { name: 'Primary 色板（10 级）', varName: 'dz-primary' },
    { name: 'Gray 色板（10 级）', varName: 'dz-gray' },
]

const semanticVars = [
    '--dz-primary', '--dz-primary-hover', '--dz-primary-hover-2', '--dz-primary-active',
    '--dz-text-h', '--dz-text', '--dz-text-d', '--dz-text-l',
    '--dz-bg', '--dz-bg-secondary', '--dz-border', '--dz-code-bg',
    '--dz-link', '--dz-link-hover', '--dz-link-visited', '--dz-mask',
]

const shadowVars = [
    '--dz-shadow-sm', '--dz-shadow-md', '--dz-shadow-lg', '--dz-shadow-xl', '--dz-shadow-xxl',
]

/** 语义色 RGB 三元组（浅底/罩层用，见 README「浏览器兼容性」） */
const rgbVars = [
    '--dz-primary-rgb', '--dz-success-rgb', '--dz-warning-rgb', '--dz-danger-rgb',
    '--dz-gray-7-rgb', '--dz-gray-9-rgb', '--dz-bg-rgb',
]

/** 排版基础区的代码块示例 */
const codeSample = `// 深色代码块（#1e1e1e，与 shiki dark-plus 一致）
const hello = 'Drizzol UI'`
</script>

<style scoped lang="scss">
.theme-demo {
    &__title {
        margin: 0 0 8px;
        color: var(--dz-text-h);
    }

    &__hint {
        margin: 0 0 24px;
        color: var(--dz-text-d);

        code {
            background: var(--dz-bg-secondary);
            padding: 2px 6px;
            border-radius: 4px;
        }
    }

    &__section {
        margin-bottom: 32px;

        h2 {
            margin: 0 0 12px;
            font-size: 1.125rem;
            color: var(--dz-text-h);
        }
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 8px;

        &--shadows {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
    }

    &__item {
        @include flex(center, flex-start);
        flex-direction: column;
        justify-content: flex-end;
        height: 72px;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid var(--dz-border);

        &-label {
            font-size: 0.72rem;
            padding: 2px 6px;
            border-radius: 4px;
            color: #fff;
            background: rgba(0, 0, 0, 0.45);
            text-shadow: none;
        }
    }

    &__list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 8px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    &__list-item {
        @include flex(flex-start, center);
        gap: 10px;
    }

    &__swatch {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        border: 1px solid var(--dz-border);
        flex-shrink: 0;
    }

    &__var-name {
        font-size: 0.8125rem;
        color: var(--dz-text-d);
    }

    &__shadow {
        height: 72px;
        border-radius: 8px;
        background: var(--dz-bg-secondary);
        @include flex(center, center);

        code {
            font-size: 0.75rem;
            color: var(--dz-text-l);
        }
    }

    &__type {
        padding: 20px 24px;
        border: 1px solid var(--dz-border);
        border-radius: 12px;
        background: var(--dz-bg-secondary);
    }
}
</style>
