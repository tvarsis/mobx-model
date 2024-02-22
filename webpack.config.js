var webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  devtool: "source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!qs)/,
        loader: "babel-loader",
      },
    ],
  },
  output: {
    libraryTarget: "umd",
    library: "mobx-model",
    filename: "lib/index.js",
  },
};
