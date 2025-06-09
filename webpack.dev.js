// webpack.common.jsの設定を使えるようにする
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const path = require('path')
module.exports = (env) => {
  return merge(commonConfig(env), {
    mode: 'development',
    // ソースマップを追加する
    // devtool: 'eval-cheap-source-map',
    stats: {
      children: true,
      errorDetails: true,
    },
    // 開発用サーバーの設定
    devServer: {
      static: {
        directory: path.join(__dirname, 'src/html/'),
      },
      hot: true,
      open: true,
      port: 8000,
    },
    optimization: {
      minimize: false,
    },
  })
}
