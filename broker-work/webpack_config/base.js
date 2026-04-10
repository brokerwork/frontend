const webpack = require('webpack');
const path = require('path');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssnano = require('cssnano');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const argv = require('yargs').argv;

// dll包版本，
// 由于dll包不会经常变更。
// 版本号可以在编译时，写死在代码中，在需要的时候再由前端变更
const dllVersion = '1.5.9';

//编译时添加 --folder 参数，表明要发布到oss上哪个文件夹;
let ossFolder = 'test';
// 发布时添加发布的版本文件夹
let versionFolder = '';
// 发布到那一个 dist 文件夹
let distFolder = 'dist2';

if (argv.env) {
  ossFolder = argv.env.folder || 'test';
  versionFolder = argv.env.version ? `${argv.env.version}/` : '';
  if (argv.env.folder === 'grey') {
    ossFolder = 'qa';
    distFolder = 'dist3';
  }
}

// 版本判断
let __PROD__ = true;
if (['test', 'qa', 'grey'].includes(ossFolder)) {
  __PROD__ = false;
}

const srcDir = './src';
const bootstrapLessPath = `${srcDir}/less`;
const leanUiLessPath = 'lean-ui/dist/index.less';
// 开发环境直接使用oss的文件，线上环境使用cdn上的路径加速
const __ASSETS_PATH__ = !__PROD__
  ? `//broker-static-dev.oss-cn-hangzhou.aliyuncs.com/${ossFolder}/${distFolder}`
  : `//broker-static.oss-cn-hangzhou.aliyuncs.com/${ossFolder}/${distFolder}`;
const __UPLOAD_PATH__ = `//broker-upload${
  !__PROD__ ? '-dev' : ''
}.oss-cn-hangzhou.aliyuncs.com/${ossFolder}`;

let __ENCRYPT__ = false;
if (argv.env) {
  __ENCRYPT__ = argv.env.encrypt === 'true';
}

const entrys = {
  index: [`${srcDir}/landings`]
};

const entry = {
  vendor: [
    'react',
    'react-dom',
    'react-intl',
    'react-redux',
    'react-router',
    'react-bootstrap',
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
    'rc-table',
    'uuid',
    'intl',
    'moment',
    'draft-js',
    'immutable',
    'element-resize-event',
    'echarts',
    'lean-ui',
    `${bootstrapLessPath}/bootstrap/bootstrap.less`,
    leanUiLessPath
  ]
};

const plugins = [
  new webpack.DefinePlugin({
    __ASSETS_PATH__: JSON.stringify(__ASSETS_PATH__),
    __UPLOAD_PATH__: JSON.stringify(__UPLOAD_PATH__),
    __PROD__,
    __QA__: ossFolder === 'qa',
    __GREY__: ossFolder === 'grey',
    __DEV__: !__PROD__,
    __ENCRYPT__,
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    )
  }),
  new CommonsChunkPlugin({
    name: 'vendor',
    filename: `${versionFolder}[name]/[name].js`,
    minChunks: 4
  }),
  new CaseSensitivePathsPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.ProvidePlugin({
    React: 'react',
    PureComponent: `${__dirname}/ProvidePluginTransfer/ReactPureComponent`,
    Component: `${__dirname}/ProvidePluginTransfer/ReactComponent`
  })
];

for (let k in entrys) {
  entry[k] = entrys[k].concat();
  plugins.push(
    new HtmlWebpackPlugin({
      chunks: ['vendor', k],
      chunksSortMode: 'dependency',
      template: `${srcDir}/index.html`,
      filename: `${versionFolder}${k}/index.html`,
      feVersion: versionFolder ? `${argv.env.version}` : 'development'
    })
  );
}
// 为qa环境添加一个无需版本号的index.html
if (ossFolder === 'qa' || ossFolder === 'grey') {
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
  bootstrapLessPath,
  versionFolder,
  __ASSETS_PATH__,
  __UPLOAD_PATH__,
  __PROD__,
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
    modules: ['node_modules', `${srcDir}`]
  },
  cssLoaderCreator: function(type, env) {
    const cssLoaderOptions = {
      autoprefixer: false,
      minimize: false,
      sourceMap: true
    };
    if (type === 'local') {
      cssLoaderOptions['modules'] = true;
      cssLoaderOptions['importLoaders'] = 1;
      cssLoaderOptions['localIdentName'] = '[local]__[hash:base64:5]';
    }
    const arr = [];
    if (env !== 'prod') {
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
  }
};
