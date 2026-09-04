<template>
    <main class="d-main">
        <slot />
    </main>
</template>

<script setup lang="ts">
// 内容区：占满剩余空间
</script>

<style scoped lang="scss">
.d-main {
    flex: 1;
    min-width: 0;
    overflow: auto;
    background: var(--dz-bg);
    padding: 20px;
    box-sizing: border-box;
}
</style>
