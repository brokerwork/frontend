## OSS上传工具，同时给项目使用和运维发布特定版本的tgz文件。
使用方法： node index.js [options]

### 上传项目文件
使用方法： node index.js [options]
```javascript
options = {
  env: [test|qa|prod], //必填
  bucket: traderaccount, //必填
}
```
### (提供运维的工具)
使用方法： node index.js [options]
```javascript
options = {
  env: [test|qa|prod], //必填
  bucket: traderaccount, //必填
  archive: /Users/zhangqingfeng/projects/archives/ta-ui-5.9.1.tgz //上传tgz文件时必填
}
```