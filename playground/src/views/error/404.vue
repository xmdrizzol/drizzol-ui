<template>
    <div class="not-found">
        <h1 class="not-found__title">404</h1>
        <p class="not-found__desc">页面不存在，请从左侧目录重新进入。</p>
        <d-button type="primary" @click="router.push('/')">返回总览</d-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped lang="scss">
.not-found {
    @include flex(center, center);
    flex-direction: column;
    gap: 12px;
    padding: 80px 0;

    &__title {
        margin: 0;
        font-size: 4rem;
        color: var(--dz-primary);
    }

    &__desc {
        margin: 0 0 12px;
        color: var(--dz-text-d);
    }
}
</style>
