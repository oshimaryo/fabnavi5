var webpack = require("webpack");
var BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {

  cache: true,

  entry: "./app/assets/javascripts/client/fabnavi.js",
  output: {
    path: __dirname + '/app/assets/javascripts/dist/client/',
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: "babel",
      exclude: /(node_modules|bower_components)/,
      query: {
        cacheDirectory: true,
        presets: ["es2015"]
      }
    },{ 
     test: /\.css$/, 
     loader: "style-loader!css-loader" 
    },{ 
      test: /\.jade$/, 
      loader: "react-jade-loader?split=true" 
    },{
      test: /\.json$/,
      loader: "json-loader" 
    }]
  },

  resolve: {
    root:[ __dirname + "/bower_components"],
    alias: {
      "react": __dirname + "/node_modules/react/react.js",
      "react-dom": __dirname + "/node_modules/react/lib/ReactDOM.js"
    }
  },

  plugins: [
    new BowerWebpackPlugin()
  ],

  node: {
    fs: "empty"
  }
};
