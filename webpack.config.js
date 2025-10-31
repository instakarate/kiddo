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
      templateContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Karate Kido Game</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="description" content="Karate Kido - Action Fighting Game">
  <style>
    body, html {
      margin: 0;
      padding: 0;
      background: #222;
      height: 100%;
      overflow: hidden;
    }
    #game-container {
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #loading-screen {
      position: absolute;
      width: 100vw;
      height: 100vh;
      background: #222;
      color: #fff;
      font-size: 2em;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    canvas {
      display: block;
      margin: 0 auto;
      max-width: 100vw;
      max-height: 100vh;
    }
  </style>
</head>
<body>
  <div id="loading-screen">Loading Karate Kido...</div>
  <div id="game-container"></div>
  <script>
    window.onload = function() {
      document.getElementById('loading-screen').style.display = 'none';
    };
  </script>
</body>
</html>`,
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
