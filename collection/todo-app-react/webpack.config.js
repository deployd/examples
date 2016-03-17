const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const sources = [
  './node_modules/react/dist/react.min.js',
  './node_modules/react-dom/dist/react-dom.min.js',
  './app/index.js'
];

module.exports = {
  entry: {
    bundle: sources
  },
  output: {
    path: './public',
    filename: 'js/[name].js'
  },
  module: {
    loaders: [
      { test: /\.js/, loader: 'babel' },
      { test: /\.html$/, loader: 'html' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css') }
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:2403'
    })
  ]
};
