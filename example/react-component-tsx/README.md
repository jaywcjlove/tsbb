react-component-tsx
===

为 React 组件库创建一个项目，包含组件库实例预览的网站。文档与组件库放入一个工程中，全部使用 TypeScript 编写，React 组件库源文件放入 `src` 目录 ，文档网站源文件放入 `website` 目录。

## 开发模式

```bash
# 第一步，先运行，监听组件编译输出 .js 文件 
npm run ts:watch
# 第二步，监听编译输出类型 .d.ts 文件
npm run types:watch
# 第三步，开发模式，监听编译预览网站实例
npm run doc:dev
```

编译发布

```bash
npm run released
```