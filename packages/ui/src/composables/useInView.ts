import { onMounted, onUnmounted, ref, type Ref } from 'vue'

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

  onMounted(() => {
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        isInView.value = true
        // 只需触发一次进场，随后停止观察
        observer?.disconnect()
      }
    }, { threshold: 0.15, ...options })

    if (targetRef.value) {
      observer.observe(targetRef.value)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return isInView
}
