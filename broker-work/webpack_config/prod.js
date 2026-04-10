const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const config = require('./base');
const plugins = config.plugins.concat();
plugins.push(
  new ParallelUglifyPlugin({
    cacheDir: '.uglifyJsCache',
    uglifyJS: {
      output: {
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false
      },
      // 在UglifyJs删除没有用到的代码时不输出警告
      warnings: false,
      compress: {
        // 删除所有的 `console` 语句
        // 还可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true
      }
    }
  }),
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require(`./dll_lib/${config.dllVersion}/prod/manifest.json`)
  }),
  new AddAssetHtmlPlugin({
    filepath: require.resolve(`./dll_lib/${config.dllVersion}/prod/vendor.css`),
    includeSourcemap: false,
    outputPath: `dll/${config.dllVersion}`,
    typeOfAsset: 'css',
    publicPath: `${config.__ASSETS_PATH__}/dll/${config.dllVersion}/`
  }),
  new AddAssetHtmlPlugin({
    filepath: require.resolve(`./dll_lib/${config.dllVersion}/prod/vendor.js`),
    includeSourcemap: false,
    outputPath: `dll/${config.dllVersion}`,
    typeOfAsset: 'js',
    publicPath: `${config.__ASSETS_PATH__}/dll/${config.dllVersion}/`
  }),
  new ExtractTextPlugin(`${config.versionFolder}[name]/[name].css`)
);

const entry = Object.assign({}, config.entry);
const output = Object.assign({}, config.output);
output.publicPath = `${config.__ASSETS_PATH__}/`;

module.exports = {
  entry,
  plugins,
  output,
  stats: config.stats,
  resolve: config.resolve,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /(src)/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [['es2015', { modules: false }], 'stage-0', 'react']
        }
      },
      {
        test: /\.(less|css)$/,
        exclude: /(bootstrap|node_modules)/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: config.cssLoaderCreator('local', 'prod')
        })
      },
      {
        test: /\.(less|css)$/,
        include: /(bootstrap|node_modules)/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: config.cssLoaderCreator('global', 'prod')
        })
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          publicPath: `${config.__ASSETS_PATH__}/`,
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.(eot|ttf|woff|svg|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          publicPath: `${config.__ASSETS_PATH__}/`,
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(xlsx)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          publicPath: `${config.__ASSETS_PATH__}/`,
          name: 'files/[name].[ext]'
        }
      }
    ]
  }
};
