var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'simple-animation': './simple-animation/js/app.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: path.join('[name]', '[name].js')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style!css!autoprefixer'
      },
      {
        // See https://github.com/adobe-webplatform/Snap.svg/issues/341
        test: require.resolve('snapsvg'),
        loader: 'imports-loader?this=>window,fix=>module.exports=0'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: path.join(__dirname, 'simple-animation', 'public'), to: 'simple-animation'}
    ])
  ]
};
