<template>
    <div class="basic-demo">
        <h1 class="basic-demo__title">基础组件</h1>

        <section class="basic-demo__section">
            <h2>Cards 卡片</h2>
            <div class="basic-demo__row">
                <d-card style="flex:1">普通卡片（d-card）</d-card>
                <d-card style="flex:1" is-hover>悬浮卡片（is-hover，hover 上浮）</d-card>
            </div>
        </section>

        <section class="basic-demo__section">
            <h2>Buttons 按钮</h2>
            <div class="basic-demo__row">
                <d-button type="primary">主要按钮</d-button>
                <d-button>默认按钮</d-button>
                <d-button type="primary" round>圆角按钮</d-button>
                <d-button plain>朴素按钮</d-button>
                <d-button link>链接按钮</d-button>
                <d-button type="primary" size="small">小按钮</d-button>
                <d-button type="primary" icon="dz-icon-add">带图标</d-button>
            </div>
        </section>

        <section class="basic-demo__section">
            <h2>Inputs 输入框</h2>
            <div class="basic-demo__grid">
                <d-input v-model="basic.text" placeholder="请输入文本" />
                <d-input v-model="basic.password" type="password" placeholder="密码" />
                <d-input v-model="basic.textarea" type="textarea" :rows="3" placeholder="多行文本" />
            </div>
            <p class="basic-demo__echo">当前值：{{ JSON.stringify(basic) }}</p>
        </section>

        <section class="basic-demo__section">
            <h2>Forms 表单校验</h2>
            <d-card class="basic-demo__form">
                <d-form :model="formModel" :rules="rules" ref="formRef">
                    <d-form-item label="用户名" prop="name">
                        <d-input v-model="formModel.name" placeholder="至少 2 个字符" />
                    </d-form-item>
                    <d-form-item label="简介" prop="bio">
                        <d-input v-model="formModel.bio" type="textarea" :rows="2" placeholder="最多 10 个字符" />
                    </d-form-item>
                </d-form>
                <div class="basic-demo__row">
                    <d-button type="primary" @click="handleValidate">校验</d-button>
                    <d-button @click="handleReset">重置</d-button>
                </div>
            </d-card>
        </section>

        <section class="basic-demo__section">
            <h2>Modal 弹窗</h2>
            <d-button type="primary" @click="modalVisible = true">打开弹窗</d-button>
            <d-modal v-model:visible="modalVisible" title="示例弹窗">
                弹窗内容区域，mask 点击可关闭。
                <template #footer>
                    <d-button @click="modalVisible = false">取消</d-button>
                    <d-button type="primary" @click="modalVisible = false">确定</d-button>
                </template>
            </d-modal>
        </section>

        <section class="basic-demo__section">
            <h2>Dropdown 下拉</h2>
            <div class="basic-demo__row">
                <d-dropdown trigger="click">
                    <d-button>点击打开</d-button>
                    <template #menu>
                        <div class="basic-demo__menu">选项一</div>
                        <div class="basic-demo__menu">选项二</div>
                    </template>
                </d-dropdown>
                <d-dropdown trigger="hover">
                    <d-button>悬停打开</d-button>
                    <template #menu>
                        <div class="basic-demo__menu">悬停选项</div>
                    </template>
                </d-dropdown>
            </div>
        </section>

        <section class="basic-demo__section">
            <h2>Search 搜索 & Sort 排序</h2>
            <d-card class="basic-demo__form">
                <d-search placeholder="搜索（防抖 300ms）" @search="onSearch" />
                <p class="basic-demo__echo">搜索词：{{ searchWord || '（空）' }}</p>
                <d-sort v-model="sortModel" :sort-options="sortOptions" :status-options="statusOptions" show-admin />
                <p class="basic-demo__echo">排序值：{{ JSON.stringify(sortModel) }}</p>
            </d-card>
        </section>

        <section class="basic-demo__section">
            <h2>Icons 图标</h2>
            <div class="basic-demo__icons">
                <div v-for="name in iconNames" :key="name" class="basic-demo__icon">
                    <d-icon :name="name" size="1.5" />
                    <span>{{ name }}</span>
                </div>
            </div>
        </section>

        <!-- 滚动此页至底部可见：右上角出现返回顶部按钮 -->
        <d-float-bar show-catalog catalog-tooltip="目录" @catalog="onCatalog" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

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

const searchWord = ref('')
function onSearch(keyword: string) {
    searchWord.value = keyword
}

const sortModel = ref({ sortBy: 'createdAt', desc: true, dateStart: '', dateEnd: '', status: '' })
const sortOptions = [
    { field: 'createdAt', label: '创建时间' },
    { field: 'updatedAt', label: '更新时间' },
]
const statusOptions = [
    { value: '', label: '全部' },
    { value: 'published', label: '已发布' },
    { value: 'draft', label: '草稿' },
]

function onCatalog() {
    ElMessage.info('目录事件（示例）')
}

const iconNames = [
    'dz-icon-user', 'dz-icon-heart', 'dz-icon-star', 'dz-icon-menu', 'dz-icon-close',
    'dz-icon-arrow-forward', 'dz-icon-arrow-dropup', 'dz-icon-fd-sunny', 'dz-icon-fd-moon',
    'dz-icon-fd-rocket', 'dz-icon-fd-book', 'dz-icon-fd-gamepad',
]
</script>

<style scoped lang="scss">
.basic-demo {
    &__title {
        margin: 0 0 8px;
        color: var(--dz-text-h);
    }

    &__section {
        margin-bottom: 36px;

        h2 {
            margin: 0 0 12px;
            font-size: 1.125rem;
            color: var(--dz-text-h);
        }
    }

    &__row {
        @include flex(flex-start, center);
        gap: 12px;
        flex-wrap: wrap;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 12px;
    }

    &__echo {
        margin: 10px 0 0;
        font-size: 0.8125rem;
        color: var(--dz-text-l);
        word-break: break-all;
    }

    &__form {
        max-width: 640px;
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
        gap: 20px;
    }

    &__icon {
        @include flex(center, center);
        flex-direction: column;
        gap: 6px;
        width: 86px;
        padding: 12px 4px;
        border: 1px solid var(--dz-border);
        border-radius: 8px;

        span {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.7rem;
            color: var(--dz-text-l);
        }
    }
}
</style>
