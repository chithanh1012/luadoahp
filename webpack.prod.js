// webpack.common.jsの設定を使えるようにする
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
// console.logを表示しないためのプラグイン
const TerserPlugin = require('terser-webpack-plugin')
// CSSの最適化(css-nano)
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// ------------------------------------------
// 設定
// ------------------------------------------
// CSSをminifyするかどうか
const minifyCSS = true
// JSをminifyするかどうか
const minifyJS = true
// ------------------------------------------

const minimizers = [
  new TerserPlugin({
    extractComments: false,
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  }),
]

// CSSの最適化（modeをproductionにしないと動かない）
if (minifyCSS) minimizers.push(new CssMinimizerPlugin())

module.exports = (env) => {
  return merge(commonConfig(env), {
    // minifyしたくない場合のやり方はREADME.mdに記載してあるので、そちらを参考にしてください
    // 基本的には、この設定のまま使ってください
    mode: 'production',
    // console.logとコメントを削除する設定
    optimization: {
      minimizer: minimizers,
      minimize: minifyJS,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  })
}
