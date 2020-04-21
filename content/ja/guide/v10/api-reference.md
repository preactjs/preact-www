---
name: APIリファレンス
description: 'Preactモジュールでエクスポートされているすべての関数について詳しく学びましょう。'
---

# APIリファレンス

このページはPreactで提供されているすべての関数の概要を記載します。

---

<div><toc></toc></div>

---

## Component

`Component`はステートフルなPreactコンポーネントを作成するために拡張して使用するベースクラスです。
コンポーネントは直接インスタンス化するのではなく、レンダラーによって管理され必要に応じて生成されます。

```js
import { Component } from 'preact';

class MyComponent extends Component {
  // (see below)
}
```

### Component.render(props, state)

すべてのコンポーネントは`render()`関数を持つ必要があります。`render()`はコンポーネントの現在の`porps`と`state`が渡されます。そして、仮想DOM要素、配列、`null`を返す必要があります。

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// propsはthis.propsと同じ
		// stateはthis.stateと同じ

		return <h1>Hello, {props.name}!</h1>;
	}
}
```

コンポーネントとその使い方を詳しく知りたい場合は[コンポーネントのドキュメント](/guide/v10/components)をチェックしてください。

## render()

`render(virtualDom, containerNode, [replaceNode])`

仮想DOM要素を親DOM要素である`containerNode`内にレンダリングします。戻り値はありません。

```jsx
// DOMツリーがレンダリングされる前
// <div id="container"></div>

import { render } from 'preact';

const Foo = () => <div>foo</div>;

render(<Foo />, document.getElementById('container'));

// レンダリングされた後
// <div id="container">
//  <div>foo</div>
// </div>
```

オプションの`replaceNode`パラメータ指定する場合は、`containerNode`の子要素でなければなりません。
レンダリングの開始地点を推測する代わりに、Preactは差分アルゴリズムを使用して渡された要素(`replaceNode`)を更新または置換します。
詳しくは[render()は常にコンテナ内にレンダリングした要素を上書きする](/guide/v10/upgrade-guide)を確認してください。

```jsx
// DOMツリーがレンダリングされる前
// <div id="container">
//   <div>bar</div>
//   <div id="target">foo</div>
// </div>

import { render } from 'preact';

const Foo = () => <div id="target">BAR</div>;

render(
  <Foo />,
  document.getElementById('container'),
  document.getElementById('target')
);

// レンダリングされた後
// <div id="container">
//   <div>bar</div>
//   <div id="target">BAR</div>
// </div>
```

第1引数は仮想DOMでなければなりません。その仮想DOMはコンポーネントもしくはHTML要素を表す必要があります。
コンポーネントを渡す際は以下のように直接インスタンス化するのではなく必ずPreactにインスタンス化を任せてください。直接インスタンス化すると予期しない方法で止まります。

```jsx
const App = () => <div>foo</div>;

// コンポーネントを直接指定することはフックと更新順序を破壊するのでしないでください。
render(App(), rootElement); // エラー
render(App, rootElement); // エラー

// コンポーネントをh()もしくはJSXで渡すと正常に動作します。
render(h(App), rootElement); // 成功
render(<App />, rootElement); // 成功
```

## hydrate()

プリレンダリングもしくはサーバサイドレンダリングによって既にアプリケーションをHTMLに出力している場合、ブラウザでのロード時にほとんどのレンダリング処理をバイパスします。
これは`render()`を`hydrate()`に置き換えることで有効になります。これは大半の差分処理を省略しつつ、イベントリスナをセットしコンポーネントツリーを構築します。
これは[プリレンダリング](/cli/pre-rendering)もしくは[サーバサイドレンダリング](/guide/v10/server-side-rendering)と連携した場合のみ動作します。


```jsx
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

## h() / createElement()

`h(type, props, ...children)`

与えられた`props`を持つ仮想DOM要素を返します。
仮想DOM要素はアプリケーションのUIの階層構造に所属するノードを表す軽量なデータです。
仮想DOM要素の実態は基本的には`{ type, props }`という形式のオブジェクトです。

`type`と`props`を除く残りのパラメーターは配列である`children`に格納されます。
`type`と`props`を除く残りの引数は、仮想DOM要素の`children`プロパティに格納されます。
`children`は次のどれかです。

- スカラー値 (`string`、`number`、`boolean`、`null`、`undefined`等)
- ネストされた仮想DOM要素
- 上記の要素を持つ配列

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Hello!');
// <div id="foo">Hello!</div>

h('div', { id: 'foo' }, 'Hello', null, ['Preact!']);
// <div id="foo">Hello Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Hello!')
);
// <div id="foo"><span>Hello!</span></div>
```

## toChildArray

このヘルパー関数は`props.children`の値の構造やネストに関係なくそれをフラット化します。
`props.children`が既に配列の場合、コピーを返します。
この関数は`props.children`が必ず配列とは限らない場合に役に立ちます。それはJSXの静的な処理と動的な処理の組み合わせで発生することがあります。

仮想DOM要素が子要素を1つ持つ場合、`props.children`は直接子要素を参照します。
複数の子要素を持つ場合、`props.children`は常に配列になります。
`toChildArray`を使用するとすべてのケースを一貫して処理することができます。

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>I have {count} children</div>;
}

// props.childrenは"bar"
render(
  <Foo>bar</Foo>,
  container
);

// props.childrenは[<p>A</p>, <p>B</p>]
render(
  <Foo>
    <p>A</p>
    <p>B</p>
  </Foo>,
  container
);
```

## cloneElement

`cloneElement(virtualElement, props, ...children)`

この関数は仮想DOM要素の浅い(shallow)コピーを作成します。
要素の`props`を追加する際や上書きする際によく使用します。

```jsx
function Linkout(props) {
  // target="_blank"をリンクに追加
  return cloneElement(props.children, { target: '_blank' });
}
render(<Linkout><a href="/">home</a></Linkout>);
// <a href="/" target="_blank">home</a>
```

## createContext

[Context documentation](/guide/v10/context#createcontext)のcreateContextの項目を見てください。

## createRef

レンダリングで生成されたコンポーネントや要素の参照を取得する際に使用します。

詳細は[リファレンスのドキュメント](/guide/v10/refs#createref)を見てください。

## Fragment

子要素を持つことができるが、DOM要素としてレンダリングされない特殊なコンポーネントです。
`Fragment`はDOMコンテナーのラップなしで兄弟関係にある複数の子要素を返すことを可能にします。

```jsx
import { Fragment, render } from 'preact';

render(
  <Fragment>
    <div>A</div>
    <div>B</div>
    <div>C</div>
  </Fragment>,
  document.getElementById('container')
);
// レンダリングした結果
// <div id="container>
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```
