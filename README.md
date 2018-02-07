# nwjs + webpack代码热更新

webpack在nwjs环境下的简单的代码热更新实现。

## 使用方法

### 使用loader加载器，在html或pug中注入js代码
```javascript
// html的loader配置
{
  test: /^.*\.html$/,
  use: ['html-loader', {
    loader: engineering,
    options: {
      buildFile: './build',
      rootFile: 'app.js',
      type: 'html'
    }
  }]
},
// pug or jade的loader配置
{
  test: /^.*\.pug$/,
  use: ['pug-loader', {
    loader: engineering,
    options: {
      buildFile: './build',
      rootFile: 'app.js',
      type: 'pug'
    }
  }]
}
```

### 手动引入js脚本
```html
<script src="/path/to/node_modules/nwjs-webpack-hot-loader/lib/hot-update.js"></script>
<script>
window.addEventListener('load', function __hot_update_load__(event){
  var __update__ = new __NwWebpackHotUpdate__(
    './build', // buildFile
    'app.js'   // rootFile
  );
  __update__.init();
}, false);
</script>
```

## 参数
| buildFile | webpack文件编译后的目录 |
| rootFile  | webpack入口文件名称     |
| type      | 【loader】文件类型，可以是html、pug、jade |
