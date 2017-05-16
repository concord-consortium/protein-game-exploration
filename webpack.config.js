var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'simple-animation': './simple-animation/js/app.js',
    'simple-animation-fv': './simple-animation-fv/js/app.js',
    'agent-model': './agent-model/src/app.js',
    'agent-exploration': './agent-exploration/js/app.js'
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
      {from: path.join(__dirname, 'public')},
      {from: path.join(__dirname, 'simple-animation', 'public'), to: 'simple-animation'},
      {from: path.join(__dirname, 'simple-animation-fv', 'public'), to: 'simple-animation-fv'},
      {from: path.join(__dirname, 'agent-model', 'public'), to: 'agent-model'},
      {from: path.join(__dirname, 'agent-exploration', 'public'), to: 'agent-exploration'}
    ])
  ]
};
