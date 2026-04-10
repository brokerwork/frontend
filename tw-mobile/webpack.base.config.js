const path = require('path')
const webpack = require('webpack')
const cssnano = require('cssnano')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const argv = require('minimist')(process.argv.slice(1));
var version = argv.version || "dev";
const PATHS = {
	src: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'dist'),
}

module.exports = {
	entry: {
		'index': './src/index.js',
		'error': './src/error.js',
		'feedback': './src/feedback.js'
	},
	resolve: {
		extensions: [".js", ".jsx", ".less"],
		modules: ['node_modules', PATHS.src]
	},
	module: {
		rules: [{
			test: /\.(less|css)$/,
			use: ExtractTextPlugin.extract('css-loader?-autoprefixer&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!less-loader')
		},
		{
			test: /(\.jsx|\.js)$/,
			include: PATHS.src,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['react', 'stage-1', 'env'],
					plugins: ['transform-runtime', 'transform-class-properties']
				}
			}
		},
		{
			test: /\.(jpg|jpeg|gif|png)$/,
			use: 'url-loader'
		}]
	},
	plugins: [
        new CommonsChunkPlugin({
          name: 'common',
          filename: `${version}/common.js`,
          minChunks: 4
        }),
        new HtmlWebpackPlugin({
          chunks: ['common', 'index'],
          chunksSortMode: 'dependency',
          template: "./template.html",
          filename: `${version}/index.html`,
        }),
		new ExtractTextPlugin(`${version}/[name].css`),
	],
}
