const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./base');
const argv = require('yargs').argv;
const os = require('os');

let versionDir = '';
if (argv.env) {
  versionDir = argv.env.dllVersion || '';
}

module.exports = {
  mode: 'production',
  optimization: config.optimization,
  devtool: 'source-map',
  output: {
    path: `${config.dllLibDir}/prod${versionDir}`,
    filename: '[name].js',
    library: '[name]_dll'
  },
  entry: {
    vendor: config.entry.vendor
  },
  plugins: [
    new webpack.DllPlugin({
      path: `${config.dllLibDir}/prod/manifest.json`,
      name: '[name]_dll',
      context: __dirname
    }),
    new MiniCssExtractPlugin({ filename: `${config.versionFolder}/[name].css` })
  ],
  resolve: config.resolve,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /(src)/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length
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
        exclude: /(sc|lean-ui)/,
        use: config.cssLoaderCreator('local', 'prod', true)
      },
      {
        test: /\.less$/,
        include: /(sc|lean-ui)/,
        use: config.cssLoaderCreator('global', 'prod', true)
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            publicPath: `${config.__ASSETS_PATH__}/`,
            name: 'images/[name].[ext]'
          }
        }
      },
      {
        test: /\.(eot|ttf|woff|svg|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            publicPath: `${config.__ASSETS_PATH__}/`,
            name: 'fonts/[name].[ext]'
          }
        }
      }
    ]
  }
};
