## フォルダ構成図

※必要なもののみ記載しています。

```
/
├ .editorconfig     書き味のルール指定、エディタにEditorConfigの拡張を入れましょう
├ .eslintrc.js      JSのLintに使用 ルールは適宜変更してください
├ .markuplintrc     HTML(≒pug)のLintに使用 ルールは適宜変更してください
├ .prettierrc       HTML/JS/CSSのLintや整形に使用 ルールは適宜変更してください
├ .pug-lint.json    pugファイルのLintに使用 ルールは適宜変更してください
├ webpack.common.js webpackの設定ファイル 適宜変更してください
├ webpack.dev.js    webpackの開発環境用の設定 適宜変更してください
├ webpack.prod.js   webpackの本番環境用の設定 適宜変更してください
├ dist/             `yarn release`を行うことで作成される本番リリース用ファイルの出力先　ここのファイルは直接編集しないこと
└─ src/
    ├── html/             pugファイルを格納する
    │    ├── template/    meta, header, footer等の共通のHTMLや設定が記載されたファイル
    │    ├── layouts/     各ページの継承元となるレイアウトファイル
    │    └── components/  ページ作成のパーツ、セクションごとのファイルを格納する
    ├── images/            画像を格納する
    ├── js/                jsを格納する
    │    └── app.js       必ず必要 jsファイルを増やしたら必ずこのファイルでimportする
    ├── scss/             scssファイルを格納する(_のつかないファイルをdist/配下に出力します)
    │    ├── assets/      通常はここに出力したいcssごとにファイルを置く
    │    │    └── css/
    │    │        ├── app.scss      サイト共通のCSS(baseやcomponents)
    │    │        └── xxxxx.scss    ページごとのCSS どうしても必要な場合のみ作成を
    │    ├── base/
    │    │    ├──_mixin.scss        独自のMixin置き場
    │    │    ├── _reset.scss       独自のリセットCSS置き場
    │    │    └── _variable.scss    独自の変数置き場
    │    └── components/
    │          └── xxxxx/               各種コンポーネント
    │                └── _yyyyyy.scss   各種コンポーネント
    └── static/ そのままdist配下に展開される（クライアントから支給されて、手を入れずに反映が必要なものはここに入れる）
          └── assets/  フォント、動画、PDF等のsrcで管理していないファイルを格納する
```

## 設定のいじり方

ビルドの設定を変更する場合は、下記のWebpackの設定ファイルを編集してください。

- /webpack.common.js
- /webpack.dev.js
- /webpack.prod.js

※編集する際はファイル内のコメントを参考に。

###  HTML/CSS/JSのminify設定箇所

#### HTMLをminifyしない手順
- /webpack.common.jsの`minifyHtml = true`を`minifyHtml = false`に変更する

#### cssをminifyしない手順
- /webpack.prod.jsの`minifyCSS = true`を`minifyCSS = false`に変更する

#### jsをminifyしない手順
- /webpack.prod.jsの`minifyJS = true`を`minifyJS = false`に変更する

## その他
- `yarn start`でサーバー起動中に新規のpugファイルを追加しても認識されないので、新規のhtmlファイルを追加した後はターミナルで`Ctrl+C`を押してサーバーを止めて再度、`yarn start`してください。  

- pugに直接css,jsを読み込む必要はありません。（src/js/app.jsからimportされたcss,jsを辿って自動で読み込んでくれます）  
  そのため、新しく追加したい場合はsrc/js/app.jsでimportをしてください。

- 外部のjs(swiperなど)を追加した場合、そのjsファイルで独自のcssを読み込む必要がある場合があるので、公式のドキュメントを確認してください。  
例）
```
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
```

- SCSSで```background-image```のパスが正しくないとエラーが出るが、仕様です。
src/scss/components内のscssから```background-image```を使う場合は、`../../../images/~`で指定してください。

- 先方から支給されたファイル（CSSやJS）をそのまま使いたい場合  
  `static/`ディレクトリ配下に設置して、`src/html/template/_common_css.pug`や`_common_script.pug` に読み込みたいファイルのパスを記述してください。
