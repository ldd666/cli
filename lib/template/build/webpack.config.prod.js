'use strict'
<%if(presets.selectFeatures.indexOf('qcdn') > -1){%>
const CdnPlugin = require('./cdn-plugin');
<%}%>
const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')

module.exports = merge(baseConfig, {
  mode: 'production',
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader'
        ]
      }, {
        test: /\.styl(us)?$/,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader', 
          'stylus-loader'
        ]
      }
      <%if(presets.selectFeatures.indexOf('qcdn')>-1){%>
        ,{
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [
           path.resolve(__dirname, './cdn-loader.js')
          ]
        },
      <%}%>
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
    <%if(presets.selectFeatures.indexOf('qcdn') > -1){%>
    ,new CdnPlugin()
    <%}%>
  ]
})