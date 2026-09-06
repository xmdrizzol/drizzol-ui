<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DIcon<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">图标组件：内联 SVG 雪碧图（id 前缀 dz-icon-）；在根组件渲染一次 &lt;d-icon-sprite /&gt; 后任意使用。下方列表由雪碧图实时读取，共 {{ iconNames.length }} 个。</p>
        </header>

        <demo-block title="图标列表" anchor-id="demo"
            code='<d-icon-sprite />  <!-- App.vue 根节点一次 -->
<d-icon name="fd-sunny" size="1.5" />'>
            <div class="component-page__stack">
                <d-search placeholder="搜索图标名，如 star / moon / book" @search="onSearch" />
                <div class="component-page__icons">
                    <div v-for="name in filteredIcons" :key="name" class="component-page__icon">
                        <d-icon :name="name" size="1.5" />
                        <span>{{ name }}</span>
                    </div>
                </div>
                <p class="component-page__echo">共 {{ iconNames.length }} 个图标，当前显示 {{ filteredIcons.length }} 个。</p>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DemoBlock from '@/components/demo-block'

const iconNames = ref<string[]>([])
const keyword = ref('')

// 从雪碧图实时读取全部 symbol id，保证列表与库内图标一致（无需手工维护）
onMounted(() => {
    iconNames.value = Array.from(document.querySelectorAll('symbol[id^="dz-icon-"]'))
        .map(el => el.id.replace('dz-icon-', ''))
})

const filteredIcons = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    if (!kw) return iconNames.value
    return iconNames.value.filter(name => name.includes(kw))
})

function onSearch(val: string) {
    keyword.value = val
}
</script>

<style scoped lang="scss">
.component-page {
    &__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &__icons {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
    }

    &__icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        width: 96px;
        padding: 12px 4px;
        border: 1px solid var(--dz-border);
        border-radius: 8px;
        background: var(--dz-bg);

        span {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.68rem;
            color: var(--dz-text-l);
        }
    }

    &__echo {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
    }
}
</style>
