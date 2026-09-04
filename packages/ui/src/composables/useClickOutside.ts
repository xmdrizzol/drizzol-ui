import { type Ref } from 'vue'

/**
 * 点击外部关闭的通用 Composable
 * 手动控制监听/移除
 * @param targetRef 要监听的目标元素 Ref（可以是单个或多个）
 * @param callback 点击外部时触发的回调
 * @param eventName 监听的事件类型，默认 'click'
 * @returns 用于手动控制的方法集合
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  targetRef: Ref<T | null> | Ref<T | null>[],
  callback: (event: MouseEvent | TouchEvent) => void,
  eventName: 'click' | 'mousedown' | 'touchstart' = 'click'
): {
  /** 手动添加全局事件监听 */
  addListener: () => void
  /** 手动移除全局事件监听 */
  removeListener: () => void
} {
  // 处理点击事件
  const handleEvent = (event: MouseEvent | TouchEvent) => {
    const target = event.target as Node

    // 统一处理单个或多个 Ref
    const refs = Array.isArray(targetRef) ? targetRef : [targetRef]

    // 检查点击是否在任何一个目标元素内部
    const isInside = refs.some(ref => {
      const el = ref.value
      return el && el.contains(target)
    })

    // 如果点击在外部，触发回调
    if (!isInside) {
      callback(event)
    }
  }

  // 手动添加监听
  const addListener = () => {
    document.addEventListener(eventName, handleEvent)
  }

  // 手动移除监听
  const removeListener = () => {
    document.removeEventListener(eventName, handleEvent)
  }

  return {
    addListener,
    removeListener
  }
}