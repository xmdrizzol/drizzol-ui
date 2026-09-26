<template>
    <div class="component-page">
        <header class="component-page__head">
            <h1 class="component-page__title">DUpload<span class="component-page__tag">@xmdrizzol/drizzol-ui</span></h1>
            <p class="component-page__desc">上传组件：点击选择文件 → POST 上传接口（演示站配置为 /api/general/file/upload，字段 File + CustomCategory）→ 进度通知；支持取消、多文件、预览。上传地址由宿主配置（库源码不内置）：全局 configureFileApi({ uploadUrl })，或组件传 action。</p>
        </header>

        <demo-block title="基础用法" anchor-id="demo"
            code='<d-upload v-model="fileRef" accept="image/*" category="image" />

<!-- 自定义上传地址（优先级：action > configureFileApi 全局 > 默认契约） -->
<d-upload v-model="fileRef" action="/my/avatar/upload" />'>
            <div class="component-page__row">
                <d-upload v-model="uploadRef" accept="image/*" category="image" />
                <p class="component-page__echo">modelValue：{{ uploadRef || '（未选择）' }}</p>
            </div>
        </demo-block>

        <demo-block title="上传进度通知" anchor-id="notify"
            desc="showUploadNotification 可独立于 DUpload 使用（自行封装上传逻辑/直传场景时复用）：标题行走通知默认头部，正文为进度条 + 百分比；点 ✕ 先确认再触发 onCancel；不传 onCancel 则不出 ✕（纯进度展示，由调用方 close() 收尾）。可连续点击，多个通知独立堆叠。"
            :code="notifyDoc">
            <div class="component-page__row">
                <d-button type="primary" @click="simulate(false)">模拟上传（可取消）</d-button>
                <d-button @click="simulate(true)">纯进度展示（无取消）</d-button>
            </div>
            <p class="component-page__echo">
                实现基于 DNotification 的 VNode 正文（机制与手写方式见
                <router-link to="/components/dnotification">DNotification 演示页 · VNode 正文</router-link>）。
            </p>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '@/components/demo-block'
import { showUploadNotification } from '@xmdrizzol/drizzol-ui'

const uploadRef = ref('')

// 进度模拟：每次调用生成一个独立通知（多个可堆叠），各自持有计时器与句柄；
// 确认取消后停止自己的计时器；到 100% 由调用方 close() 收尾
function simulate(bare: boolean) {
    let timer: ReturnType<typeof setInterval> | undefined
    let percent = 0
    const control = showUploadNotification({
        title: 'campus-photo-2026.zip',
        // 不传 onCancel：不出 ✕（纯进度展示）
        ...(bare ? {} : {
            onCancel: () => {
                if (timer) clearInterval(timer)
            },
        }),
    })
    timer = setInterval(() => {
        percent = Math.min(100, percent + Math.ceil(Math.random() * 12))
        control.update(percent)
        if (percent >= 100) {
            clearInterval(timer)
            // 上传完成由调用方 close()（纯进度模式没有 ✕，更依赖这一步收尾）
            setTimeout(() => control.close(), 500)
        }
    }, 260)
}

const notifyDoc = `import { showUploadNotification } from '@xmdrizzol/drizzol-ui'

const control = showUploadNotification({
  title: 'campus-photo-2026.zip',   // 通知标题（默认"文件上传"）
  // 可选：不传则纯进度展示（无 ✕）；确认弹窗（取消上传/继续上传）确认后触发
  onCancel: () => xhr.abort(),
})

// onUploadProgress 里实时更新（超出 0-100 自动收敛并取整）
control.update(62)

// 上传完成由调用方关闭
control.close()`
</script>

<style scoped lang="scss">
.component-page {
    &__row {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
    }

    &__echo {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }
}
</style>
