const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const {
  _version,
  version,
  distPath,
  resolve,
  plugins,
  __ASSETS_PATH__,
  vendorPath
} = require("./config");
plugins.push(
  new ParallelUglifyPlugin({
    uglifyJS: {
      // 最紧凑的输出
      output: {
        // beautify: false
      },
      // 在UglifyJs删除没有用到的代码时不输出警告
      warnings: false, //默认
      // 删除所有的注释
      // comments: false, //default false
      compress: {
        // 删除所有的 `console` 语句
        // 还可以兼容ie浏览器
        drop_console: process.env.NODE_ENV != "development",
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true
      }
    }
  }),
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require(`${vendorPath}/manifest.min-${_version}.json`)
  }),
  new AddAssetHtmlPlugin({
    filepath: require.resolve(`${vendorPath}/vendor.min-${_version}.js`),
    includeSourcemap: false,
    // outputPath: `dll/${config.dllVersion}`,
    typeOfAsset: "js",
    publicPath: __ASSETS_PATH__
  })
);

module.exports = function(env) {
  const appVersion = env.version || version;
  plugins.push(
    new CommonsChunkPlugin({
      name: "common",
      filename: `${appVersion}/common.js`,
      minChunks: 4
    }),
    new HtmlWebpackPlugin({
      chunks: ["common", "index"],
      chunksSortMode: "dependency",
      template: "./template.html",
      filename: `${appVersion}/index.html`
    }),
    new ExtractTextPlugin(`${appVersion}/[name].css`)
  );
  return {
    entry: {
      index: [
        "babel-polyfill",
        path.resolve("./src"),
        path.resolve("./src/themes/variables-0"),
        path.resolve("./src/themes/variables-1"),
        path.resolve("./src/themes/variables-2"),
        path.resolve("./src/themes/variables-3"),
        path.resolve("./src/themes/variables-4")
      ]
    },
    plugins,
    output: {
      path: path.resolve("./dist"),
      filename: `${appVersion}/[name].js`,
      publicPath: __ASSETS_PATH__ + "/"
    },
    stats: {
      color: true,
      children: false
    },
    resolve,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: /(src)/,
          loader: "babel-loader"
        },
        {
          test: /\.less$/,
          // exclude: /(theme)/,
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader"
              },
              {
                loader: "postcss-loader",
                options: { ident: "postcss" }
              },
              { loader: "less-loader" }
            ]
          })
        },
        {
          test: /\.(jpg|jpeg|gif|png)$/,
          loader: "url-loader",
          options: {
            limit: 10000,
            publicPath: __ASSETS_PATH__,
            name: `/static/images/[name].[ext]`
          }
        },
        {
          test: /\.(eot|ttf|woff|svg|woff2)$/,
          loader: "url-loader",
          options: {
            limit: 10000,
            publicPath: __ASSETS_PATH__,
            name: `/static/fonts/[name].[ext]`
          }
        }
      ]
    }
  };
};
