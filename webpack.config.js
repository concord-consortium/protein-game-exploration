var path = require('path');

module.exports = {
    entry: "./js/app.js",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "app.js"
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
      }
};
