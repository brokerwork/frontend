var path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HappyPack = require("happypack");
const os = require("os");
const webpack = require("webpack");
const srcDir = path.resolve(__dirname, "src");
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  entry: { index: "./src/landings" },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/[name].bundle.js",
    chunkFilename: "[name].js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]__[hash:base64:5]"
              }
            }
          },
          {
            loader: "less-loader"
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "happypack/loader?id=happybabel&cacheDirectory=true"
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader?limit=10000&name=image/[name].[ext]"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      }
    ]
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "/")],
    extensions: [".js", ".json", ".jsx", ".css"],
    alias: {
      src: __dirname + "/src",
      landings: __dirname + "/src/landings",
      assets: __dirname + "/src/assets",
      less: __dirname + "/src/less",
      hooks: __dirname + "/src/hooks",
      hooks: __dirname + "/src"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "output",
      template: `${srcDir}/index.html`,
      filename: `index.html`
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HappyPack({
      id: "happybabel",
      loaders: ["babel-loader", "eslint-loader"],
      threadPool: happyThreadPool,
      verbose: true
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        common: {
          name: "common",
          chunks: "initial",
          priority: 2,
          minChunks: 2
        },
        vendor: {
          // 将第三方模块提取出来
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          priority: 10, // 优先
          enforce: true
        }
      }
    }
  }
};
