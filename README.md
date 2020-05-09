# webpack html 内联静态资源插件

## 版本要求

- html-webpack-plugin 4.x

## use

```javascript
new WebpackInlineSourcePlugin(HtmlWebpackPlugin, {
  maxSize: 20 * 1024,
  js: [path.resolve(__dirname, "./dist/monitor.js")],
});
```
