const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./base');
const argv = require('yargs').argv;

let versionDir = '';
if (argv.env) {
  versionDir = argv.env.dllVersion || '';
}

module.exports = {
  devtool: 'source-map',
  output: {
    path: `${config.dllLibDir}/prod${versionDir}`,
    filename: '[name].js',
    library: '[name]_dll',
  },
  entry: {
    vendor: config.entry.vendor
  },
  plugins: [
    new webpack.DllPlugin({
      path: `${config.dllLibDir}/prod/manifest.json`,
      name: '[name]_dll',
      context: __dirname,
    }),
    new ExtractTextPlugin(`${config.versionFolder}/[name].css`)
  ],
  resolve: config.resolve,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /(src)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['es2015', {'modules': false}], 'stage-0', 'react'],
          }
        }
      },
      {
        test: /\.less$/,
        exclude: /(bootstrap|lean-ui)/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: config.cssLoaderCreator('local', 'prod')
        })
      },
      {
        test: /\.less$/,
        include: /(bootstrap|lean-ui)/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: config.cssLoaderCreator('global', 'prod')
        })
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
        },
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
      },
    ]
  }
};

