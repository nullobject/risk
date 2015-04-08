var DefinePlugin      = require('webpack').DefinePlugin,
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path              = require('path');

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
      loader:  'babel'
    }, {
      test:    /\.jsx$/,
      exclude: exclude,
      loaders: ['jsx', 'babel']
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
