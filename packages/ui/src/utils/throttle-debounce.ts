/**
 * 函数防抖：触发后延迟执行，若在延迟时间内再次触发则重新计时
 * @param fn 要防抖的函数
 * @param delay 延迟时间(ms)，默认300ms
 * @param immediate 是否立即执行第一次，默认false
 * @returns 防抖后的函数，带cancel方法
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  immediate: boolean = false
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null
  let isInvoked = false

  const debounced = function (this: any, ...args: Parameters<T>) {
    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    // 立即执行模式
    if (immediate && !isInvoked) {
      fn.apply(this, args)
      isInvoked = true
      return
    }

    // 延迟执行
    timer = setTimeout(() => {
      fn.apply(this, args)
      isInvoked = false
      timer = null
    }, delay)
  }

  // 取消方法：清除定时器并重置状态
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    isInvoked = false
  }

  return debounced
}

/**
 * 函数节流：规定时间内只能执行一次
 * @param fn 要节流的函数
 * @param interval 时间间隔(ms)，默认300ms
 * @param leading 是否在开始时执行，默认true
 * @param trailing 是否在结束时执行，默认false
 * @returns 节流后的函数，带cancel方法
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number = 300,
  leading: boolean = true,
  trailing: boolean = false
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let lastTime = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  const throttled = function (this: any, ...args: Parameters<T>) {
    const now = Date.now()

    // 第一次执行且不开启leading，更新lastTime
    if (!lastTime && !leading) {
      lastTime = now
    }

    // 计算剩余时间
    const remaining = interval - (now - lastTime)

    // 如果剩余时间小于等于0，执行函数
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      fn.apply(this, args)
      lastTime = now
      return
    }

    // 如果开启trailing且没有定时器，设置延迟执行
    if (trailing && !timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        lastTime = Date.now()
        timer = null
      }, remaining)
    }
  }

  // 取消方法
  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    lastTime = 0
  }

  return throttled
}