import { onUnmounted, ref, watch, type Ref } from 'vue'

/**
 * 观察元素进入视口的通用 Composable（仅首次进入时触发一次）
 * 用于各区块的滚动进场动画
 * @param targetRef 要观察的目标元素 Ref
 * @param options IntersectionObserver 配置，threshold 默认 0.15
 * @returns 是否已进入视口（进入后保持 true）
 */
export function useInView(
  targetRef: Ref<HTMLElement | null>,
  options?: IntersectionObserverInit
): Ref<boolean> {
  const isInView = ref(false)
  let observer: IntersectionObserver | null = null

  // 元素可能晚于挂载才出现（v-if / 异步渲染），故用 watch 而非仅 onMounted：
  // ref 一旦有值就挂观察，避免“挂载时为 null → 永不观察 → isInView 永远 false”
  const startObserving = (el: HTMLElement) => {
    if (observer || isInView.value) return
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        isInView.value = true
        // 只需触发一次进场，随后停止观察
        observer?.disconnect()
        observer = null
      }
    }, { threshold: 0.15, ...options })
    observer.observe(el)
  }

  const stop = watch(targetRef, (el) => { if (el) startObserving(el) }, { immediate: true })

  onUnmounted(() => {
    stop()
    observer?.disconnect()
    observer = null
  })

  return isInView
}
