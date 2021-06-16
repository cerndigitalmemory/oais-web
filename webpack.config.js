const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devtool: "eval-source-map",
  output: {
    path: path.resolve(__dirname, "public", "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  plugins: [new VueLoaderPlugin()],
};
