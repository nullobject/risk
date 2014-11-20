var path              = require('path'),
    DefinePlugin      = require('webpack').DefinePlugin,
    ExtractTextPlugin = require('extract-text-webpack-plugin');

var exclude = /(lib|node_modules)/;

module.exports = {
  entry: {app: path.join(__dirname, 'src', 'main.js')},
  output: {
    path:       path.join(__dirname, 'build'),
    publicPath: '/build/',
    filename:   '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test:    /\.js$/,
      exclude: exclude,
      loader:  '6to5'
    }, {
      test:    /\.jsx$/,
      exclude: exclude,
      loaders: ['jsx', '6to5']
    }, {
      test:    /\.less$/,
      exclude: exclude,
      loader:  ExtractTextPlugin.extract('style', 'css!less')
    }]
  },
  plugins: [
    new DefinePlugin({
      DEBUG:       process.env.NODE_ENV === 'debug'       || false,
      DEVELOPMENT: process.env.NODE_ENV === 'development' || true,
      PRODUCTION:  process.env.NODE_ENV === 'production'  || false
    }),
    new ExtractTextPlugin('style.css', {allChunks: true})
  ]
};
