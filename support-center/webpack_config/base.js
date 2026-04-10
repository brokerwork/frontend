const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssnano = require('cssnano');
const argv = require('yargs').argv;
const CopyWepackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const os = require('os');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// dll包版本，
// 由于dll包不会经常变更。
// 版本号可以在编译时，写死在代码中，在需要的时候再由前端变更
const dllVersion = '1.0.11';

//编译时添加 --folder 参数，表明要发布到oss上哪个文件夹;
let ossFolder = 'test';
// 发布时添加发布的版本文件夹
let versionFolder = '';

if (argv.env) {
  ossFolder = argv.env.folder || 'test';
  versionFolder = argv.env.version ? `${argv.env.version}/` : '';
}

// 版本判断
let __PROD__ = true;
if (['test', 'qa'].includes(ossFolder)) {
  __PROD__ = false;
}

const srcDir = './src';
const appLessPath = `${srcDir}/less`;
const leanUiLessPath = 'lean-ui/dist/index.less';
// const __ASSETS_PATH__ = `//support-center${!__PROD__ ? '-dev' : ''}.oss-cn-hangzhou.aliyuncs.com/${ossFolder}/dist`;
const __ASSETS_PATH__ = `//${
  __PROD__ ? 'support-center.oss-cn-hangzhou.aliyuncs.com' : 'support-center-dev.oss-cn-hangzhou.aliyuncs.com'
}/${ossFolder}/dist`;
const __UPLOAD_PATH__ = `//broker-upload${!__PROD__ ? '-dev' : ''}.oss-cn-hangzhou.aliyuncs.com/${ossFolder}`;

const entrys = {
  index: [`${srcDir}/landings`],
  bridge: [`${srcDir}/modules/Bridge`]
};
if (argv.env && argv.env.bridge === 'false') {
  delete entrys.bridge;
}

const entry = {
  vendor: [
    'react',
    'react-dom',
    'react-intl',
    'react-redux',
    'react-router',
    'react-router-redux',
    'react-transition-group',
    'redux',
    'redux-actions',
    'redux-promise',
    'redux-form',
    'isomorphic-fetch',
    'babel-polyfill',
    'js-cookie',
    'rc-datetime-picker',
    'uuid',
    'intl',
    'moment',
    'draft-js',
    'immutable',
    'sortablejs',
    'react-copy-to-clipboard',
    'decorate-component-with-props',
    `${appLessPath}/sc/sc.less`,
    'lean-ui',
    leanUiLessPath
  ]
};

const plugins = [
  new webpack.DefinePlugin({
    __ASSETS_PATH__: JSON.stringify(__ASSETS_PATH__),
    __UPLOAD_PATH__: JSON.stringify(__UPLOAD_PATH__),
    __PROD__: ossFolder === 'prod',
    __QA__: ossFolder === 'qa',
    __DEV__: ossFolder === 'dev',
    __TEST__: ossFolder === 'test',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.ProvidePlugin({
    React: 'react',
    PureComponent: 'react/lib/ReactPureComponent',
    Component: 'react/lib/ReactComponent'
  }),
  new CopyWepackPlugin([
    {
      context: path.resolve('./src/resources'),
      from: '**/*',
      to: path.resolve('./dist')
    }
  ])
];

for (let k in entrys) {
  entry[k] = entrys[k].concat();
  plugins.push(
    new HtmlWebpackPlugin({
      chunks: ['vendor', k],
      chunksSortMode: 'dependency',
      template: `${srcDir}/index.html`,
      filename: `${versionFolder}${k}/index.html`
    })
  );
}

// 为qa环境添加一个无需版本号的index.html
if (ossFolder === 'qa') {
  plugins.push(
    new HtmlWebpackPlugin({
      chunks: ['vendor', 'index'],
      chunksSortMode: 'dependency',
      template: `${srcDir}/index.html`,
      filename: `index.html`
    })
  );
}

module.exports = {
  appLessPath,
  versionFolder,
  __ASSETS_PATH__,
  __UPLOAD_PATH__,
  srcDir,
  entry,
  plugins,
  dllVersion,
  dllLibDir: `${__dirname}/dll_lib/${dllVersion}`,
  stats: {
    colors: true,
    children: false
  },
  jsonpFunction: 'brokerWorkChunks',
  output: {
    path: path.resolve('./dist'),
    filename: `${versionFolder}[name]/[name].js`,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less'],
    modules: ['node_modules', `${srcDir}`],
    alias: {
      Assets: path.resolve(__dirname, 'src/assets/')
    }
  },
  cssLoaderCreator: function(type, env, needCssExtract) {
    const cssLoaderOptions = {
      sourceMap: env === 'prod'
    };
    if (type === 'local') {
      cssLoaderOptions['modules'] = true;
      cssLoaderOptions['importLoaders'] = 1;
      cssLoaderOptions['localIdentName'] = '[local]__[hash:base64:5]';
    }
    const arr = [];
    // if (env !== 'prod') {
    //   arr.push({ loader: 'style-loader' });
    // }
    if (needCssExtract) {
      arr.push({
        loader: MiniCssExtractPlugin.loader
      });
    } else {
      arr.push({ loader: 'style-loader' });
    }
    arr.push(
      {
        loader: 'css-loader',
        options: cssLoaderOptions
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: function() {
            return [
              cssnano({
                autoprefixer: {
                  add: true,
                  remove: true
                },
                safe: true,
                sourcemap: true
              })
            ];
          }
        }
      },
      { loader: 'less-loader' }
    );
    return arr;
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: '.uglifyJsCache',
        parallel: os.cpus().length - 1,
        uglifyOptions: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          // warnings: false,
          output: {
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false
          },
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
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          filename: `${versionFolder}[name]/[name].js`,
          minChunks: Infinity
        }
      }
    }
  }
};
