<template>
  <Teleport to="body">
    <Transition name="d-modal" @after-enter="onModalOpened" @after-leave="onModalClosed">
      <div v-show="visible" class="d-modal">
        <div class="d-modal__wrapper" @mousedown.self="handleMaskClose">
          <div class="d-modal__container" :style="containerStyle" role="dialog" aria-modal="true" :aria-label="title || '对话框'">
            <div class="d-modal__header">
              <slot name="header">
                <span class="d-modal__title">{{ title }}</span>
              </slot>
              <button v-if="closable" class="d-modal__close" aria-label="关闭" @click="handleClose">&times;</button>
            </div>
            <div class="d-modal__body">
              <slot :opened="opened"></slot>
            </div>
            <div v-if="$slots.footer" class="d-modal__footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { pxToRem } from '@ui/utils/pxToRem'

const props = withDefaults(defineProps<{
    visible: boolean
    title?: string
    width?: string | number
    closable?: boolean
    maskClosable?: boolean
}>(), {
    visible: false,
    title: '',
    width: 520,
    closable: true,
    maskClosable: true
})

const emit = defineEmits<{
    'update:visible': [val: boolean]
    close: []
}>()

const opened = ref()

const containerStyle = computed(() => ({
    width: pxToRem(props.width),
    maxWidth: '90vw'
}))

function handleClose() {
    emit('update:visible', false)
    emit('close')

    opened.value = false
}

function handleMaskClose() {
    if (props.maskClosable) {
        handleClose()
    }
}

// Escape 关闭：仅弹窗可见期间挂监听，避免常驻全局监听
function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') handleClose()
}

watch(() => props.visible, (val) => {
    if (val) {
        document.addEventListener('keydown', onKeydown)
    } else {
        document.removeEventListener('keydown', onKeydown)
    }
}, { immediate: true })

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
})

function onModalOpened() {
    opened.value = true
}

function onModalClosed() {
    opened.value = false
}

</script>

<style scoped lang="scss">
.d-modal {
  @include fixed(0, 0, 0, 0);
  z-index: 2000;
  background: var(--dz-mask);

  &__wrapper {
    @include flex(center, center);
    min-height: 100%;
    padding: 16px;
  }

  &__container {
    background: var(--dz-bg);
    border-radius: 12px;
    box-shadow: var(--dz-shadow-sm);
    width: 520px;
    max-width: 90vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }

  &__header {
    @include flex(space-between, center);
    padding: 20px 24px 0;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: var(--dz-text-h);
  }

  &__close {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--dz-text-l);
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    transition: color 0.2s;

    &:hover {
      color: var(--dz-text);
    }
  }

  &__body {
    padding: 20px 24px;
    overflow-y: auto;
    color: var(--dz-text-d);
    font-size: 14px;
    line-height: 1.6;
  }

  &__footer {
    @include flex(flex-end, center);
    gap: 12px;
    padding: 0 24px 20px;
  }
}

.d-modal-enter-active,
.d-modal-leave-active {
  transition: opacity 0.25s;

  .d-modal__container {
    transition: transform 0.25s;
  }
}

.d-modal-enter-from,
.d-modal-leave-to {
  opacity: 0;

  .d-modal__container {
    transform: scale(0.95);
  }
}
</style>