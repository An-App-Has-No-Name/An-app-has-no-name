'use strict';
var Webpack = require('webpack');
var path = require('path');
var mainPath = path.resolve(__dirname, 'public','client', 'index.jsx');
// require('babel-polyfill');

const config = {
  entry: [

    //hot style updates

     'webpack/hot/dev-server',
     'webpack-dev-server/client?http://localhost:8080',
    './public/client/index.jsx'
  ],
  output: {
    path: path.resolve(__dirname, 'public', 'build'),
    pathinfo: true,
    publicPath: '/build/',
    filename: 'bundle.js',
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-2']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()]
};

module.exports = config;
