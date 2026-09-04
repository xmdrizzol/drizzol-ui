<template>
    <div class="home">
        <section class="home__hero">
            <p class="home__kicker">DRIZZOL UI · VUE 3</p>
            <h1 class="home__title">组件、工具与主题的<br />统一基准</h1>
            <p class="home__desc">Vue 3 组件库 —— 16+ 组件、工具函数、深浅双主题样式体系，开箱即用。</p>
            <div class="home__badges">
                <span v-for="b in badges" :key="b" class="home__badge">{{ b }}</span>
            </div>
        </section>

        <div class="home__features">
            <d-card v-for="item in features" :key="item.title" is-hover>
                <d-icon :name="item.icon" size="1.6" class="home__feature-icon" />
                <h3 class="home__feature-title">{{ item.title }}</h3>
                <p class="home__feature-desc">{{ item.desc }}</p>
            </d-card>
        </div>

        <d-card class="home__usage">
            <h3>快速开始</h3>
            <pre class="home__code"><code>{{ code }}</code></pre>
            <p class="home__note">
                顶部导航查看<strong>主题色板</strong>、<strong>基础组件</strong>与<strong>增强组件</strong>示例；
                组件清单与开发约定见仓库 README 与 CLAUDE.md。
            </p>
        </d-card>
    </div>
</template>

<script setup lang="ts">
const badges = ['Vue 3.5', 'TypeScript', 'Vite', 'Element Plus', 'CSS 变量双主题']

const features = [
    { icon: 'dz-icon-fd-paw', title: '16+ 组件', desc: 'DCard/DButton/DForm/DModal/DUpload/DCropper/DVideo 等，全部 D 前缀、--dz-* 变量。' },
    { icon: 'dz-icon-fd-moon', title: '深浅双主题', desc: 'CSS 变量双色板 + <html class="dark"> 切换，跟随系统或手动三态。' },
    { icon: 'dz-icon-fd-cafe', title: '工具函数', desc: 'request 拦截器、theme、cookie、pxToRem、debounce、文件访问等开箱即用。' },
    { icon: 'dz-icon-fd-glasses', title: '可测试', desc: 'vitest 单测 + 组件挂载冒烟，pre-commit 自动回归。' },
]

const code = [
    "npm i @drizzol/ui element-plus vue",
    "",
    "// main.ts",
    "import DrizzolUi from '@drizzol/ui'",
    "import '@drizzol/ui/style.css'",
    "app.use(DrizzolUi) // 全量注册",
    "",
    "// App.vue 根节点渲染一次雪碧图",
    "<d-icon-sprite />",
].join('\n')
</script>

<style scoped lang="scss">
.home {
    &__hero {
        position: relative;
        overflow: hidden;
        padding: 56px 40px;
        margin-bottom: 28px;
        border: 1px solid var(--dz-border);
        border-radius: 16px;
        background:
            radial-gradient(120% 160% at 90% -20%, var(--dz-primary-hover-2) 0%, transparent 55%),
            radial-gradient(90% 120% at 10% 130%, color-mix(in srgb, var(--dz-primary-6) 12%, transparent) 0%, transparent 50%),
            var(--dz-bg-secondary);
    }

    &__kicker {
        margin: 0;
        font-size: 0.75rem;
        letter-spacing: 4px;
        color: var(--dz-primary);
        font-weight: 600;
    }

    &__title {
        margin: 14px 0 10px;
        font-size: clamp(1.75rem, 4vw, 2.5rem);
        line-height: 1.25;
        color: var(--dz-text-h);
        letter-spacing: 1px;
    }

    &__desc {
        margin: 0;
        max-width: 520px;
        color: var(--dz-text-d);
        font-size: 0.9375rem;
    }

    &__badges {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 18px;
    }

    &__badge {
        padding: 3px 10px;
        border: 1px solid var(--dz-border);
        border-radius: 99px;
        background: var(--dz-bg);
        font-size: 0.75rem;
        font-family: var(--dz-ff-mono);
        color: var(--dz-text-d);
    }

    &__features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
    }

    &__feature-icon {
        color: var(--dz-primary);
        margin-bottom: 10px;
    }

    &__feature-title {
        margin: 0 0 8px;
        font-size: 1.125rem;
        color: var(--dz-text-h);
    }

    &__feature-desc {
        margin: 0;
        font-size: 0.875rem;
        line-height: 1.7;
        color: var(--dz-text-d);
    }

    &__code {
        margin: 12px 0;
        padding: 16px;
        border-radius: 8px;
        background: var(--dz-bg-secondary);
        overflow-x: auto;
        font-family: var(--dz-ff-mono);
        font-size: 0.875rem;
        line-height: 1.7;
        color: var(--dz-text);
    }

    &__note {
        margin: 0;
        color: var(--dz-text-l);
        font-size: 0.875rem;
    }
}
</style>
