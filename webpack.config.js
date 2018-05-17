const fs = require('fs')
const _ = require('lodash')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const resolve = require('path').resolve

function getEntries(folder, jsFiles) {
  return fs
    .readdirSync(folder)
    .filter(file => file.match(jsFiles ? /.*\.js$/ : /.*\.css$/))
    .map(file => {
      return {
        name: file.substring(0, file.length - 3),
        path: folder + file,
      }
    })
    .reduce((memo, file) => {
      memo[file.name] = file.path
      return memo
    }, {})
}

module.exports = [
  {
    mode: 'production',
    entry: getEntries('./lib/app/', true),
    output: {
      path: resolve('./lib/app'),
      filename: '[name].js',
    },
  },
  {
    mode: 'production',
    entry: getEntries('./lib/app/scripts/', true),
    output: {
      path: resolve('./lib/app/scripts'),
      filename: '[name].js',
    },
  },
  {
    mode: 'production',
    entry: getEntries('./lib/app/'),
    output: {
      path: resolve('./lib/app'),
      filename: '[name]css',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?minimize=true',
          }),
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin('[name]css'), // css file will override generated js file
    ],
  },
  {
    mode: 'production',
    entry: getEntries('./lib/app/styles/'),
    output: {
      path: resolve('./lib/app/styles'),
      filename: '[name]css',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?minimize=true',
          }),
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin('[name]css'), // css file will override generated js file
    ],
  },
]
