var path              = require('path'),
    DefinePlugin      = require('webpack').DefinePlugin,
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {app: path.join(__dirname, 'src', 'main.js')},
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/build/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')},
      {test: /\.jsx$/, loader: 'jsx-loader'},
    ]
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
