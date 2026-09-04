<template>
    <div class="d-sort">
        <!-- 排序字段 -->
        <div class="d-sort__item">
            <label class="d-sort__label">排序：</label>
            <select class="d-sort__select" :value="model.sortBy"
                @change="setField('sortBy', ($event.target as HTMLSelectElement).value)">
                <option v-for="opt in sortOptions" :key="opt.field" :value="opt.field">{{ opt.label }}</option>
            </select>
            <button class="d-sort__dir-btn" @click="toggleDesc">
                <d-icon :name="model.desc ? 'arrow-dropdown' : 'arrow-dropup'" size="0.8" />
            </button>
        </div>

        <!-- 创建时间范围 -->
        <div class="d-sort__item">
            <label class="d-sort__label">时间：</label>
            <input type="date" class="d-sort__date" :value="model.dateStart"
                @change="setField('dateStart', ($event.target as HTMLInputElement).value)" />
            <span class="d-sort__separator">至</span>
            <input type="date" class="d-sort__date" :value="model.dateEnd"
                @change="setField('dateEnd', ($event.target as HTMLInputElement).value)" />
        </div>

        <!-- 状态筛选（管理员，选项由宿主传入） -->
        <div v-if="showAdmin && statusOptions?.length" class="d-sort__item">
            <label class="d-sort__label">状态：</label>
            <select class="d-sort__select" :value="model.status"
                @change="setField('status', ($event.target as HTMLSelectElement).value)">
                <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
        </div>

    </div>
</template>

<script setup lang="ts">
import DIcon from '@ui/components/icon'
import type { SortFilterParams, SortStatusOption } from './index'

defineProps<{
    sortOptions: { field: string; label: string }[]
    /** 状态筛选选项（需配合 showAdmin） */
    statusOptions?: SortStatusOption[]
    showAdmin?: boolean
}>()

const model = defineModel<SortFilterParams>({
    default: () => ({
        sortBy: 'createdAt',
        desc: true,
        dateStart: '',
        dateEnd: '',
        status: '',
    })
})

function toggleDesc() {
    model.value = { ...model.value, desc: !model.value.desc }
}

function setField(key: keyof SortFilterParams, value: string) {
    model.value = { ...model.value, [key]: value }
}
</script>

<style scoped lang="scss">
@use '@ui/styles/mixin' as *;

.d-sort {
    @include flex(flex-start, center);
    gap: 16px;
    flex-wrap: wrap;

    &__item {
        @include flex(flex-start, center);
        gap: 6px;
    }

    &__label {
        font-size: 13px;
        color: var(--dz-text-d);
        white-space: nowrap;
    }

    &__select {
        height: 32px;
        padding: 0 8px;
        border: 1px solid var(--dz-border);
        border-radius: 6px;
        background: var(--dz-bg);
        color: var(--dz-text);
        font-size: 13px;
        cursor: pointer;
        outline: none;
        transition: border-color 0.2s;

        &:focus {
            border-color: var(--dz-primary);
        }
    }

    &__dir-btn {
        @include flex(center, center);
        width: 28px;
        height: 28px;
        padding: 0;
        border: 1px solid var(--dz-border);
        border-radius: 6px;
        background: var(--dz-bg);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            border-color: var(--dz-primary);
        }

        svg {
            color: var(--dz-text-d);
        }
    }

    &__date {
        height: 32px;
        padding: 0 8px;
        border: 1px solid var(--dz-border);
        border-radius: 6px;
        background: var(--dz-bg);
        color: var(--dz-text);
        font-size: 13px;
        outline: none;
        transition: border-color 0.2s;

        &:focus {
            border-color: var(--dz-primary);
        }

        &::-webkit-calendar-picker-indicator {
            filter: var(--date-icon-filter, none);
        }
    }

    &__separator {
        font-size: 12px;
        color: var(--dz-text-l);
    }
}
</style>
