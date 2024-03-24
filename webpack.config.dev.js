const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const dotenv = require('dotenv');

// const Dotenv = require('dotenv-webpack');
const env = dotenv.config().parsed;


module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
        'process.env': JSON.stringify(env)
    })
],
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
  },
});
