const path = require("path");

module.exports = {
  entry: ["regenerator-runtime/runtime.js", "./src/index.jsx"],
  mode: "production",
  output: {
    path: path.resolve(__dirname, "public", "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2)$/,
        loader: "file-loader",
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve("src"),
    },
  },
};
