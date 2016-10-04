'use strict';

//create development bundle

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../../../webpack.config.js');
const path = require('path');
const fs = require('fs');
const mainPath = path.resolve(__dirname, '..', 'client', 'index.js');

module.exports = function() {
  //fire up Webpack
  let bundleStart = null;
  let compiler = Webpack(webpackConfig);

  //notice when it starts bundling
  compiler.plugin('compile', function() {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  //notice time to complete bundle
  compiler.plugin('done', function() {
    console.log(`Bundled in ${(Date.now() - bundleStart) + 'ms!'}`);
  });


  let bundler = new WebpackDevServer(compiler, {

    // http://localhost:3000/build -> http://localhost:8080/build
    publicPath: '/build/',
    //configure hot replacement
    hot: true,

    //terminal configurations
    quiet: false,
    noInfo: true,
    stats: {
      colors: true
    }
  });

  bundler.listen(8080, 'localhost', function() {
    console.log('Bundling Project, please wait.....');
  });
};
