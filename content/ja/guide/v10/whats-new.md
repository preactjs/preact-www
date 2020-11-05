---
name: Preact Xの新機能
description: 'Preact Xの新機能と変更点'
---

# Preact Xの新機能

Preact XはPreact 8.xから大きく前進しました。私達はコードの隅々まで見直し、このリリースで多数の重要な機能を追加しました。また、Reactとの互換性が向上し、より多くのサードパーティ製のライブラリをサポートできるようになりました。

端的に言えば、Preact Xは私達が常に求めていた小さくて、高速で、高機能なPreactです。
また、新機能の追加やレンダリングの改善があったにも関わらず、`8.x`と同じサイズに収まりました。

---

<div><toc></toc></div>

---

## Fragments

`Fragments`はPreact Xの新機能の1つです。この機能がひとつのきっかけとなり、Preactのアーキテクチャの見直しも行いました。
`Fragments`は、複数の子要素を、余分なDOM要素でラップすることなく、親要素内に直接レンダリングするための特別なコンポーネントです。
これを使用すると、以下のように`render`関数から並列した複数のNodeを返すことができます。

[Fragmentのドキュメント](/guide/v10/components#fragments)

```jsx
function Foo() {
  return (
    <>
      <div>A</div>
      <div>B</div>
    </>
  )
}
```

## componentDidCatch

アプリケーションでエラーが発生しないほうが望ましいですが、発生してしまうこともあります。
`componentDidCatch`を使うと、`render`のようなライフサイクルメソッド内で発生した(コンポーネントツリーの深いところで発生したものも含む)エラーを捕捉して処理することができます。
これを使うと、ユーザフレンドリなエラーメッセージを表示したり、何か問題が起こった時に外部サービスにログを送信することができます。

[componentDidCatchのドキュメント](/guide/v10/components#componentdidcatch)

```jsx
class Catcher extends Component {
  state = { errored: false }

  componentDidCatch(error) {
    this.setState({ errored: true });
  }

  render(props, state) {
    if (state.errored) {
      return <p>Something went badly wrong</p>;
    }
    return props.children;
  }
}
```

## フック(Hooks)

フックはコンポーネント間でのロジックを共有することを容易にする新しい仕組みです。
既存のクラスベースのコンポーネントの代わりに使用できます。
Preactではフックは`preact/hooks`からインポートして使用します。

[Hooksのドキュメント](/guide/v10/hooks)

```jsx
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);

  return (
    <div>
      Counter: {value}
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

## createContext

`createContext`APIは`getChildContext()`の後継です。
コンテキストの値が変更されない場合は、getChildContextでも問題ありません。
しかし、コンテキストの値が変更された時に、コンテキストの値を提供するコンポーネントと受け取るコンポーネントの間にあるコンポーネントが`shouldComponentUpdate`で`false`を返した場合、それ以上コンテキストが伝播されなくなってしまう既知の問題があります。
新しいコンテキストAPIはこの問題を解決しています。
`createContext`はツリーの奥深くまで更新を伝播する本物のPub/Subソリューションです。

[createContextのドキュメント](/guide/v10/context#createcontext)

```jsx
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => <div>Active theme: {theme}</div>}
    </Theme.Consumer>
  );
}

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </Theme.Provider>
  );
}
```

## CSS Custom Properties

些細なことが大きな違いを作り出すことがあります。
最近のCSSの進歩によって、[CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)を使用してスタイルを変更することが可能になりました。

```jsx
function Foo(props) {
  return <div style={{ '--theme-color': 'blue' }}>{props.children}</div>;
}
```

## Compatがpreactパッケージへ移動

今まで、Preact本体への新機能追加などの開発は積極的に行ってきましたが、`preact-compat`の改善はあまりできていませんでした。
Preactとその互換レイヤーである`preact-compat`が別のレポジトリにあったため、両方に影響が出るような大きな変更を進めることが困難でした。
compatをPreactと同じパッケージに移動したことで、Reactのエコシステムを利用する際に追加のパッケージをインストールする必要がなくなりました。

互換レイヤーは現在は[preact/compat](/guide/v10/differences-to-react#features-exclusive-to-preactcompat)にあります。また、`forwardRef`や`memo`等の新機能の追加や、多数の互換性の改善が行われました。

```js
// Preact 8.x
import React from "preact-compat";

// Preact X
import React from "preact/compat";
```

## Reactとの互換性が大幅に向上

ここにすべてを挙げることはできませんが、Preact XではReactのエコシステムとの互換性が飛躍的に向上しました。
人気のパッケージをテストプロセスに含めてそれらを完全にサポートできるようにしました。

Preact 8でうまく動作しないライブラリに出くわした場合は、Preact Xを試してみてください。
きっと正常に動作するでしょう。
