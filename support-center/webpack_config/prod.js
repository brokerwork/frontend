const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const os = require('os');
const config = require('./base');
const plugins = config.plugins.concat();

plugins.push(
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
  })
);

const entry = Object.assign({}, config.entry);
const output = Object.assign({}, config.output);
output.publicPath = `${config.__ASSETS_PATH__}/`;
module.exports = {
  mode: 'production',
  entry,
  plugins,
  output,
  stats: config.stats,
  resolve: config.resolve,
  optimization: config.optimization,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /(src)/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length - 1
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [['es2015', { modules: false }], 'stage-0', 'react']
            }
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /(sc)/,
        use: config.cssLoaderCreator('local', 'dev')
      },
      {
        test: /\.less$/,
        include: /(sc)/,
        use: config.cssLoaderCreator('global', 'prod')
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
      }
    ]
  }
};
