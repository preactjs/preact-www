---
name: コンポーネント
descriptions: 'コンポーネントはPreactアプリケーションの心臓部です。コンポーネントを作成して、それらを連携してUIを構成する方法を学びましょう。'
---

# コンポーネント

コンポーネントはPreactの基本的な構成要素です。
コンポーネントは小さな構成要素から複雑なUIを作る際に中心的な役割を果たします。
コンポーネントはレンダリングされたアウトプットに対してステートを付与する役割があります。

Preactには2種類のコンポーネントがあります。このガイドではそれについて説明します。

---

<div><toc></toc></div>

---

## 関数コンポーネント

関数コンポーネントは第1引数に`props`を取る単純な関数です。
JSXで動作させるために関数名は**大文字から始める必要があります**。

```jsx
function MyComponent(props) {
  return <div>My name is {props.name}.</div>;
}

// 使い方
const App = <MyComponent name="John Doe" />;

// レンダリング結果: <div>My name is John Doe.</div>
render(App, document.body);
```

> 注意: 以前のバージョンでは「ステートレスコンポーネント」として知られていましたが、現在は[フックを使用すること](/guide/v10/hooks)でステートを持つことができます。

## クラスコンポーネント

クラスコンポーネントはステートとライフサイクルメソッドを持つことができます。
ライフサイクルメソッドは特別なメソッドです。例えば、コンポーネントがDOMにマウントされた時やDOMから削除された時に実行されます。

以下は<Clock>という現在の時刻を表示するシンプルなクラスコンポーネントです。

```jsx
class Clock extends Component {

  constructor() {
    super();
    this.state = { time: Date.now() };
  }

  // ライフサイクルメソッド: コンポーネントがDOMにマウントされた時に実行
  componentDidMount() {
    // 1秒ごとに時刻を更新
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // ライフサイクルメソッド: コンポーネントがDOMから削除される直前に実行
  componentWillUnmount() {
    // レンダリングが不可能なので停止
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}
```

### ライフサイクルメソッド

現在の時計の時刻を1秒ごとに更新するためにいつ`<Clock>`がDOMにマウントされるかを知る必要があります。
もし、HTML5 Custom Elementsを使ったことがあれば、_それはHTML5 Custom Elementsのライフサイクルメソッドである`attachedCallback`と`detachedCallback`に似ています。_
Preactはコンポーネントに以下のライフサイクルメソッドが定義されている場合、それを実行します。

| ライフサイクルメソッド            | 実行されるタイミング                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount()`        | (非推奨) コンポーネントがDOMにマウントされる前     |
| `componentDidMount()`         | コンポーネントがDOMにマウントされた後      |
| `componentWillUnmount()`      | DOMから削除される前                    |
| `componentWillReceiveProps(nextProps, nextState)` | (非推奨) 新しいpropsを受け取る前                    |
| `getDerivedStateFromProps(nextProps)` | `shouldComponentUpdate`の直前。注意して使って下さい。 |
| `shouldComponentUpdate(nextProps, nextState)`     | `render()`の前。`false`を返したらrenderをスキップする。 |
| `componentWillUpdate(nextProps, nextState)`       | (非推奨) `render()`の前。                                |
| `getSnapshotBeforeUpdate(prevProps, prevState)` | `render()`が実行される直前。戻り値は`componentDidUpdate`に渡される。 |
| `componentDidUpdate(prevProps, prevState, snapshot)`        | `render()`の後                                 |

> [この図](https://twitter.com/dan_abramov/status/981712092611989509)を見てこれらが互いにどのように関係しているのか確認しましょう。

#### componentDidCatch

注目すべきライフサイクルメソッドが1つあります。それは`componentDidCatch`です。
レンダリング中に発生したエラーを扱うことができる点が特別です。
それにはライフサイクルフック中に発生したエラーも含まれます。
しかし、例えば、`fetch()`を実行した後の非同期にスローされるようなエラーは扱うことができません。

エラーが発生した場合、このライフサイクルメソッドを使ってエラーの対応をしたりエラーメッセージを表示したり代替のコンテンツを表示することができます。

```jsx
class Catcher extends Component {
  
  constructor() {
    super();
    this.state = { errored: false };
  }

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

## Fragments

`Fragment`はrender関数と関数コンポーネントが一度に複数の要素を返すことを可能にします。
`Fragment`はコンポーネントが単一のルート要素を持たなければならないというJSXの制限を解決します。
リスト、テーブル、CSSのflexboxなど、余分な中間要素をいれてしまうと表示が崩れてしまう場合によく使われます。

```jsx
import { Fragment, render } from 'preact';

function TodoItems() {
  return (
    <Fragment>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </Fragment>
  )
}

const App = (
  <ul>
    <TodoItems />
    <li>D</li>
  </ul>
);

render(App, container);
// レンダリング結果:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```

最新のトランスパイラのほとんどは`Fragments`の短いシンタックスを使うことができ、こちらのほうが一般的です。

```jsx
const Foo = <Fragment>foo</Fragment>;
// 上記は下記と同じ
const Bar = <>foo</>;
```

render関数と関数コンポーネントは配列を返すこともできます。

```jsx
function Columns() {
  return [
    <td>Hello</td>,
    <td>World</td>
  ];
}
```

ループ中に`Fragments`を生成する場合は`key`属性を付与することを忘れないで下さい。

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
	// キーがない場合、Preactは再レンダリング時、変更された要素を特定できません。
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```
