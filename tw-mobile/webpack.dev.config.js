const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const opn = require('open-browser-webpack-plugin')
const argv = require('minimist')(process.argv.slice(1));
const version = argv.version || "dev";

const baseConfig = require('./webpack.base.config')

const PATHS = {
	src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'dist'),
    port: 3003
};

module.exports = merge(baseConfig, {
	output: {
		path: PATHS.build,
		filename: `${version}/[name].js`,
		publicPath: '/'
	},
    devServer: {
        contentBase: PATHS.build,
        historyApiFallback:  {
			index: `/${version}/index.html`,
		  },
		hot: true,
		overlay: {
			warnings: true,
			errors: true
		},
        inline: true,
        stats: 'errors-only',
        host: '0.0.0.0',
        // host: '192.168.0.160/',
        port: PATHS.port,
        proxy: getProxy(false),
        disableHostCheck: true
    },
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
})

function getProxy(isUsingLocalMockData) {
	if (isUsingLocalMockData) {
		console.warn('please make sure you run "node server.js" on another terminal')
	}
	//let proxyHost = isUsingLocalMockData ? 'localhost' : 'auth.dev.traderwork.com';
	let proxyHost = isUsingLocalMockData ? '0.0.0.0' : 'trader.tamsc.lwork.com';
	//let proxyHost = isUsingLocalMockData ? 'localhost' : 'sunny.twqa.lwork.com';
	let proxyPort = isUsingLocalMockData ? 3003 : 80;
	let proxyConfig = {
		'/v1/*': {
			target: {
				host: proxyHost,
				port: proxyPort,
				protocol: 'http'
			},
			secure: false,
			changeOrigin: !isUsingLocalMockData
		},
		'/api/*': {
			target: {
				host: proxyHost,
				port: proxyPort,
				protocol: 'http'
			},
			secure: false,
			changeOrigin: !isUsingLocalMockData
		},
		'/ali/oss/*': {
			target: {
				host: proxyHost,
				port: proxyPort,
				protocol: 'http'
			},
			secure: false,
			changeOrigin: !isUsingLocalMockData
		},
		'/ali/oss/preview/*': {
			target: {
				host: 'auth.dev.traderwork.com',
				port: 80,
				protocol: 'http'
			},
			secure: false,
			changeOrigin: true
		}

	}
	return proxyConfig;
}