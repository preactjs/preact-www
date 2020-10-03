---
name: Preact 8.xからのアップグレード
description: 'Preact 8.xからPreact Xにアップグレードする'
---

# Preact 8.xからのアップグレード

このドキュメントはPreact 8.xのアプリケーションをPreact Xにアップグレードする方法を解説します。主に3つのセクションに別れています。

Preact Xは`Fragments`、`hooks`等の多くの新しい機能を提供します。また、Reactのエコシステムとの互換性を大幅に向上しました。
その際、破壊的変更を最小にするように努めましたが、機能を実装するために多少の破壊的変更が存在します。

---

<div><toc></toc></div>

---

## 依存しているライブラリのアップグレード

_ここではパッケージマネージャとして`npm`を使用しますが、`yarn`のような他のパッケージマネージャを使用しても問題ありません。_

では、始めましょう。最初にPreact Xをインストールします。

```bash
npm install preact
```

`preact-compat`はコアに移動したので必要ありません。削除します。

```bash
npm remove preact-compat
```

### Preactに関連したライブラリの更新

Preact関連のライブラリもメジャーバージョンを上げてPreact Xに対応させました。
これによって、ユーザ(特にエンタープライズユーザ)に安定したエコシステムを提供できます。
以下の表にあるように、`preact-render-to-string`などを使っている場合、Preact Xに対応しているバージョンに変更する必要があります。

| ライブラリ                | Preact 8.x | Preact X |
| ------------------------- | ---------- | -------- |
| `preact-render-to-string` | 4.x        | 5.x      |
| `preact-router`           | 2.x        | 3.x      |
| `preact-jsx-chai`         | 2.x        | 3.x      |
| `preact-markup`           | 1.x        | 2.x      |

### `preact-compat`はコアに移動しました

サードパーティのReactライブラリをPreactで動作させるために**互換**レイヤーとして`preact/compat`があります。
互換レイヤーは以前のバージョンでは別パッケージで提供していましたがコアとの協調を容易にするためにコアのレポジトリに移動しました。
既存のインポートやエイリアスの宣言を`preact-compat`から`preact/compat`に変更する必要があります。(スラッシュに注意してください)

スペルミスに注意してください。
よくあるミスは`compat`を`compact`と書くことです。
`compat`は`compatibility`(互換性)から取りました。
これが名前の由来です。

> `preact-cli`を使っているならこのステップは既に完了しています。 :tada:

### サードパーティライブラリ

Preact Xには破壊的変更が含まれているため、既存のライブラリの中には動かなくなるものがあるかもしれません。
多くはPreact Xのベータリリース後に修正されましたが、まだ動かないものがあるかもしれません。

#### preact-redux

