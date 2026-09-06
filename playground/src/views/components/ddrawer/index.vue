<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DDrawer<span class="component-page__tag">@drizzol/ui</span></h1>
            <p class="component-page__desc">
                抽屉：从右 / 左 / 上 / 下四个方向滑出，<code>v-model:visible</code> 开合，Esc / 遮罩 / 关闭按钮均可关闭，
                支持 <code>before-close</code> 关闭前回调、header / footer 插槽与嵌套。
            </p>
        </header>

        <demo-block title="基本用法" anchor-id="demo1"
            code="<d-drawer v-model:visible=&quot;basic&quot; title=&quot;我是标题&quot;>
  <span>Hi, there!</span>
</d-drawer>">
            <d-button type="primary" @click="basic = true">点我打开</d-button>
            <d-drawer v-model:visible="basic" title="我是标题">
                <span>Hi, there!</span>
            </d-drawer>
        </demo-block>

        <demo-block title="自定义内容" anchor-id="demo2"
            desc="header 插槽自定义标题，正文用 DForm/DInput 组合，footer 放操作按钮；before-close 在关闭前做确认。"
            code="<d-drawer v-model:visible=&quot;formVisible&quot; :before-close=&quot;handleBeforeClose&quot;>
  <template #header>…</template>
  <d-form …>…</d-form>
  <template #footer>…</template>
</d-drawer>">
            <d-button type="primary" @click="formVisible = true">打开自定义内容抽屉</d-button>
            <d-drawer v-model:visible="formVisible" size="460px" :before-close="handleBeforeClose">
                <template #header>
                    <span class="dfb-form-header">新建资料</span>
                </template>
                <d-form ref="formRef" :model="form" :rules="formRules">
                    <d-form-item label="名称" prop="name">
                        <d-input v-model="form.name" placeholder="请输入名称" />
                    </d-form-item>
                    <d-form-item label="地址" prop="area">
                        <d-input v-model="form.area" placeholder="请输入地址" />
                    </d-form-item>
                </d-form>
                <template #footer>
                    <d-button @click="formVisible = false">取 消</d-button>
                    <d-button type="primary" @click="send">发 送</d-button>
                </template>
            </d-drawer>
        </demo-block>

        <demo-block title="多抽屉和嵌套" anchor-id="demo3"
            desc="抽屉可打开另一层抽屉；Esc 只关闭最上层，不会连带关闭外层。"
            code="<d-drawer v-model:visible=&quot;outer&quot; title=&quot;外层抽屉&quot;>
  <d-button @click=&quot;inner = true&quot;>打开内层抽屉</d-button>
</d-drawer>
<d-drawer v-model:visible=&quot;inner&quot; title=&quot;内层抽屉&quot; size=&quot;320px&quot;>…</d-drawer>">
            <d-button type="primary" @click="outer = true">打开外层抽屉</d-button>
            <d-drawer v-model:visible="outer" title="外层抽屉">
                <p style="margin: 0 0 16px">这是外层抽屉，内层抽屉会叠在它上方。</p>
                <d-button @click="inner = true">打开内层抽屉</d-button>
            </d-drawer>
            <d-drawer v-model:visible="inner" title="内层抽屉" size="320px">
                <p style="margin: 0">内层抽屉：按 Esc 只会关闭这一层。</p>
            </d-drawer>
        </demo-block>

        <demo-block title="自定义尺寸与位置" anchor-id="demo4"
            desc="direction 控制滑出方向，size 在横向抽屉时为宽度、纵向抽屉时为高度（数字 px / 百分比均可）。"
            code="<d-drawer v-model:visible=&quot;custom&quot; direction=&quot;btt&quot; size=&quot;40%&quot;>…</d-drawer>">
            <div class="demo-block__stack">
                <div class="component-page__row">
                    <d-button v-for="d in directions" :key="d.value" size="small"
                        :type="direction === d.value ? 'primary' : 'default'" @click="direction = d.value">
                        {{ d.label }}
                    </d-button>
                    <d-tag type="info">方向：{{ direction }} · 尺寸：{{ size }}</d-tag>
                </div>
                <div class="component-page__row">
                    <d-input v-model="size" placeholder="420px 或 40%" style="max-width: 200px" />
                    <d-button type="primary" @click="custom = true">打开抽屉</d-button>
                </div>
            </div>
            <d-drawer v-model:visible="custom" :direction="direction" :size="size" title="自定义尺寸与位置">
                <p style="margin: 0">方向 {{ direction }} · 尺寸 {{ size }}</p>
            </d-drawer>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { DMessage, DConfirm } from '@drizzol/ui'
import DemoBlock from '@/components/demo-block'

// 基本用法
const basic = ref(false)

// 自定义内容：表单 + before-close 关闭确认
const formVisible = ref(false)
const form = reactive({ name: '', area: '' })
const formRules = {
    name: { required: true, requiredMessage: '请输入名称' },
    area: { required: true, requiredMessage: '请输入地址' },
}
const formRef = ref()

function handleBeforeClose(done: () => void) {
    DConfirm('内容尚未保存，确定关闭吗？', '关闭确认', {
        type: 'warning',
        confirmButtonText: '直接关闭',
        cancelButtonText: '继续编辑',
    })
        .then(() => done())
        .catch(() => {})
}

function send() {
    formRef.value?.validate().then((valid: boolean) => {
        if (valid) {
            DMessage.success('已发送')
            formVisible.value = false
        }
    })
}

// 多抽屉和嵌套
const outer = ref(false)
const inner = ref(false)

// 自定义尺寸与位置
const custom = ref(false)
const direction = ref<'rtl' | 'ltr' | 'ttb' | 'btt'>('rtl')
const size = ref('40%')
const directions = [
    { value: 'rtl', label: '右侧' },
    { value: 'ltr', label: '左侧' },
    { value: 'ttb', label: '顶部' },
    { value: 'btt', label: '底部' },
] as const
</script>
