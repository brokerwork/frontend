### install
npm install -g phonegap
npm install
1. 需要首先安装 [yarn](https://yarnpkg.com/zh-Hans/docs/install#mac-tab)
1. yarn # 基础包安装
1. yarn global add commitizen # git commit 检查

### web dev
1. 启动本地 mock api
node server.js
2. npm run start
open http://localhost:3000
3. 调试
在微信开发者工具中贴入微信公众号菜单指向的url即可在开发者工具中调试服务器。菜单url参考menu.js

### run on ios
phonegap run ios

### run on android
phonegap run android

### 目录结构说明
src
|
|----- commonActions                                     // 通用的 action
|
|----- pages                                             // 所有页面，每个子目录对应一个 router
|        |
|        |--- Accounts                                   // 譬如账户列表页
|                 |----- actions                         // 账户列表页相关的 actions
|                 |----- componests                      // 帐户列表页相关的组件，如果是通用组件请放到 /src/widgets
|                 |         |---- CmptName               // 账户列表页某个组件文件夹
|                 |                    |--- index.js     // 账户列表页某个组件 js 文件
|                 |                    |--- CmptName.less// 账户列表页某个组件样式文件
|                 |
|                 |---- index.js                         // 账户列表页入口文件
|
|----- widgets                                           // 通用组件
|         |
|         |----- WidgetName
|                     |----- index.js
|                     |----- WidgetName.less
|
|----- index.js                                          // 整个js的入口
|----- store.js                                         

# 代码提交规范

## commit 书写规范
  1. 使用**git cz**代替**git commit**命令
  1. commit 内容需要遵循以下规范

  ```
  <Header>

  <Body>

  <Any breaking changes>

  <Any issues closed by this commit>
  ```

    * 标题 <type>: <subject>
    * <type>: 用于说明 commit 的类别，只允许使用下面7个标识
      feat: 新功能
      fix: 修补bug
      docs: 文档
      style: 格式
      refactor: 重构
      test: 增加测试,
      chore: 构建过程或辅助工具的变动
    * <subject>: commit 目的的简短描述，不超过50个字符

    * 正文部分 这部分是对本次 commit 的详细描述，可以分成多行。

    * 比较重大的改变点

    * 本次 commit 关闭的 ticket 号