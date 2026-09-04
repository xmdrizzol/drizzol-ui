<template>
    <div class="d-search">
        <input v-model="keyword" class="d-search__input" :placeholder="placeholder"
            @keyup.enter="onEnter" />
        <button v-if="keyword" class="d-search__clear" @click="onClear">&times;</button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from '@ui/utils/throttle-debounce'

withDefaults(defineProps<{
    placeholder?: string
}>(), {
    placeholder: '搜索...',
})

const emit = defineEmits<{
    search: [keyword: string]
}>()

const keyword = ref('')

const debouncedSearch = debounce((val: string) => {
    emit('search', val)
}, 300)

watch(keyword, (val) => {
    debouncedSearch(val)
})

function onEnter() {
    emit('search', keyword.value)
}

function onClear() {
    keyword.value = ''
    emit('search', '')
}
</script>

<style scoped lang="scss">
.d-search {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 360px;

    &__input {
        width: 100%;
        padding: 8px 32px 8px 12px;
        border: 1px solid var(--dz-border);
        border-radius: 6px;
        font-size: 14px;
        color: var(--dz-text);
        background: var(--dz-bg);
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s;

        &:focus {
            border-color: var(--dz-primary);
        }

        &::placeholder {
            color: var(--dz-text-l);
        }
    }

    &__clear {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        border: none;
        background: none;
        font-size: 18px;
        color: var(--dz-text-l);
        cursor: pointer;
        padding: 0 4px;
        line-height: 1;

        &:hover {
            color: var(--dz-text);
        }
    }
}
</style>
