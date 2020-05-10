/* eslint-disable */
const webpack = require('webpack');

module.exports = {
  entry: `${__dirname}/index.js`,
  output: {
    filename: 'coffeeNes.js',
    libraryTarget: 'umd',
    path: `${__dirname}/build`,
  },
  mode: 'none',
};
