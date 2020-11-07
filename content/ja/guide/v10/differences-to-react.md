---
name: Reactとの違い
permalink: '/guide/differences-to-react'
description: 'ReactとPreactの違いは何でしょう。このドキュメントはそれらを詳細に解説します。'
---

# Reactとの違い

PreactはReactの再実装ではありません。両者には違いがあります。ほとんどの違いは些細な物か、[preact/compat]によって吸収されます。[preact/compat]はReactとの100%の互換性を目指している薄いレイヤーです。

PreactがReactの機能をすべて含まない理由は**小さい**、**集中した**状態を保ちたいからです。そうでないなら、単にReactプロジェクトを最適化する方が合理的です。Reactは既にとても複雑で素晴らしいアーキテクチャのコードベースで構成されています。

---

<div><toc></toc></div>

---

## 主な違い

PreactとReactの主な違いはPreactには合成イベント(Synthetic Event)がないことです。
Preactはイベント処理に内部でブラウザネイティブの`addEventListener`を使用しています。
DOMイベントハンドラの完全なリストは[GlobalEventHandlers]を見てください。

ブラウザのイベントシステムは必要なすべての機能を満たしているので、Preactにとって合成イベントは意味がありません。
合成イベントのようなカスタムイベントを完全に実装するとメンテナンスのオーバーヘッドが増加しAPIが複雑になってしまいます。

Reactの合成イベントとブラウザのネイティブイベントには以下のような違いがあります。

- ブラウザイベントは`<Portal>`コンポーネントをイベントバブリングで通過しません。
- IE11で`<input type="search">`要素の"x"クリアボタンは`input`イベントを発火しません。代わりに`onSearch`を使います。
- (**`preact/compat`を使用していない場合は、**)`<input>`要素では`onChange`の代わりに`onInput`を使用してください。 

その他の主な違いはDOMの仕様にもう少しだけ似せていることです。
それの1つの例は`className`の代わりに`class`を使うことができることです。

## バージョンの互換性

preactと[preact/compat]の両方で、バーションの互換性はReactの現在と1つ前のメジャーリリースを比較します。
新機能がReactチームによって発表された場合、[Projectの目的]にとって意味がある場合はPreactコアへの追加が検討されます。
これはとても民主的なプロセスです。IssueやPull Requestでのオープンな議論や意思決定を通じて、Preactは継続的に進化しています。

> 従って、このウェブサイトとドキュメントのPreactとReactの互換性や比較はReact`16.x`と`15.x`を対象にしています。

## デバッグメッセージとエラー

