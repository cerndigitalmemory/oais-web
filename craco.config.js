const path = require('path');

module.exports = {
  // Adds Less support to CRA
  plugins: [{ plugin: require('@semantic-ui-react/craco-less') }],
  // Make webpack / CRACO emit files in watch mode (for hot-reloading 
  //  with the docker-compose setup)
  devServer: {
    devMiddleware: {
        writeToDisk: true,
    },
  },
  webpack: {
    // Custom output path
    configure: (webpackConfig, { env, paths }) => {
      paths.appBuild = webpackConfig.output.path = path.resolve('build');
      return webpackConfig; // Important: return the modified config
    },
    entry: ['regenerator-runtime/runtime.js', './src/index.jsx'],
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
      path: path.resolve(__dirname, 'public', 'dist'),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: { presets: ['@babel/env'] },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(woff|woff2)$/,
          loader: 'file-loader',
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
        {
          test: /\.(ttf|eot|svg?)$/i,
          loader: 'file-loader',
        },
      ],
    },
    alias: {
      '@': path.resolve('src'),
    },
  },
};