`preact-redux`はまだ更新されていないライブラリの1つです。
良いニュースは`preact/compat`はReactと高いレベルで互換性があるので、ReduxのReactバインディングである`react-redux`をそのまま使用できることです。
つまり、`react-redux`を使えば解決します。使用する際はバンドラ内で`react`と`react-dom`が[`preact/compat`にエイリアスされていること](getting-started#ReactをPreactにエイリアスする)を確認してください。

1. `preact-redux`を削除する。
2. `react-redux`をインストールする。

#### mobx-preact

Reactエコシステムとの互換性が改善したため、このライブラリは必要なくなりました。代わりに`mobx-react`を使用してください。

1. `mobx-preact`を削除する。
2. `mobx-react`をインストールする。

#### styled-components

Preact 8.xは`styled-components@3.x`までしか動作しません。
Preact Xではこの問題は解決しました。最新の`styled-components`を使用することができます。
使用する際は正しくPreactをReactのエイリアスにすることを確認してください。

#### preact-portal

`Portal`コンポーネントは`preact/compat`に加えられました。

1. `preact-portal`を削除する。
2. `preact/compat`から`createPortal`をインポートする。

## コードを変更する

### namedエクスポートを使う

ツリーシェイキング(tree-shaking)をサポートするためにPreact Xでは`default`エクスポートをPreactのコアで行いません。
この利点はバンドル時に必要なコードだけ含めることができる点です。

```js
// Preact 8.x
import Preact from "preact";

// Preact X
import * as preact from "preact";

// より良い方法: Named exports (Preact 8.xとPreact Xで動作します。)
import { h, Component } from "preact";
```

_この変更は`preact/compat`に影響はありません。`preact/compat`ではReactとの互換性のために`default`エクスポートと`named`エクスポートの両方が可能です。_

### `render()`は常にコンテナ内の子要素との差分を取る

Preact 8.xで`render()`を実行すると常にコンテナの末尾に要素が追加されます。

```jsx
// Existing markup:
<body>
  <div>hello</div>
</body>

render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Preact 8.xの結果
<body>
  <div>hello</div>
  <p>foo</p>
  <p>bar</p>
</body>
```

コンテナ内に存在する既存の要素を置き換えたい場合は、それを`render()`の第3引数に渡します。

```jsx
// Existing markup:
<body>
  <div>hello</div>
</body>

let element;
element = render(<p>foo</p>, document.body);
element = render(<p>bar</p>, document.body, element);

// Preact 8.xでの結果
<body>
  <div>hello</div>
  <p>bar</p>
</body>
```

Preact Xでは、`render()`は常にコンテナ内の子要素との差分を取ります。
コンテナ内にPreactでレンダリングされていないDOM要素が存在したとしても、Preactはその要素と`render()`に渡された要素の差分を取って必要に応じて更新を行います。
この新しい振舞いは他の仮想DOMライブラリの挙動により近くなっています。

```jsx
// 既存の要素
<body>
  <div>hello</div>
</body>

render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Preact Xでの結果
<body>
  <p>bar</p>
</body>
```

Reactの`render`メソッドと完全に同じ振舞いをする`render`メソッドが必要な場合は`preact/compat`がエクスポートしている`render`メソッドを使用してください。

### `props.children`が必ず`array`とは限らない

Preact Xではprops.childrenが配列とは限らなくなりました。
この変更は`Fragment`と子コンポーネントを配列で返すコンポーネントを見分けるために必要でした。
普段はそれに気づかないかもしれません。
`props.children`に配列のメソッドを適用したい場合は`toChildArray`関数でラップする必要があります。
`toChildArray`関数は常に`props.children`を配列に変換したものを返します。

```jsx
// Preact 8.x
function Foo(props) {
  // `.length`は配列のメソッドです。Preact Xで`props.children`が配列でない場合、この行は例外を投げます。
  const count = props.children.length;
  return <div>I have {count} children </div>;
}

// Preact X
import { toChildArray } from "preact";

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>I have {count} children </div>;
}
```

### `this.state`を同期的に参照してはいけない

Preact Xではコンポーネントのステート(state)が同期的に変更されなくなりました。
つまり、`setState`が実行された直後に`this.state`の値を読んでも`setState`でセットした値は反映されておらず、以前の値を返します。
前の値を使用してステートを更新するためには、代わりにコールバック関数を使用してください。

```jsx
this.state = { counter: 0 };

// Preact 8.x
this.setState({ counter: this.state.counter + 1 });

// Preact X
this.setState(prevState => {
  // ここでnullを返すとステート(state)の更新を中止します。
  return { counter: prevState.counter + 1 };
});
```

### `dangerouslySetInnerHTML`がセットされている場合は`children`の差分処理が行われなくなりました

`VNode`に`dangerouslySetInnerHTML`プロパティがセットされている場合、Preactは`VNode`の`children`の差分処理を行いません。

```jsx
<div dangerouslySetInnerHTML="{ { __html: 'foo' } }">
  <span>I will be skipped</span>
  <p>So do I</p>
</div>
```

## ライブラリ開発者向けの情報

このセクションはPreact Xに関連したライブラリの開発者向けです。
ライブラリの開発者ではないならこのセクションをスキップしても問題ありません。

### `VNode`の構造が変更されました

`VNode`のプロパティは以下のように変更されました。

- `attributes` -> `props`
- `nodeName` -> `type`
- `children` -> `props.children`

Reactとの互換性を高める努力をしてきましたが、React用に書かれたサードパーティライブラリとの連携時に常にエッジケースに遭遇してきました。
この`VNode`の変更によって、バグの特定が容易になり、また、`compat`のコードがきれいになりました。

### 隣接するテキストノードが結合されなくなりました

Preact 8.xでは隣接するテキストノードを結合して最適化していました。
Preact Xでは、直接DOMとの差分を取らなくなったため、これは不要になりました。
更にPreact Xではこれがパフォーマンスを劣化させることが判明したのでこの機能を削除しました。
以下の例を見てください。

```jsx
// Preact 8.x
console.log(<div>foo{"bar"}</div>);
// 以下のような構造を出力します
//   div
//     text

// Preact X
console.log(<div>foo{"bar"}</div>);
// 以下のような構造を出力します
//   div
//     text
//     text
```
