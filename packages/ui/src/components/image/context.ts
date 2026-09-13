import type { InjectionKey } from 'vue'

/** DImageGroup 向内部 DImage 标记"已在分组内"（组内预览由分组的 Provider 接管） */
export const D_IMAGE_GROUP_KEY: InjectionKey<true> = Symbol('d-image-group')
