const WorkerPlugin = require('worker-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/physics.worker.ts',
  output: {
    filename: 'ammoPhysics.worker.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    // new CopyPlugin({
    //   patterns: [{ from: 'src/lib', to: '' }],
    // }),
    // new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // new WorkerPlugin({ globalObject: 'self' }),
  ],
}
