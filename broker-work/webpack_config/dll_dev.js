const webpack = require('webpack');
const config = require('./base');

module.exports = {
  devtool: 'cheap-eval-source-map',
  output: {
    path: `${config.dllLibDir}/dev`,
    filename: '[name].js',
    library: '[name]_dll',
  },
  entry: {
    vendor: config.entry.vendor,
  },
  plugins: [
    new webpack.DllPlugin({
      path: `${config.dllLibDir}/dev/manifest.json`,
      name: '[name]_dll',
      context: __dirname,
    }),
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
        use: config.cssLoaderCreator('local', 'dev')
      },
      {
        test: /\.less$/,
        include: /(bootstrap|lean-ui)/,
        use: config.cssLoaderCreator('global', 'dev')
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000000
          }
        },
      },
      {
        test: /\.(eot|ttf|woff|svg|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000000
          }
        },
      },

    ]
  }
};

