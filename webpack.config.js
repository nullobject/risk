var path = require('path');

module.exports = {
  entry: {app: path.join(__dirname, 'src', 'index.js')},
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
      {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      {test: /\.jsx$/, loader: 'jsx-loader'},
    ]
  }
};
