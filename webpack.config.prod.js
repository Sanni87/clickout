const path = require('path');

module.exports = {
  entry: './src/onclickout.js',
  output: {
    filename: 'onclickout.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};