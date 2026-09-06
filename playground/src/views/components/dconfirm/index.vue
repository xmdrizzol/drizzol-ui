<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DConfirm<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">
                命令式确认框：基于 DModal，确定返回 <code>resolve('confirm')</code>、取消
                <code>reject('cancel')</code>，语义对齐 ElMessageBox.confirm，then/catch 写法直接迁移。
            </p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code="import { DConfirm } from '@drizzol/ui'
DConfirm('确定删除吗？', '删除', { type: 'warning' })
  .then(() => doDelete())
  .catch(() => {})">
            <div class="demo-block__stack">
                <div class="component-page__row">
                    <d-button type="primary" @click="askDelete">删除记录（弹确认框）</d-button>
                </div>
                <d-tag v-if="result" :type="result === '已确认删除' ? 'danger' : 'info'">结果：{{ result }}</d-tag>
            </div>
        </demo-block>

        <demo-block title="自定义按钮文案" anchor-id="custom"
            code="DConfirm('确定要取消当前上传吗？', '取消上传', {
  type: 'warning',
  confirmButtonText: '取消上传',
  cancelButtonText: '继续上传',
})">
            <div class="demo-block__stack">
                <div class="component-page__row">
                    <d-button @click="askCancel">取消上传（自定义文案）</d-button>
                </div>
                <d-tag v-if="cancelResult" type="info">结果：{{ cancelResult }}</d-tag>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DConfirm } from '@drizzol/ui'
import DemoBlock from '@/components/demo-block'

const result = ref('')
function askDelete() {
    DConfirm('确定要删除这条记录吗？删除后不可恢复。', '删除', {
        type: 'warning',
        confirmButtonText: '删 除',
        cancelButtonText: '取 消',
    })
        .then(() => { result.value = '已确认删除' })
        .catch(() => { result.value = '已取消' })
}

const cancelResult = ref('')
function askCancel() {
    DConfirm('确定要取消当前上传吗？', '取消上传', {
        type: 'warning',
        confirmButtonText: '取消上传',
        cancelButtonText: '继续上传',
    })
        .then(() => { cancelResult.value = '已取消上传' })
        .catch(() => { cancelResult.value = '继续上传' })
}
</script>

