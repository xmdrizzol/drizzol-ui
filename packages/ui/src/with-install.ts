import type { App, Component } from 'vue'

/** 组件及其 install 方法（可被 app.use() 注册为全局组件） */
export type SFCWithInstall<T = {}> = T & {
  install: (app: App) => void
}

/**
 * 为组件附加 install 方法
 * @param component 组件定义
 * @param name 注册名（PascalCase，模板中可使用 kebab-case 形式，如 DButton → d-button）
 */
export function withInstall<T extends Component>(component: T, name: string): SFCWithInstall<T> {
  ;(component as SFCWithInstall<T>).install = (app: App) => {
    app.component(name, component)
  }
  return component as SFCWithInstall<T>
}
