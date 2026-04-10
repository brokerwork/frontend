/* eslint-disable no-undef */
var path = require('path');
var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

var vendors = [
  'react',
  'react-router',
  'react-dom',
  'react-router-dom',
  'antd-mobile',
  'mobx',
  'mobx-react',
  'mobx-react-router',
  'lodash'
];

module.exports = {
  entry: {
    index: vendors
  },
  output: {
    path: path.join(__dirname, 'dist/dll'),
    filename: '[name].js',
    library: '[name]'
  },
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist/dll/manifest.json'),
      name: '[name]'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};
