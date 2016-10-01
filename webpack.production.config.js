var Webpack = require('webpack');
var path = require('path');

var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var mainPath = path.resolve(__dirname, 'public', 'client', 'index.jsx');

var config = {

  // We change to normal source mapping
  devtool: 'source-map',
  entry: mainPath,
  output: {
    path: path.resolve(__dirname, 'public', 'build'),
    filename: 'bundle.js'
  },
  debug: true,
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-2']
      }
    }, { test: /\.css$/,  loader: "style-loader!css-loader" },
    { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
    { test: /\.gif$/, loader: "url-loader?mimetype=image/png" },
    { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" },
    { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]" }
  ]
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
