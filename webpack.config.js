var webpack = require("webpack");
var isProduction = process.env["NODE_ENV"] === "production"; 

module.exports = {

  cache: !isProduction,

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
  plugins: [],
  watchOptions: {
   aggregateTimeout: 300,
   poll: 300
  }
};
