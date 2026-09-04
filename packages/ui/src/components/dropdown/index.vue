<template>
  <div class="d-dropdown" ref="dropdownRef" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="d-dropdown-trigger" @click="handleClick" ref="triggerRef">
      <slot></slot>
    </div>
    <div class="d-dropdown-menu" ref="menuRef" :style="menuStyle">
      <div class="d-dropdown__arrow" ref="arrowRef" :style="arrowStyle"></div>

      <slot name="menu">
        <div>默认菜单</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useClickOutside } from '@ui/composables/useClickOutside'
import gsap from 'gsap'
const TRIGGER = ['click', 'hover'] as const
const PLACEMENT = ['top', 'bottom', 'left', 'right'] as const

// 从常量中提取类型
type Trigger = typeof TRIGGER[number]
type Placement = typeof PLACEMENT[number]

// 定义 props
const props = withDefaults(defineProps<{
  /** 触发方式 */
  trigger?: Trigger
  /** 弹出位置 */
  placement?: Placement,
  /** 偏移量 */
  offset?: number,
  /** hover模式关闭延迟(ms) */
  hoverCloseDelay?: number
}>(), {
  trigger: 'click',
  placement: 'bottom',
  offset: 8,
  hoverCloseDelay: 300
})

const visible = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)

const menuStyle = reactive({ top: '0px', left: '0px' })
const arrowStyle = reactive({ top: '0px', left: '0px' })

let closeTimer: ReturnType<typeof setTimeout> | null = null // hover 模式关闭定时器
let resizeObserver: ResizeObserver | null = null

function updatePosition() {
    if (!menuRef.value || !triggerRef.value || !arrowRef.value) return

    const triggerRect = triggerRef.value.getBoundingClientRect()
    const menuRect = menuRef.value.getBoundingClientRect()
    const arrowRect = arrowRef.value.getBoundingClientRect()

    if (props.placement === 'bottom') {
        menuStyle.top = triggerRect.height + arrowRect.height / 2 + 'px'
        menuStyle.left = 0 - (menuRect.width - triggerRect.width) / 2 + 'px'

        arrowStyle.top = -arrowRect.height + 'px'
        arrowStyle.left = menuRect.width / 2 - arrowRect.width / 2 + 'px'
    }
}

// 统一动画管理
const playOpenAnimation = () => {
  updatePosition()

  // 先清除任何正在进行的动画和关闭定时器
  gsap.killTweensOf(menuRef.value)
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }

  gsap.to(menuRef.value as HTMLElement, {
    y: props.offset,
    duration: 0.6,
    autoAlpha: 1,
    ease: 'back.out(3.6)',
    onStart: () => {
      visible.value = true
    }
  })
}

const playCloseAnimation = () => {
  gsap.killTweensOf(menuRef.value)

  gsap.to(menuRef.value as HTMLElement, {
    y: 0,
    duration: 0.6,
    autoAlpha: 0,
    ease: 'back.in(3.2)',
    onComplete: () => {
      visible.value = false
    }
  })
}

// 点击外部关闭下拉框
const { addListener, removeListener } = useClickOutside(
  [dropdownRef],
  () => {
    if (visible.value) {
      removeListener()
      playCloseAnimation()
    }
  }
)

// click 模式
const handleClick = () => {
  if (props.trigger !== 'click') return

  if (!visible.value) {
    addListener()
    playOpenAnimation()
  } else {
    removeListener()
    playCloseAnimation()
  }
}

// hover 模式
const handleMouseEnter = () => {
  if (props.trigger !== 'hover') return

  playOpenAnimation()
}


const handleMouseLeave = () => {
  if (props.trigger !== 'hover') return

  // 鼠标离开：延迟关闭，可被再次进入取消
  closeTimer = setTimeout(() => {
    playCloseAnimation()
  }, props.hoverCloseDelay)
}

onMounted(() => {
    resizeObserver = new ResizeObserver(() => {
        if (visible.value) {
            updatePosition()
        }
    })
    if (menuRef.value) {
        resizeObserver.observe(menuRef.value)
    }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  if (closeTimer) {
    clearTimeout(closeTimer)
  }
  gsap.killTweensOf(menuRef.value)
})

// TODO: 切换弹出位置
</script>

<style scoped lang="scss">
.d-dropdown {
  @include relative;

  display: inline-block;

  .d-dropdown-trigger {
    cursor: pointer;
    user-select: none;
  }

  .d-dropdown-menu {
    @include absolute;

    z-index: 100;
    padding: 0.75rem;
    white-space: nowrap;
    background: var(--dz-bg);
    border-radius: 6px;
    box-shadow: var(--dz-shadow-md);
    user-select: none;
    opacity: 0;
    visibility: hidden;
    transform: translateY(0);
    will-change: transform, opacity; // 性能优化

    .arrow {
      @include absolute;

      width: 0;
      height: 0;
      border: 0.5rem solid transparent;
      border-bottom-color: var(--dz-bg);
    }
  }
}
</style>