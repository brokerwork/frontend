const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    port: 9001,
    hot: true,
    historyApiFallback: true,
    proxy: {
      "/v1": "http://192.168.60.199:10900/"
    }
    // open: true
  }
});
