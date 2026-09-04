import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 响应式判断是否为手机端
 */
export function useIsMobile() {
    const isMobile = ref(window.innerWidth <= 768)

    const onResize = () => {
        isMobile.value = window.innerWidth <= 768
    }

    onMounted(() => window.addEventListener('resize', onResize))
    onUnmounted(() => window.removeEventListener('resize', onResize))

    return isMobile
}