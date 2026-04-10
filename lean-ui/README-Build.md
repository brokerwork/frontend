# Lean Work 前端共用组件库编译

安装 `yarn add lworkui` 或 `npm -i lworkui --save`

## 发布到 npm

* 执行命令 `npm publish`
* 包名：`lworkui`
* 项目内升级: `yarn upgrade lworkui`

## 可用命令

* 开发环境启动 `yarn start`
* 安装 `yarn add lworkui`
* 升级 `yarn upgrade lworkui`
* 编译 **es2015** 与 **typescript** 版 `gulp`
* 编译 `yarn build` **min** 版

## 项目结构

```
lean-ui/
  .storybook/
  components/
    Alert/
    Badge/
    Breadcrumb/
    Card/
    ...
  dist/
  jest-config/
  LeanWork-Icons/
  less/
    motion/
      fade.less
      move.less
      other.less
      slide.less
      ...
    clearfix.less
    color.less
    config.less
    fonts.less
    ...
  stories/
    alert.js
    badge.js
    breadcrumb.js
    button.js
    ...
  typings/
    custom-typings.d.ts
    index.d.ts
  createIconPathData.js
  gulpfile.js
  index.ts
  README.md
  node_modules/
  package.json
  tsconfig.json
  webpack.config.js
  yarn.lock
```

## 项目结构说明

123456
