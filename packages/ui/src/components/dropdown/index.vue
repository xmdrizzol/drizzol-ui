<template>
  <div class="d-dropdown" ref="dropdownRef" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="d-dropdown-trigger" @click="handleClick" ref="triggerRef">
      <slot></slot>
    </div>
    <Transition name="d-dropdown">
      <div class="d-dropdown-menu" v-show="visible" ref="menuRef" :style="[menuStyle, offsetVars]">
        <div class="d-dropdown__arrow" ref="arrowRef" :style="arrowStyle"></div>

        <slot name="menu">
          <div>默认菜单</div>
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useClickOutside } from '@ui/composables/useClickOutside'
import { computeMenuPosition } from './position'
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
const arrowStyle = reactive({ top: '0px', left: '0px', display: 'block' })
// 进出场滑动距离交给 CSS 变量，offset prop 保持可用
const offsetVars = computed(() => ({ '--dz-dd-offset': props.offset + 'px' }))

let closeTimer: ReturnType<typeof setTimeout> | null = null // hover 模式关闭定时器
let resizeObserver: ResizeObserver | null = null

function updatePosition() {
    if (!menuRef.value || !triggerRef.value || !arrowRef.value) return

    const triggerRect = triggerRef.value.getBoundingClientRect()
    const menuRect = menuRef.value.getBoundingClientRect()
    const arrowRect = arrowRef.value.getBoundingClientRect()

    // 其余 placement 定位待支持（见下方 TODO）
    if (props.placement !== 'bottom') return

    const p = computeMenuPosition(
        { left: triggerRect.left, top: triggerRect.top, width: triggerRect.width, height: triggerRect.height },
        { width: menuRect.width, height: menuRect.height },
        { width: arrowRect.width, height: arrowRect.height },
        { width: window.innerWidth, height: window.innerHeight },
    )
    menuStyle.top = p.top + 'px'
    menuStyle.left = p.left + 'px'
    arrowStyle.top = p.arrowTop + 'px'
    arrowStyle.left = p.arrowLeft + 'px'
    arrowStyle.display = p.arrowVisible ? 'block' : 'none'
}

// 开合只翻转 visible，进出场动画由 <Transition> + CSS 过渡完成：
// 纯 CSS 中断天然平滑（无需 kill/续接补间），也去掉了一个非 MIT 的运行时依赖
function openMenu() {
    if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
    }
    visible.value = true
    // nextTick 后 v-show 已落地、菜单可测量，首帧即用真实尺寸定位并适配视口边界；
    // 打开期间内容尺寸变化由 ResizeObserver 兜底
    nextTick(updatePosition)
    addViewportListeners()
}

function closeMenu() {
    if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
    }
    visible.value = false
    removeViewportListeners()
}

// 打开期间视口变化（窗口缩放、容器滚动）时重新适配边界；菜单随 trigger 滚动，
// 但与视口边缘的相对关系会变，须重算夹取
function handleViewportChange() {
    if (visible.value) updatePosition()
}

function addViewportListeners() {
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)
}

function removeViewportListeners() {
    window.removeEventListener('resize', handleViewportChange)
    window.removeEventListener('scroll', handleViewportChange, true)
}

// 点击外部关闭下拉框
const { addListener, removeListener } = useClickOutside(
  [dropdownRef],
  () => {
    if (visible.value) {
      removeListener()
      closeMenu()
    }
  }
)

// click 模式
const handleClick = () => {
  if (props.trigger !== 'click') return

  if (!visible.value) {
    addListener()
    openMenu()
  } else {
    removeListener()
    closeMenu()
  }
}

// hover 模式
const handleMouseEnter = () => {
  if (props.trigger !== 'hover') return

  openMenu()
}


const handleMouseLeave = () => {
  if (props.trigger !== 'hover') return

  // 鼠标离开：延迟关闭，可被再次进入取消
  closeTimer = setTimeout(() => {
    closeMenu()
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
  // 打开状态下卸载时，务必移除全局点击/视口监听，避免泄漏
  removeListener()
  removeViewportListeners()
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
    will-change: transform, opacity; // 性能优化

    .d-dropdown__arrow {
      @include absolute;

      width: 0;
      height: 0;
      border: 0.5rem solid transparent;
      border-bottom-color: var(--dz-bg);
    }
  }
}

// 进出场：淡入 + 自 offset 距离下滑落位（closed 时上抬、open 落回原位）
.d-dropdown-enter-active,
.d-dropdown-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.d-dropdown-enter-from,
.d-dropdown-leave-to {
  opacity: 0;
  transform: translateY(calc(-1 * var(--dz-dd-offset, 6px)));
}
</style>
