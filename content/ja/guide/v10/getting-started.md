---
name: はじめに
description: "初歩的なPreactの使い方の説明をします。ここではツールの設定やアプリケーションを書く方法を説明します。"
---

# はじめに

このガイドはPreact初心者向けの内容です。

ここではPreactアプリケーションを開発する主要な3つの方法を紹介します。あなたがPreact初心者なら、[Preact CLI](#preact-cliを使ったベストプラクティス)を選択することをお勧めします。

---

<div><toc></toc></div>

---

## ビルドツールを使わない方法

Preactはビルドやツールなしでブラウザで直に使うためのパッケージを提供しています。

```html
<script type="module">
  import { h, Component, render } from 'https://unpkg.com/preact?module';

  // アプリケーションを作成する。
  const app = h('h1', null, 'Hello World!');

  render(app, document.body);
</script>
```

[🔨 Glitch上で編集する](https://glitch.com/~preact-no-build-tools)

この方法で開発する欠点はJSX（ビルドが必要）が使えないことです。代わりに使用できるパフォーマンスの良い便利な方法を次に説明します。

### JSXの代替

上の例のように、直に`h`や`createElement`の呼び出しを書くことは面倒かもしれません。
JSXはHTMLと見た目が似ているので多くの開発者にとって理解が容易であるという利点があります。
JSXはビルドステップを必要とします。ビルドステップなしで開発したい場合は、JSXの代わりに[HTM][htm]を使うことをお勧めます。

[HTM][htm]は標準的なJavaScriptで動作し、JSXに似た構文で記述します。
HTMはビルドステップの代わりにJavaScriptの[Tagged Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates)を使います。
`Tagged Templates`はES2015で追加され、すべての[モダンブラウザ](https://caniuse.com/#feat=template-literals)でサポートされています。
HTMは今までのフロントエンドのビルドツールよりシンプルで学習コストが低いのでPreactアプリケーションを開発する方法としてよく使われるようになってきています。

```html
<script type="module">
  import { h, Component, render } from 'https://unpkg.com/preact?module';
  import htm from 'https://unpkg.com/htm?module';

  // htmをPreactで使う用意をする。
  const html = htm.bind(h);

  const app = html`<h1>Hello World!</h1>`;
  render(app, document.body);
</script>
```

[🔨 Glitch上で編集する](https://glitch.com/~preact-with-htm)

HTMについて詳しく知りたい場合はHTMの[ドキュメント][htm]をチェックしてください。

## Preact CLIを使ったベストプラクティス

[Preact CLI]を使うとモダンなウェブ開発に最適化されたPreactアプリケーションのビルド環境をすぐに用意することができます。
[Preact CLI]はwebpack、BabelそしてPostCSSのような標準的なツールをベースにしてできています。
使い始めるのに何らかの設定や事前の知識は必要ありません。
このシンプルさからPreactを使用し始めるときの最も一般的な方法になっています。
その名前の通り、Preact CLIはターミナルで動作する**c**ommand-**li**ne のツールです。
以下のようにしてグローバルにインストールします。

```bash
npm install -g preact-cli
```

すると、ターミナルに`preact`コマンドが新しく加えられます。
これで`preact create`コマンドを使って新しいアプリケーションを作成することができるようになりました。

```bash
preact create default my-project
```

上記のコマンドは[default template](https://github.com/preactjs-templates/default)をベースに新しいアプリケーションを作成します。
プロジェクトについて、必要な情報をいくつか聞かれるかもしれません。完了すると、
指定したディレクトリ(この場合`my-project`)にアプリケーションが生成されます。

> **Tip:** `template/`フォルダがあるGithubレポジトリはカスタムテンプレートとして利用することができます。
>
> `preact create <username>/<repository> <project-name>`

### 開発の準備

これで、アプリケーションを起動する準備ができました。
生成したプロジェクトフォルダ(上記の`my-project`)で以下のコマンドを実行して開発サーバを起動します。

```bash
# 生成したプロジェクトフォルダに移動
cd my-project

# 開発サーバを起動
npm run dev
```

サーバが起動するとブラウザで開いて確認するための開発用のローカルのURLが表示されます。
これで、アプリケーションを開発する準備が整いました。

### Productionビルドの実行

アプリケーションをデプロイしたいときのために、
CLIは高度に最適化されたProductionビルドを行う`build`コマンドを用意しています。

```bash
npm run build
```

ビルドが完了すると直接サーバにデプロイできる`build/`フォルダが生成されます。

> Preact CLIのコマンドについて詳しく知りたい場合は[Preact CLI Documentation](https://github.com/preactjs/preact-cli#cli-options)を確認してください。

## 既存のビルドシステムとの統合

既にビルドシステムを設定済みの場合、バンドラを使っている可能性が高いです。
よく使われているバンドラは[webpack](https://webpack.js.org/)、 [rollup](https://rollupjs.org)もしくは[parcel](https://parceljs.org/)です。
Preactはそれらをすぐに使うことができます。変更は必要ありません。

### JSXの設定

JSXをJavaScriptに変換するためにBabelプラグインを使用する必要があります。
それには[@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)を使います。
インストールが終わったら、JSXの変換後に使用する関数を設定します。

```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "h",
      "pragmaFrag": "Fragment",
    }]
  ]
}
```

> Babelの素晴らしいドキュメントが[こちら](https://babeljs.io/)にあります。Babelに関する疑問や設定方法についてはこちらを確認することをお勧めします。

### ReactをPreactにエイリアスする

Reactの広大なエコシステムを利用したいと思うことがあるでしょう。
React用に書かれたライブラリやコンポーネントも互換レイヤ(`preact/compat`)によりシームレスに動作します。
これを利用するにはすべての`react`と`react-dom`の`import`をPreactへ向ける必要があります。
このことを`エイリアスする`と言います。

#### webpackでエイリアスする

webpackでエイリアスするには、設定に`resolve.alias`セクションを追加する必要があります。
既にこのセクションが存在する場合は、そこにPreact用の設定が必要です。

```js
const config = { 
   //...
  "resolve": { 
    "alias": { 
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      // test-utilsの下にある必要があります。
    },
  }
}
```

#### Parcelでエイリアスする

Percelでは`package.json`に以下のような`alias`キーを追加します。

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat"
  },
}
```

#### Rollupでエイリアスする

Rollupでエイリアスするには、[@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias)をインストールする必要があります。
このプラグインは[@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)の前に配置する必要があります。

```js
import alias from '@rollup/plugin-alias';

module.exports = {
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' }
      ]
    })
  ]
};
```

#### Jestでエイリアスする

[Jest](https://jestjs.io/)もバンドラと同様にモジュールのパスを書き換えることができます。
シンタックスが正規表現に基づいているためwebpackとは少し違います。
以下をJestの設定に加えてください。

```json
{
  "moduleNameMapper": {
    "^react$": "preact/compat",
    "^react-dom/test-utils$": "preact/test-utils",
    "^react-dom$": "preact/compat"
  }
}
```

## preact/compatのTypeScriptの設定

あなたのプロジェクトはより広範囲のReactエコシステムを扱う必要があるかもしれません。
アプリケーションをコンパイルできるようにするには、以下のように`node_modules`の型チェックを無効にする必要があるでしょう。
これによって、ライブラリがReactを`import`した時、エイリアスが正常に動作します。

```json
{
  ...
  "skipLibCheck": true
}
```

[htm]: https://github.com/developit/htm
[Preact CLI]: https://github.com/preactjs/preact-cli
