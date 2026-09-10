// 声明 vue 静态导入与样式模块（vue-tsc 通过 vue 原生插件处理 .vue，此处只需样式声明）
declare module '*.scss'
declare module '*.css'

// vite 的 ?raw 文本导入（测试中读取组件源码）
declare module '*?raw' {
  const content: string
  export default content
}
