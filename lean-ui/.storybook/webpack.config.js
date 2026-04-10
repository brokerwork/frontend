const path = require("path");
const genDefaultConfig = require("@storybook/react/dist/server/config/defaults/webpack.config.js");

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules.push(
    {
      test: /\.(ts|tsx)$/,
      include: path.resolve(__dirname, "..", "components"),
      loader: require.resolve("ts-loader")
    },
    {
      test: /\.less$/,
      include: [
        path.resolve(__dirname, "..", "less"),
        path.resolve(__dirname, "..", "stories")
      ],
      use: [
        {
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        },
        {
          loader: "less-loader"
        }
      ]
    }
  );
  config.resolve.extensions.push(".ts", ".tsx", ".less", ".js");

  return config;
};
