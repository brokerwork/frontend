/* eslint-disable no-undef */
const path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// var ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
module.exports = {
  entry: {
    bundle: path.resolve(__dirname, 'src/index.jsx')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? 'https://support-center-dev.oss-cn-hangzhou.aliyuncs.com/os-mobile/dist/'
        : ''
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              module: true,
              namedExport: true,
              localIdentName: '[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                autoprefixer(),
                pxtorem({
                  propList: ['*', '!border*']
                })
              ]
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=10000&name=[path][name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.json', '.jsx', '.tsx', '.css'],
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : '',
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static'
    // }),
    new webpack.DefinePlugin({
      __PRO__: process.env.NODE_ENV == 'production',
      __DEV__: process.env.NODE_ENV === 'development'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require('./dist/dll/manifest.json')
    }),
    new HtmlWebpackPlugin({
      chunksSortMode: 'dependency',
      template: './template.html',
      filename: `index.html`
    }),
    new AddAssetHtmlPlugin({
      filepath: require.resolve('./dist/dll/index.js'),
      publicPath:
        'https://support-center-dev.oss-cn-hangzhou.aliyuncs.com/os-mobile/dist/dll'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  optimization: {
    splitChunks: {
      name: 'vendor/index',
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30
    }
  },
  devServer: {
    port: 3008,
    proxy: {
      '/v': {
        secure: false,
        changeOrigin: true,
        target: 'http://preos.qa.lwork.com'
        // target: 'http://sunny.twqa.lwork.com'
      }
    },
    contentBase: path.join(__dirname, 'dist'),
    // compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    host: '0.0.0.0'
  }
};
