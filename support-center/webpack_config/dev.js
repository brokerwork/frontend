const webpack = require('webpack');
const HappyPack = require('happypack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const os = require('os');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const process = require('process');

const config = require('./base');

const serverPort = 3003;
const host = '0.0.0.0';

const entry = {};
const plugins = config.plugins.concat();
plugins.push(
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require(`./dll_lib/${config.dllVersion}/dev/manifest.json`)
  }),
  new AddAssetHtmlPlugin([
    {
      filepath: require.resolve(`./dll_lib/${config.dllVersion}/dev/vendor.js`),
      includeSourcemap: false,
      outputPath: `dll/${config.dllVersion}`,
      publicPath: `/dll/${config.dllVersion}/`
    }
  ]),
  new webpack.HotModuleReplacementPlugin(),
  new HappyPack({
    id: 'jsHappy',
    verbose: true,
    threadPool: happyThreadPool,
    loaders: [
      {
        path: 'babel-loader',
        query: {
          presets: [['es2015', { modules: false }], 'stage-0', 'react'],
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
  target: 'http://localhost:3004'
};

const env = process.env.NODE_ENV;

if (env === 'test') {
  proxy.target = 'http://sc.tmsc.lwork.com/';
  // proxy.target = 'http://support.lwork.com/';
  // proxy.target = 'http://sc.qa.lwork.com';
  proxy.changeOrigin = true;
}

module.exports = {
  mode: 'development',
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
    stats: 'errors-only',
    port: serverPort,
    disableHostCheck: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/bridge\/.*$/, to: '/bridge/index.html' },
        { from: /^\/.*$/, to: '/index/index.html' },
        { from: /^\/home\/.*$/, to: '/index/index.html' }
      ]
    },
    proxy: {
      '/v*/**': proxy,
      '/api/v*/**': proxy,
      '/api/gwfacade/**': proxy,
      '/forget/**': proxy
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
        test: /\.less$/,
        exclude: /(sc)/,
        use: config.cssLoaderCreator('local', 'dev')
      },
      {
        test: /\.less$/,
        include: /(sc)/,
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
      }
    ]
  }
};
