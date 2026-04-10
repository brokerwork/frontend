const webpack = require('webpack');
const HappyPack = require('happypack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const os = require('os');
const _ = require('lodash');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
const argv = require('yargs').argv;
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});
const process = require('process');

const config = require('./base');
const devHost = require('../devhost');

let serverPort = _.get(argv, 'env.port', 3001);
const host = '0.0.0.0';

const entry = {};
const plugins = config.plugins.concat();
plugins.push(
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require(`./dll_lib/${config.dllVersion}/dev/manifest.json`)
  }),
  new AddAssetHtmlPlugin({
    filepath: require.resolve(`./dll_lib/${config.dllVersion}/dev/vendor.js`),
    includeSourcemap: false,
    outputPath: `dll/${config.dllVersion}`,
    publicPath: `/dll/${config.dllVersion}/`
  }),
  new webpack.HotModuleReplacementPlugin(),
  new HappyPack({
    id: 'jsHappy',
    cache: true,
    verbose: true,
    threadPool: happyThreadPool,
    loaders: [
      {
        path: 'babel-loader',
        query: {
          presets: [
            [
              'es2015',
              {
                modules: false
              }
            ],
            'stage-0',
            'react'
          ],
          plugins: ['react-hot-loader/babel'],
          cacheDirectory: true
        }
      }
    ]
  }),
  new FriendlyErrorsWebpackPlugin({
    onErrors: (severity, errors) => {
      if (severity !== 'error') {
        return;
      }
      const error = errors[0];
      notifier.notify({
        title: 'Broker Work dev tool',
        icon: `${__dirname}/notify-logo.png`,
        message: error.message
      });
    },
    clearConsole: true
  })
);

entry['vendor'] = config.entry['vendor'];
for (let k in config.entry) {
  if (k === 'vendor') continue;
  entry[k] = config.entry[k].concat();
  entry[k].unshift(
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${host}:${serverPort}`,
    'webpack/hot/only-dev-server'
  );
}

const proxy = {
  secure: false,
  changeOrigin: false,
  target: 'http://localhost:3002'
};

const env = process.env.NODE_ENV;

if (env === 'development') {
  proxy.target = devHost;

  // 后端请求通过请求中的 host 与 Origin字段判断当前租户, 所以在代理服务器转发请求时, 需要将这两个值设置正确
  proxy.changeOrigin = true;
  proxy.headers = {
    ...proxy.headers,
    Origin: proxy.target
  };
}

module.exports = {
  // devtool: '#cheap-eval-source-map',
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  },
  cache: true,
  entry,
  plugins,
  output: config.output,
  resolve: config.resolve,
  devServer: {
    host: host,
    quiet: true,
    hot: true,
    disableHostCheck: true,
    // stats: { color: true },
    stats: 'errors-only',
    port: serverPort,
    historyApiFallback: {
      index: '/index/index.html'
    },
    proxy: {
      '/api/v*/**': proxy,
      '/*/api/v*/**': proxy,
      '/ali/oss/**': proxy
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /(src)/,
        use: {
          loader: 'happypack/loader',
          options: {
            id: 'jsHappy'
          }
        }
      },
      {
        test: /\.(css|less)$/,
        exclude: /(bootstrap|node_modules)/,
        use: config.cssLoaderCreator('local', 'dev')
      },
      {
        test: /\.(css|less)$/,
        include: /(bootstrap|node_modules)/,
        use: config.cssLoaderCreator('global', 'dev')
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000000
          }
        }
      },
      {
        test: /\.(eot|ttf|woff|svg|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000000
          }
        }
      },
      {
        test: /\.(xlsx)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000000
          }
        }
      }
    ]
  }
};
