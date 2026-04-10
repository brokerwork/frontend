const webpack = require("webpack");
const path = require("path");
// const argv = require('minimist')(process.argv.slice(1));
// console.log(process.env)
const version = process.env.ver || "dev"; //项目版本号
const _version = "1.0.5"; //vendor版本号
const distPath = path.resolve("./dist"); //默认trader-work/dist
const vendorPath = path.resolve(__dirname, `./vendor/${_version}`);
const resolve = {
  extensions: [".js", ".jsx", ".less"],
  modules: ["node_modules", path.resolve("./src")],
  alias: {
    "@": path.resolve("./src")
  }
};

//编译时添加 --folder 参数，表明要发布到oss上哪个文件夹;
let ossFolder = "/dev";
if (process.env.NODE_ENV === "test") {
  ossFolder = "/qa";
} else if (process.env.NODE_ENV === "production") {
  ossFolder = "/prod";
}
// const __ASSETS_PATH__ = `//static.lwork.com/${ossFolder}/dist2`;
// 开发环境直接使用oss的文件，线上环境使用cdn上的路径加速
const __ASSETS_PATH__ =
  ossFolder === "/qa"
    ? `//traderaccount.oss-cn-hangzhou.aliyuncs.com/trader-work${ossFolder}`
    : `//traderaccount-dev.oss-cn-hangzhou.aliyuncs.com/trader-work${ossFolder}`;
// const __ASSETS_PATH__ = `//traderaccount.oss-cn-hangzhou.aliyuncs.com/trader-work${ossFolder}`
// const __UPLOAD_PATH__ = `//broker-upload.oss-cn-hangzhou.aliyuncs.com/${ossFolder}`;

const plugins = [
  new webpack.DefinePlugin({
    __PROD__: process.env.NODE_ENV == "production",
    __QA__: process.env.NODE_ENV == "test",
    __DEV__: process.env.NODE_ENV === "development",
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    )
  }),
  new webpack.ProvidePlugin({
    React: "react"
  })
];
module.exports = {
  __ASSETS_PATH__,
  _version,
  version,
  distPath,
  resolve,
  plugins,
  ossFolder,
  vendorPath
};
