---
name: Preactアプリケーションのデバッグ
description: '問題が起きたときにPreactアプリケーションをデバッグする方法'
---

# Preactアプリケーションのデバッグ

Preactにはデバックを容易にするツールが付属しています。それらは`preact/debug`にパッケージングされています。そして、`preact/debug`を`import`することで使うことができます。

それらにはChromeやFirefoxやEdgeのブラウザ拡張である[Preact Devtools]との連携機能が含まれます。

`<table>`要素のネストが間違っている等の間違いを見つけると警告やエラーを出力します。

---

<div><toc></toc></div>

---

## インストール

[Preact Devtools]はブラウザのウェブストアでインストールすることができます。

- [For Chrome](https://chrome.google.com/webstore/detail/preact-developer-tools/ilcajpmogmhpliinlbcdebhbcanbghmd)
- [For Firefox](https://addons.mozilla.org/en-US/firefox/addon/preact-devtools/)
- [For Edge](https://microsoftedge.microsoft.com/addons/detail/hdkhobcafnfejjieimdkmjaiihkjpmhk)

インストールした後、`preact/debug`を`import`して拡張との接続を初期化する必要があります。
この`import`はアプリケーション全体で**一番最初に**行われる必要があります。

> `preact-cli`は`preact/debug`を自動的に導入します。`preact-cli`を使っている場合、次のステップをスキップして大丈夫です。

アプリケーションのメインエントリーファイルに以下のように`preact/debug`を`import`します。

```jsx
// 最初に`import`する必要があります。
import "preact/debug";
import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

### Productionビルドからdevtoolsを削除する

ほとんどのバンドラでは必ず使われない`if`文を見つけた場合、その分岐を削除します。
これを利用してdevelopmentビルド時のみ`preact/debug`を含めることができます。そして、Productionビルド時には貴重なバイト数を節約することができます。

```jsx
// 最初に`import`する必要があります。
if (process.env.NODE_ENV==='development') {
  // `import`はトップレベルにのみ記述することができるため、ここではrequireを使います。
  require("preact/debug");
}

import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

ビルドツールで`NODE_ENV`変数が正しくセットされているか確認してください。

## デバッグ時の警告とエラー

Preactが無効なコードを発見すると警告やエラーを表示することがあります。
それらを修正してアプリケーションを完璧にしましょう。

### `undefined` parent passed to `render()`(`render()`に渡された親要素が`undefined`)

これはコードがアプリケーションをDOMノードではなく何も存在しないところにレンダリングしようとしていることを意味します。
両者の比較です。

```jsx
// Preactが受け取った物
render(<App />, undefined);

// 期待しているもの
render(<App />, actualDomNode);
```

このエラーが発生する主な理由は`render()`関数が実行される際にDOMが存在していないからです。
存在することを確認して下さい。

### `undefined` component passed to `createElement()`(`createElement()`に`undefined`がコンポーネントとして渡された)

Preactはコンポーネントの代わりに`undefined`を渡すとエラーをスローします。
このエラーのよくある原因は`default export`と`named export`を取り違えていることです。

```jsx
// app.js
export default function App() {
  return <div>Hello World</div>;
}

// index.js: because `app.js`は`named export`を行っていないので動作しません。
import { App } from './app';
render(<App />, dom);
```

逆の場合も同じエラーがスローされます。
それは`named export`と宣言して`default export`を使おうとする場合です。
これを手早く確かめる方法は(エディタがまだそれを実行していない場合)`import`したものを単にログに出力することです。

```jsx
// app.js
export function App() {
  return <div>Hello World</div>;
}

// index.js
import App from './app';

console.log(App);
// ログ: コンポーネントではなく { default: [Function] } が出力される
```

### Passed a JSX literal as JSX twice(渡されたJSXリテラルがJSXとして2度評価された)

JSXリテラルもしくはコンポーネントをJSXに再度渡すことは無効です。それはエラーを引き起こします。

```jsx
const Foo = <div>foo</div>;
// 無効: Fooは既にJSX要素です。
render(<Foo />, dom);
```

単に変数を直接渡すだけで修正することができます。

```jsx
const Foo = <div>foo</div>;
render(Foo, dom);
```

### Improper nesting of table detected(テーブルの不適切なネストが見つかりました)

HTMLにはテーブルの構造に対して非常に明確な決まりがあります。
それから外れるとデバッグすることが非常に難しいレンダリングエラーが発生します。
Preactはこれを見つけてエラーを出力します。
テーブルの構造について詳しく知りたい場合は[MDNのドキュメント](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics)を読んでください。

### Invalid `ref`-property(無効な`ref`プロパティ)

`ref`プロパティに不適切な値が含まれている場合、このエラーがスローされます。
これには少し前に非推奨になった文字列ベースの`ref`プロパティも含まれます。

```jsx
// 有効
<div ref={e => {/* ... */)}} />

// 有効
const ref = createRef();
<div ref={ref} />

// 無効
<div ref="ref" />
```

### Invalid event handler(無効なイベントハンドラ)

うっかり間違った値をイベントハンドラに渡すことがあるかもしれません。
イベントハンドラに渡す値は常に`function`もしくは`null`(削除したい場合)でなければなりません。
それ以外は無効です。

```jsx
// 有効
<div onClick={() => console.log("click")} />

// 無効
<div onClick={console.log("click")} />
```

### Hook can only be invoked from render methods(フックはrender()メソッドのみで実行することができる)

このエラーはコンポーネントの外でフックを使用したときに発生します。
フックは関数コンポーネントの内側でのみサポートされています。

```jsx
// 無効: コンポーネント内で使う必要があります。
const [value, setValue] = useState(0);

// 有効
function Foo() {
  const [value, setValue] = useState(0);
  return <button onClick={() => setValue(value + 1)}>{value}</button>;
}
```

### Getting `vnode.[property]` is deprecated(`vnode.[property]`へのアクセスは非推奨です)

Preact Xは内部の`vnode`のプロパティ名に互換性を破壊する変更を加えました。

| Preact 8.x         | Preact 10.x            |
| ------------------ | ---------------------- |
| `vnode.nodeName`   | `vnode.type`           |
| `vnode.attributes` | `vnode.props`          |
| `vnode.children`   | `vnode.props.children` |

### Found children with the same key(子要素のkey属性が重複している)

仮想DOMベースのライブラリは、子要素の移動を検知する必要があります。
そのために、どの子要素がどれであるかを知るための情報が必要です。
_これは動的に子要素を生成する場合にのみ必要です。_

```jsx
// 両方の子要素が同じ"A"keyを持っています。
<div>
  {['A', 'A'].map(char => <p key={char}>{char}</p>)}
</div>
```

それを行う正しい方法はユニークなキーを付与することです。
ほとんどの場合、反復処理の対象になるデータは何らかの形で`id`を持っているはずです。

```jsx
const persons = [
  { name: 'John', age: 22 },
  { name: 'Sarah', age: 24 }
];

// コンポーネントのrender部分
<div>
  {persons.map(({ name, age }) => {
    return <p key={name}>{name}, Age: {age}</p>;
  })}
</div>
```

[Preact Devtools]: https://preactjs.github.io/preact-devtools/
