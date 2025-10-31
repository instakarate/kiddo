// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: argv.mode === 'production' ? '[name].[contenthash].js' : '[name].js',
    publicPath: '/kiddo/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif|wav|mp3)$/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Karate Kido Game',
      inject: 'body',
    }),
  ],
  devServer: {
    static: './dist',
    port: 8080,
    open: true,
    hot: true,
    compress: true,
  },
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimize: argv.mode === 'production',
  },
});
