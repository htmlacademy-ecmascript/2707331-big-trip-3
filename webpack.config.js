const path = require('node:path');

module.exports = {
  entry: './main.js',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true,
  },

  devtool: 'source-map',
};
