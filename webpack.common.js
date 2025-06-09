const path = require('path')
const glob = require('glob')

// 出力先をクリーンアップするプラグイン
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// HTMLを自動で出力するプラグイン
const HtmlWebpackPlugin = require('html-webpack-plugin')
// CSSを自動で出力するプラグイン
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// ESLintプラグイン
const ESLintPlugin = require('eslint-webpack-plugin')
// SCSSをESLINTに登録する
const StyleLintPlugin = require('stylelint-webpack-plugin')
// PUGをESLINTに登録する
const PugLintPlugin = require('puglint-webpack-plugin')
// ファイルをコピーするプラグイン
const CopyPlugin = require('copy-webpack-plugin')

// ------------------------------------------
// 設定
// ------------------------------------------
// ディレクトリ設定
const srcDir = 'src'
const scssBaseDir = path.resolve(srcDir, 'scss')
const jsBaseDir = path.resolve(srcDir, 'js')
const pugBaseDir = path.resolve(srcDir, 'html')

// release時、サブディレクトリに出力する場合は入力
const outputSubDir = ''
// アセットをディレクトリにまとめる場合は入力
// 例 assets 等
const outputAassetsDir = 'assets'

// HTMLをminifyするかどうか
const minifyHtml = false
// ------------------------------------------

// srcディレクトリのパスをdist用に変換する
const convertAssetPath = (file) => {
  let filename = file.filename
  // staticはdist直下に出力
  filename = filename.replace(/^src\/static\//, '')
  // その他のsrc配下のファイルはassets配下に出力j
  const dir = outputAassetsDir ? `${outputAassetsDir}/` : ''
  return filename.replace(/^src\//, dir)
}

// html-webpack-pluginのインスタンス作成
const templates = []
glob
  .sync('**/*.pug', {
    ignore: '**/_*.pug',
    cwd: pugBaseDir,
  })
  .map((file) => {
    // 取得したpugファイルを配列に格納
    templates.push(
      new HtmlWebpackPlugin({
        // @see https://github.com/jantimon/html-webpack-plugin#options
        template: path.resolve(pugBaseDir, file),
        filename: file.replace(/\.pug$/, '.html'),
        hash: true,
        cache: false,
        minify: minifyHtml,
      })
    )
  })
//

// 必要に応じて触る必要あり ※コメントを要確認 start
module.exports = (env) => {
  console.log('server:', env.WEBPACK_SERVE)
  const distDir = env.WEBPACK_SERVE ? 'dist' : `dist/${outputSubDir}`
  return {
    // エントリーポイントとなるjsファイルを指定する
    entry: {
      app: jsBaseDir + '/app.js',
      // 複数ある時は、下記のように追加する
      // sample: './src/js/sample.js',
    },
    // 必要に応じて触る必要あり ※コメントを要確認 end
    // 出力させるファイル達
    output: {
      // 出力先のフォルダの設定
      path: path.resolve(__dirname, distDir).replace(/\\/g, '/'),
      filename: path.join(outputAassetsDir, 'js/[name].js').replace(/\\/g, '/'),
    },
    // プラグインの読み込み
    plugins: [
      new CleanWebpackPlugin(),
      // .pugを自動で出力する
      ...templates,
      // cssを出力するプラグイン
      new MiniCssExtractPlugin({
        filename: path.join(outputAassetsDir, 'css/[name].css').replace(/\\/g, '/'),
      }),
      new ESLintPlugin({
        extensions: ['js', 'jsx'],
        exclude: ['/node_modules/'],
        fix: true,
        failOnError: true,
      }),
      new StyleLintPlugin({
        configFile: '.stylelintrc.json',
        fix: true,
      }),
      new PugLintPlugin({
        context: srcDir,
        files: '**/*.pug',
        config: Object.assign({ emitError: true }, require('./.pug-lint.json')),
      }),
      new CopyPlugin({
        patterns: [
          { context: 'src/static', from: '**/*.*', to: path.resolve(__dirname, 'dist'), noErrorOnMissing: true },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(sass|css|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
                sassOptions: {
                  outputStyle: 'expanded',
                  includePaths: [scssBaseDir],
                },
              },
            },
          ],
        },
        {
          test: /\.(ttf|otf|eot|woff2?|mp4|pdf)$/,
          type: 'asset/resource',
          generator: {
            filename: convertAssetPath,
          },
        },
        {
          test: /\.(jpe?g|gif|png|svg)/,
          type: 'asset/resource',
          generator: {
            filename: convertAssetPath,
          },
          // 画像圧縮を入れる場合は↓を使用する
          // use: [
          //   {
          //     loader: 'image-webpack-loader',
          //     options: {
          //       disable: true,
          //       // 適宜設定してください
          //       // https://github.com/tcoopman/image-webpack-loader#usage
          //     },
          //   },
          // ],
        },
        {
          test: /\.pug/,
          use: [
            {
              loader: 'html-loader',
              // お客さんから既存のソースをいただいた場合のlinkタグ、scriptタグをバンドルの対象から外す処理
              options: {
                sources: {
                  list: [
                    '...',
                    {
                      tag: 'link',
                      attribute: 'href',
                      type: 'src',
                      filter: (tag, attribute, attributes, resourcePath) => {
                        if (/my-html\.html$/.test(resourcePath)) {
                          return false
                        }
                        if (!/stylesheet/i.test(attributes.rel)) {
                          return false
                        }
                        if (attributes.type && attributes.type.trim().toLowerCase() !== 'text/css') {
                          return false
                        }
                        return true
                      },
                    },
                    {
                      tag: 'script',
                      attribute: 'src',
                      type: 'src',
                      filter: (tag, attribute, attributes, resourcePath) => {
                        if (/my-html\.html$/.test(resourcePath)) {
                          return false
                        }
                        if (!/stylesheet/i.test(attributes.rel)) {
                          return false
                        }
                        if (attributes.type && attributes.type.trim().toLowerCase() !== 'text/javascript') {
                          return false
                        }
                        return true
                      },
                    },
                  ],
                },
                minimize: minifyHtml,
              },
            },
            {
              loader: 'pug-html-loader',
              options: {
                basedir: path.resolve(pugBaseDir),
                pretty: true,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.scss', '.pug', '.png', '.jpg', '.svg', '...'],
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
}
