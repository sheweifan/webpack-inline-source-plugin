# webpack html 内联静态资源插件

自动把小于规定大小的文件内联进 html
另外支持手动传入 js,css 文件路径（不判断文件大小）

## 版本要求

- html-webpack-plugin 4.x

## use

```javascript
new WebpackInlineSourcePlugin(HtmlWebpackPlugin, {
  maxSize: 20 * 1024,
  js: [path.resolve(__dirname, "./dist/monitor.js")],
  css: [path.resolve(__dirname, "./dist/style.css")],
});
```

## api

| 参数    | 说明                                 | 类型     |
| ------- | ------------------------------------ | -------- |
| maxSize | 内联最大文件尺寸                     | number   |
| js      | 除了 webpack 打包文件之外的 js 文件  | [string] |
| css     | 除了 webpack 打包文件之外的 css 文件 | [string] |
