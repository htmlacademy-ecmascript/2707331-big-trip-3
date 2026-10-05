const path = require('node:path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true,
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
        },
      ],
    }),
  ],
};
