<template>
    <div class="basic-demo">
        <demo-block title="DCard 卡片" anchor-id="fc-dcard"
            desc="容器基础组件：背景、边框、圆角、阴影由主题变量驱动；is-hover 开启悬浮上浮。"
            code='<d-card>内容</d-card>
<d-card is-hover>悬浮卡片</d-card>'>
            <d-card style="flex:1; min-width:240px">普通卡片</d-card>
            <d-card style="flex:1; min-width:240px" is-hover>悬浮卡片（hover 上浮）</d-card>
        </demo-block>

        <demo-block title="DButton 按钮" anchor-id="fc-dbutton"
            desc="六种形态组合：type / round / plain / link / block / size；支持图标。"
            code='<d-button type="primary" icon="dz-icon-add">主要按钮</d-button>
<d-button round>圆角按钮</d-button>
<d-button plain>朴素按钮</d-button>'>
            <d-button type="primary">主要按钮</d-button>
            <d-button>默认按钮</d-button>
            <d-button type="primary" round>圆角按钮</d-button>
            <d-button plain>朴素按钮</d-button>
            <d-button link>链接按钮</d-button>
            <d-button type="primary" size="small">小按钮</d-button>
            <d-button type="primary" icon="dz-icon-add">带图标</d-button>
        </demo-block>

        <demo-block title="DInput 输入框" anchor-id="fc-dinput"
            desc="text / password / textarea / number 四种类型，v-model 双向绑定。"
            code='<d-input v-model="text" placeholder="请输入" />
<d-input v-model="pwd" type="password" />'>
            <div class="basic-demo__stack">
                <div class="basic-demo__grid">
                    <d-input v-model="basic.text" placeholder="请输入文本" />
                    <d-input v-model="basic.password" type="password" placeholder="密码" />
                    <d-input v-model="basic.textarea" type="textarea" :rows="3" placeholder="多行文本" />
                </div>
                <p class="basic-demo__echo">当前值：{{ JSON.stringify(basic) }}</p>
            </div>
        </demo-block>

        <demo-block title="DForm 表单" anchor-id="fc-dform"
            desc="DForm + DFormItem 字段校验：required / min / max / validator，支持整体校验与重置。"
            code='<d-form :model="form" :rules="rules" ref="formRef">
  <d-form-item label="用户名" prop="name">
    <d-input v-model="form.name" />
  </d-form-item>
</d-form>
await formRef.value.validate()'>
            <div class="basic-demo__stack">
                <d-form :model="formModel" :rules="rules" ref="formRef" class="basic-demo__form">
                    <d-form-item label="用户名" prop="name">
                        <d-input v-model="formModel.name" placeholder="至少 2 个字符" />
                    </d-form-item>
                    <d-form-item label="简介" prop="bio">
                        <d-input v-model="formModel.bio" type="textarea" :rows="2" placeholder="2-10 个字符" />
                    </d-form-item>
                </d-form>
                <div class="basic-demo__row">
                    <d-button type="primary" @click="handleValidate">校验</d-button>
                    <d-button @click="handleReset">重置</d-button>
                </div>
            </div>
        </demo-block>

        <demo-block title="DModal 弹窗" anchor-id="fc-dmodal"
            desc="Teleport 到 body，过渡动画内建；maskClosable 控制点击遮罩关闭，footer 插槽自定义操作区。"
            code='<d-modal v-model:visible="visible" title="标题">内容</d-modal>'>
            <d-button type="primary" @click="modalVisible = true">打开弹窗</d-button>
            <d-modal v-model:visible="modalVisible" title="示例弹窗">
                弹窗内容区域，mask 点击可关闭。
                <template #footer>
                    <d-button @click="modalVisible = false">取消</d-button>
                    <d-button type="primary" @click="modalVisible = false">确定</d-button>
                </template>
            </d-modal>
        </demo-block>

        <demo-block title="DDropdown 下拉" anchor-id="fc-ddropdown"
            desc="click / hover 两种触发方式；菜单插槽自定义内容，gsap 过渡。"
            code='<d-dropdown trigger="click">
  <d-button>点击打开</d-button>
  <template #menu>...</template>
</d-dropdown>'>
            <div class="basic-demo__row">
                <d-dropdown trigger="click">
                    <d-button>点击打开</d-button>
                    <template #menu>
                        <div class="basic-demo__menu">纯文本项</div>
                        <div class="basic-demo__menu">也可以放任意内容</div>
                    </template>
                </d-dropdown>
                <d-dropdown trigger="hover">
                    <d-button>悬停打开</d-button>
                    <template #menu>
                        <div class="basic-demo__menu">悬停选项</div>
                    </template>
                </d-dropdown>
            </div>
        </demo-block>

        <demo-block title="DIcon 图标" anchor-id="fc-dicon"
            desc="内联 SVG 雪碧图（52 个符号，id 前缀 dz-icon-）；在根组件渲染一次 &lt;d-icon-sprite /&gt; 后任意使用。"
            code='<d-icon-sprite />  <!-- App.vue 根节点一次 -->
<d-icon name="dz-icon-fd-sunny" size="1.5" />'>
            <div class="basic-demo__icons">
                <div v-for="name in iconNames" :key="name" class="basic-demo__icon">
                    <d-icon :name="name" size="1.5" />
                    <span>{{ name }}</span>
                </div>
            </div>
        </demo-block>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import DemoBlock from '../components/demo-block.vue'

const basic = ref({ text: '', password: '', textarea: '' })

const formModel = ref({ name: '', bio: '' })
const rules = {
    name: { required: true, min: 2, message: '用户名至少 2 个字符' },
    bio: { required: true, min: 2, max: 10, message: '简介长度需在 2-10 个字符' },
}
const formRef = ref<{ validate: () => Promise<boolean>; resetFields: () => void }>()

async function handleValidate() {
    const valid = await formRef.value?.validate()
    ElMessage.success(valid ? '校验通过' : '校验失败，请检查表单')
}

function handleReset() {
    formRef.value?.resetFields()
    formModel.value = { name: '', bio: '' }
}

const modalVisible = ref(false)

const iconNames = [
    'dz-icon-user', 'dz-icon-heart', 'dz-icon-star', 'dz-icon-menu', 'dz-icon-close',
    'dz-icon-arrow-forward', 'dz-icon-arrow-dropup', 'dz-icon-fd-sunny', 'dz-icon-fd-moon',
    'dz-icon-fd-rocket', 'dz-icon-fd-book', 'dz-icon-fd-gamepad',
]
</script>

<style scoped lang="scss">
.basic-demo {
    &__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &__row {
        @include flex(flex-start, center);
        gap: 12px;
        flex-wrap: wrap;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
    }

    &__echo {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }

    &__form {
        max-width: 520px;
    }

    &__menu {
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
            background: var(--dz-bg-secondary);
            color: var(--dz-primary);
        }
    }

    &__icons {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
    }

    &__icon {
        @include flex(center, center);
        flex-direction: column;
        gap: 6px;
        width: 92px;
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
}
</style>
