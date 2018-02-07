/**
 * 开发环境下的webpack配置
 */
const path =  require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: path.join(__dirname, 'src/app.js')
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: '[name]_chunk.js'
  },
  module: {
    rules: [
      {
        test: /^.*\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@babel/preset-react']
            }
          }
        ]
      },
      {
        test: /^.*\.html$/,
        use: ['html-loader', {
          loader: './loader',
          options: {
            buildFile: './engineering/build',
            rootFile: 'app.js',
            type: 'html'
          }
        }]
      },
      {
        test: /^.*\.pug$/,
        use: ['pug-loader', {
          loader: './loader',
          options: {
            buildFile: './engineering/build',
            rootFile: 'app.js',
            type: 'pug'
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: path.join(__dirname, './src/index.html')
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index2.html',
      template: path.join(__dirname, './src/index2.pug')
    })
  ]
};