Preactのアーキテクチャは柔軟性が高いので、アドオンを使用して自由自在にPreactの開発体験を向上させることができます。
`preact/debug`というアドオンを追加すると、[有益な警告とエラー](https://preactjs.com/guide/v10/debugging)が表示されるようになり、
また、[Preact Devtools](https://preactjs.github.io/preact-devtools/) がインストールされていれば、連携が有効化されます。
これらはPreactアプリケーションを開発する際のガイドになります。そして、何が起きているか調査することをとても簡単にします。
`preact/debug`アドオンは、次の`import`文により追加できます。

```js
import "preact/debug"; // <-- メインエントリーファイルの先頭にこの行を追加します。
```

Reactと異なるのは、(訳注：Preactではアドオンを使用してデバッグメッセージを追加するのに対して、)Reactでは、(訳注：最初からデバッグメッセージが含まれているので、プロダクション環境では、)NODE_ENV をチェックしてデバッグメッセージを削除するためにバンドラが必要、という点です。

## Preact固有の機能

Preactは(P)Reactコミュニティの活動から生まれたアイディアをベースに便利な機能を追加しています。

### ES Modulesをネイティブサポート

Preactは、当初からES Modulesを考慮して開発されており、ES Modulesをサポートする最初のフレームワークの1つになりました。
前もってバンドラに通すことなしに、ブラウザで`import`キーワードを使ってPreactを直接ロードすることができます。

### `Component.render()`の引数

Preactでは、利便性のために、クラスコンポーネントの`this.props`と`this.state`を`render()`に引数として渡します。
1つの`props`と1つの`state`を使用する以下のコンポーネントを見てください。

```jsx
// PreactとReactの両方で動作します。
class Foo extends Component {
  state = { age: 1 };

  render() {
    return <div>Name: {this.props.name}, Age: {this.state.age}</div>;
  }
}
```

Preactではこれを以下のように書くことができます。

```jsx
// Preactのみ動作します。
class Foo extends Component {
  state = { age: 1 };

  render({ name }, { age }) {
    return <div>Name: {name}, Age: {age}</div>;
  }
}
```

両方とも全く同じ物をレンダリングします。どちらのスタイルを選ぶかは単なる好みの問題です。

### そのままのHTML属性/プロパティ名

Preactは、すべての主要なブラウザでサポートされているDOMの仕様にReactより忠実です。
Reactとの主な違いの1つは`className`属性の代わりに標準の`class`属性を使うことができることです。

```jsx
<div class="foo" />

// 上記は下記と同じ
<div className="foo" />
```

両方ともサポートされていますが、ほとんどのPreact開発者は短く書くことができるので`class`を使うことを好みます。

### `onChange`の代わりに`onInput`を使う

主に歴史的な事情によって、Reactの`onChange`イベントは、ブラウザによって提供されている`onInput`イベント（これは全てのブラウザで動作します）と同じ動作をします。
一方で、Preactでは、`onChange`はユーザによって要素の値の変更が確定されたときに発生する[標準のDOMイベント](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)です。
フォームコントロールが変更された時に何かを行いたい場合、`onInput`イベントが適していることが多いです。

```jsx
// React
<input onChange={e => console.log(e.target.value)} />

// Preact
<input onInput={e => console.log(e.target.value)} />
```

[preact/compat]では、Reactの挙動を再現するために、`onChange`が`onInput`と同じ動作になるよう内部で変換されます。
これにより、Reactエコシステムとの最大限の互換性を確保しています。

### JSXコンストラクタ

このアイディアは元は[hyperscript]と呼ばれていました。これはReactのエコシステムに限らず価値があります。
だから、Preactは元のやり方を推奨しています。([詳しくは: why `h()`?](http://jasonformat.com/wtf-is-jsx))
`h()`はトランスパイルされたコードを見ると`React.createElement`より少し読みやすいです。

```js
h(
  'a',
  { href:'/' },
  h('span', null, 'Home')
);

// vs
React.createElement(
  'a',
  { href:'/' },
  React.createElement('span', null, 'Home')
);
```

ほとんどのPreactアプリケーションでは`h()`が使用されています。
しかし、コアでは`h()`と`createElement()`の両方がサポートされています。
どちらを使うかは重要ではありません。

### contextTypesは必要ありません

Reactの古いコンテキストAPIではコンポーネントに`contextTypes`もしくは`childContextTypes`を実装する必要があります。
Preactではこの制限はありません。すべてのコンポーネントは`getChildContext()`から生成されたすべての`context`の値を受け取ります。

## `preact`には無くて`preact/compat`にある機能

`preact/compat`はReactのコードをPreactに移行するための**互換**レイヤーです。
既存のReactユーザはコードはそのままでバンドラの設定にいくつかのエイリアスをセットするだけで、とても手軽にPreactを試すことができます。

### Children API

Reactの`Children`APIはコンポーネントの`children`を反復処理するためのAPIです。
PreactではこのAPIは必要ありません。代わりにネイティブの配列のメソッドを使うことを推奨します。

```jsx
// React
function App(props) {
  return <div>{Children.count(props.children)}</div>
}

// Preact: 子コンポーネントを配列に変換します。配列の標準のプロパティを使います。
function App(props) {
  return <div>{toChildArray(props.children).length}</div>
}
```

### 固有のコンポーネントと関数

[preact/compat]は以下のような特殊な用途で使用することを目的としたコンポーネントや関数を提供しています。

- [PureComponent](/guide/v10/switching-to-preact#purecomponent): `props`もしくは`state`が変化した場合のみ更新されます。
- [memo](/guide/v10/switching-to-preact#memo): `PureComponent`と用途が似ていますがこちらは比較のための関数を指定することができます。
- [forwardRef](/guide/v10/switching-to-preact#forwardRef): 指定した子コンポーネントに`ref`をセットします。
- [Portals](/guide/v10/switching-to-preact#portals): 指定した仮想DOMツリーを別のDOMコンテナにレンダリングします。
- [Suspense](/guide/v10/switching-to-preact#suspense): **実験的機能** 仮想DOMツリーの準備ができていない間は代替の仮想DOMツリーのレンダリングすることを可能にします。
- [lazy](/guide/v10/switching-to-preact#suspense): **実験的機能** 非同期のコードを遅延ロードします。そして、ロード完了を通知します。

[Projectの目的]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[preact/compat]: /guide/v10/switching-to-preact
[GlobalEventHandlers]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
