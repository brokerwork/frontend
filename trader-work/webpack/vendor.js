const webpack = require('webpack')
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

const { _version, __ASSETS_PATH__, vendorPath } = require('./config')
const vendor = [
  'react',
  'react-dom',
  'react-intl',
  'react-redux',
  'react-router-dom',
  'react-router-redux',
  'redux',
  'redux-actions',
  'redux-promise',
  'intl',
]
const resolve = {
  extensions: ['.js', '.jsx', '.less'],
  modules: ['node_modules', path.resolve('src')],
  alias: {
    '@': path.resolve('src')
  }
}
console.log(vendorPath)
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    output: {
      path: vendorPath,
      filename: `[name].min-${_version}.js`,
      library: '[name]_min',
    },
    entry: { vendor },
    plugins: [
      new webpack.DllPlugin({
        path: `${vendorPath}/manifest.min-${_version}.json`,
        name: '[name]_min',
        context: __dirname, //????
      }),
      new ExtractTextPlugin(`${vendorPath}/[name].min-${_version}.css`),
      new ParallelUglifyPlugin({
        uglifyJS: {
          output: {
            beautify: false // 最紧凑的输出
          },
          compress: {
            // 在UglifyJs删除没有用到的代码时不输出警告  
            warnings: false,
            // 删除所有的 `console` 语句
            // 还可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
          }
        }
      }),
    ],
    resolve,
    module: {
      rules: [{
        test: /\.js$/,
        include: /(src)/,
        use: {
          loader: 'babel-loader'
        }
      }, {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            "loader": "css-loader",
            "options": {
              "autoprefixer": false,
              "minimize": false,
              "sourceMap": false,
              "modules": true,
              "importLoaders": 1,
              "localIdentName": "[local]__[hash:base64:5]"
            }
          }, {
            "loader": "postcss-loader",
            "options": { "ident": "postcss" }
          }, { "loader": "less-loader" }]
        })
      }, {
        test: /\.(jpg|jpeg|gif|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            publicPath: __ASSETS_PATH__,
            name: 'images/[name].[ext]'
          }
        },
      }, {
        test: /\.(eot|ttf|woff|svg|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            publicPath: __ASSETS_PATH__,
            name: 'fonts/[name].[ext]'
          }
        }
      }, ]
    }
  }
} else {
  module.exports = {
    devtool: '#cheap-eval-source-map',
    output: {
      path: vendorPath,
      filename: `[name]-${_version}.js`,
      library: '[name]',
    },
    entry: { vendor },
    plugins: [
      new webpack.DllPlugin({
        path: `${vendorPath}/manifest-${_version}.json`,
        name: '[name]',
        context: __dirname,
      }),
    ],
    resolve,
    module: {
      rules: [{
        test: /\.js$/,
        include: /(src)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { 'modules': false }], 'stage-0', 'react'
            ],
          }
        }
      }, {
        test: /\.less$/,
        exclude: /(bootstrap)/,
        use: [{
          "loader": "style-loader",
        }, {
          "loader": "css-loader",
          "options": {
            "autoprefixer": false,
            "minimize": false,
            "sourceMap": false,
            "modules": true,
            "importLoaders": 1,
            "localIdentName": "[local]__[hash:base64:5]"
          }
        }, {
          "loader": "postcss-loader",
          "options": { "ident": "postcss" }
        }, { "loader": "less-loader" }]
      }, {
        test: /\.(jpg|jpeg|gif|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000000
          }
        },
      }, {
        test: /\.(eot|ttf|woff|svg|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000000
          }
        },
      }]
    }
  }
}