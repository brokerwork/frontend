const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
//编译根据环境变量，表明要发布到oss上哪个文件夹;
let ossFolder = '/test';
if (process.env.NODE_ENV === 'test') {
  ossFolder = '/qa'
} else if (process.env.NODE_ENV === 'production') {
  ossFolder = '/prod'
}
// 开发环境直接使用oss的文件，线上环境使用cdn上的路径加速
const __ASSETS_PATH__ = ossFolder === '/prod'
? "//twstatic.lwork.com/mobile/prod"
: `//traderaccount.oss-cn-hangzhou.aliyuncs.com/mobile${ossFolder}`;
const argv = require('minimist')(process.argv.slice(1));
var version = argv.version || "dev";
const baseConfig = require('./webpack.base.config')

const isProd = process.env.NODE_ENV == 'production'
module.exports = merge(baseConfig, {
	output: {
		path: path.resolve('dist'),
		filename: `${version}/[name].js`,
		publicPath: __ASSETS_PATH__+'/'
	},
    plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: !isProd,
            mangle:false
        }),
    ]
});
