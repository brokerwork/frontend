## 安装
  1. 需要首先安装 [yarn](https://yarnpkg.com/zh-Hans/docs/install#mac-tab)
  1. yarn # 基础包安装
  1. yarn global add commitizen # git commit 检查

## 相关运行命令
  1. `yarn start` 启动开发环境, 在浏览器中打开[localhost:3001](http://localhost:3001/)
  1. `yarn prod && yarn deploy` 发布代码到开发环境
  1. `yarn prod:qa -- --env.version v5.11.5 && yarn deploy:qa` 发布代码到测试环境
  1. `yarn prod:prod -- --evn.version <branchName>  && yarn deploy:prod -- --accessKeyId xxxxxxxxx --accessKeySecret xxxxxxxx` 发布代码到测试环境
  1. `yarn dll` 将第三方依赖打包，并生成独立的dll文件
  1. `yarn deploy-dll` 将dll包上传到开发环境
  1. `yarn deploy-dll:qa` 将dll包上传到测试环境
  1. `yarn deploy-dll:prod` 将dll包上传到生产环境
  1. `yarn test` 运行测试
  1. `yarn test -- --coverage` 运行测试并生成覆盖率报告
  1. `yarn test:watch` 运行测试并监控文件变化
  

## 在非生产环境查看加密数据方法 （生产环境不提供此功能）
  在浏览器开发者工具中，添加全局变量 `___SHOW_DECRYPT_DATA__ = true` ,然后执行发起请求的操作，在cosnsole中会输出对应的URL，加密前的数据，加密后的数据

## Dll 包说明
  `webpack_config/base.js`文件中，entry.vendor列表中的包有更新时，需要重新执行`yarn dll:dev` and `yarn dll:prod`以更新对应环境的dll文件, 特别是生产环境，在有对应的包更新时，一定要在release node中进行说明。

## Dll 包版本说明
  `webpack_config/base.js`文件中， 有dllVersion变量, 如果有改变dll包中的内容，请**一定要升级版本号**。

## Dll 包更新、发布和管理
  1. `webpack_config/base.js` 里找到 dllVersion 变量，更改成目标版本，然后按照如下流程执行
  - yarn dll # 生成 dll
  - yarn deploy-dll # 发布dll代码到测试环境
  - yarn deploy-dll:qa # 发布dll代码到qa

## 测试环境发布
  - yarn prod && yarn deploy # 发布功能模块代码

## qa环境发布
  - yarn prod:qa -- --env.version v6.7.0 && yarn deploy:qa # 发布功能模块代码到qa，**请注意：qa环境发布必须带版本号（v6.7.0）**

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

## 新功能
  1. 开发新功能时，更新**master**然后**从master上拉出功能分支**。
  2. 开发过程中，如需要暂时中断任务使用**git stash save -u**命令暂存当前修改过的文件。
  3. 开发完成后，使用命令**git pull master**将master分支更新到最新，再使用**git rebase master**将当前分支的修改与master分支合并，如果当前分支在功能完成之前已经提交过，有可能会造成本地分支与仓库中的分支历史记录出现冲突，这时可以使用**git push -f**强行提交。
  4. 提交功能分支到仓库后，在仓库中功能分支后面选择**merge request**提交merge request请求，等待其他开发人员code review后，将分支合并到master。

## Bug修复 （线上bug参见第4点）
  1. 更新**master**然后**从master上拉出Bug分支**。
  2. 开发完成后，使用命令**git pull master**将master分支更新到最新，再使用**git rebase master**将当前分支的修改与master分支合并，如果当前分支在功能完成之前已经提交过，有可能会造成本地分支与仓库中的分支历史记录出现冲突，这时可以使用**git push -f**强行提交。
  3. 提交功能分支到仓库后，在仓库中功能分支后面选择**merge request**提交merge request请求，等待其他开发人员code review后，将分支合并到master。
  4. 如果是线上bug，在**merge request**中，点**Cherry-pick**按钮，将此次commit的内容，Merge到修复的线上分支中.
