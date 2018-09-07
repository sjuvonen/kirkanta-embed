const config = require("./webpack.config.js");
const merge = require("webpack-merge");
const path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(config, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "v1/[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ["env"]
          }
        }
      }
    ]
  },
  plugins: [new UglifyJsPlugin]
});