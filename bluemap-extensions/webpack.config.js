const path = require('path');

const OUTPUT_PATH = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bluemap-extensions.js',
    path: OUTPUT_PATH,
  },
  plugins: [
  ],
};
