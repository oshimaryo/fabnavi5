var webpack = require("webpack");
var DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {

  cache: true,

  entry: "./app/assets/javascripts/client/components/FabnaviApp.jsx",
  output: {
    path: __dirname + '/app/assets/javascripts/dist/client/',
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: "babel-loader",
      exclude: /node_modules/,
      query: {
        cacheDirectory: true,
        presets: ["react", "es2015", "stage-3"]
      }
    },{ 
     test: /\.css$/, 
     loader: "style-loader!css-loader" 
    },{
      test: /\.json$/,
      loader: "json-loader" 
    }]
  },

  resolve: {
    extensions: ["", ".js", ".jsx"],
    root:[ __dirname + "/node__modules"],
  },

  node: {
    fs: "empty"
  },
  devtool: "source-map",
  plugins: [
    new DashboardPlugin()
  ],
  watchOptions: {
   aggregateTimeout: 300,
   poll: 300
  }
};
