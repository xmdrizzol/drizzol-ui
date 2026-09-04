import { onMounted, onUnmounted } from 'vue'

/**
 * 全局鼠标滚动监听 Composable
 * @param callback 滚动事件触发的回调函数
 * @param throttleDelay 节流延迟时间（毫秒），默认不节流
 */
export function useScrollListener(
  callback: (event: Event) => void,
  throttleDelay?: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null

  const handleScroll = (event: Event) => {
    if (throttleDelay) {
      if (timer) return
      timer = setTimeout(() => {
        callback(event)
        timer = null
      }, throttleDelay)
    } else {
      callback(event)
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (timer) clearTimeout(timer)
  })
}
