---
name: フック(Hooks)
description: 'フックは処理を組み合わせて処理を作ることや異なるコンポーネントでその処理を使い回すことを可能にします。'
---

# フック(Hooks)

フック(Hooks)はステートと副作用を取り扱う新しいコンセプトです。それはコンポーネント間でステートを扱う処理を使い回すことを可能にします。

Preactをそれなりに使ったことがある人なら、これらの課題を解決する"render props"や"higher order components"のようなパターンをよく知っているかもしれません。
しかし、これらの解決策は、コードをより抽象的にしてコードの可読性を下げてしまう傾向がありました。
フックAPIを使うとステートや副作用に関する処理をコンポーネントからきれいに切り出すことができます
また、その処理のみを対象とした単体テストを記述することができるので、テストコードもシンプルになります。

フックはすべてのコンポーネントで使用することができます。そして、クラスコンポーネントが依存する`this`キーワードの多くの落とし穴を回避することができます。
コンポーネントインスタンスのプロパティにアクセスする代わりに、フックはクロージャを使います。
これによってフックは値を束縛するため、非同期でのステート更新を行う際にありがちな、古いデータを読んでしまうことに起因する多くの[バグ](/guide/v10/upgrade-guide#thisstateを同期的に参照してはいけない)を回避できます。

フックを`import`する方法は2通りあります。`preact/hooks`から`import`する方法と`preact/compat`から`import`する方法です。

---

<div><toc></toc></div>

---

## イントロダクション

フックを理解する最もわかりやすい方法は同等のクラスコンポーネントと比較することです。

例として数字とその数字を増やすためのボタンを持つシンプルなカウンターコンポーネントを見ていきましょう。

```jsx
class Counter extends Component {
  state = {
    value: 0
  };

  increment = () => {
    this.setState(prev => ({ value: prev.value +1 }));
  };

  render(props, state) {
    return (
      <div>
        Counter: {state.value}
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

上記のクラスコンポーネントと同等の機能をフックを使って関数コンポーネントで実装すると以下のようになります。

```jsx
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);

  return (
    <div>
      Counter: {value}
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

この時点で両者はかなり似ているように見えます。しかし、フックの方はよりシンプルにすることができます。

カウンター処理をカスタムフックに切り出して、コンポーネント間で簡単に使い回せるようにしましょう。

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);
  return { value, increment };
}

// 1つ目のカウンター
function CounterA() {
  const { value, increment } = useCounter();
  return (
    <div>
      Counter A: {value}
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// 異なるアウトプットをレンダリングする2つ目のカウンター
function CounterB() {
  const { value, increment } = useCounter();
  return (
    <div>
      <h1>Counter B: {value}</h1>
      <p>I'm a nice counter</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

`CounterA`と`CounterB`はお互いに完全に独立していることに注目してください。
両者とも`useCounter()`カスタムフックを使っています。しかし、`useCounter()`フックが返したステートはコンポーネント間で独立しています。

> 少し違和感を感じますか。みんな最初はそうです。
>
> みんなこのやり方に慣れるのに時間がかかりました。

## 変更を検知するための引数

多くのフックは、フックの実行が必要であるかを判断するための引数を受け取ることが出来ます。
その引数の型はArrayです。
PreactはフックのそのArrayの各要素を検査し、フックが最後に実行された時のそれと同じかどうかチェックします。
変更を検知するための引数が指定されなかった場合は、常にフックが実行されます。

例として、上記の`useCounter()`では`useCallback()`に変更を検知するための引数を渡しています。

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);  // <-- 変更を検知するための引数
  return { value, increment };
}
```

この例では`value`を配列に入れて`useCallback()`に渡しています。
そして、`value`の値が変化すると`useCallback()`は新しい関数に対する参照を返します。
これは"stale closures"問題を避けるために必要です。
"stale closures"問題が起きた場合、この例では`increment`は最初にレンダリングされた時の`value`変数の値(この例では`0`)を参照し続け、
結果的に`increment`は常に`1`をステートにセットし続けます。

> `value`が変更されるたび、新しい`increment`が生成されます。
> パフォーマンス上の理由でステートの管理には`useCallback()`の第2引数の配列を使うのではなく[useState()](#usestate)が返すコールバック関数を使うべきです。

## ステートを扱うフック

ここではステートを扱う処理を関数コンポーネントに実装する方法を説明します。

フックが登場する前は、ステートが必要な場面では常にクラスコンポーネントが必要でした。

### useState

`useState`フックは引数を1つ取ります。これが最初のステートになります。
このフックが実行されると、2つの要素を持つ配列を返します。
この配列の最初の要素は現在のステートです。配列の2番目の要素はステートをセットするセッター関数です。

このセッター関数はクラスコンポーネントでステートを扱う時のセッター関数と似ています。
このセッター関数は1つの値もしくは現在のステートを引数として受け取る関数を引数とします。

セッター関数によりステートが変更された場合、`useState`を実行しているコンポーネントから再レンダリングが開始されます。

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

const Counter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  // 以下のようにセッター関数に関数を渡すことができます。
  const decrement = () => setCount((currentCount) => currentCount - 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}
```

> `useState()`も引数として関数を受け取ることができます。最初のステートの生成コストが高い場合は`useState()`に値ではなく関数を渡したほうが良いでしょう。

### useReducer

`useReducer`フックは[redux](https://redux.js.org/)とよく似ています。
次のステートが1つ前のステートに依存するような複雑なステートの処理を行う場合には、[useState](#usestate)よりも`useReducer`を使用したほうが簡単です。

```jsx
const initialState = 0;
const reducer = (state, action) => {
  switch (action) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return 0;
    default: throw new Error('Unexpected action');
  }
};

function Counter() {
  // 現在のステートとアクションをトリガするdispatch関数を返します。
  const [count, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      {count}
      <button onClick={() => dispatch('increment')}>+1</button>
      <button onClick={() => dispatch('decrement')}>-1</button>
      <button onClick={() => dispatch('reset')}>reset</button>
    </div>
  );
}
```

## メモ化

UIプログラミングではステートや計算の処理コストが高いことがよくあります。
メモ化は計算結果をキャッシュして同じ入力の場合はそれを再利用します。

### useMemo

`useMemo`フックは計算結果をメモ化します。そして、計算が依存する値が変更された場合のみ再計算されます。

```jsx
const memoized = useMemo(
  () => expensive(a, b),
  // `expensive`関数は、以下の、変更を検知するための引数の値が変わった場合のみ再実行されます。
  [a, b]
);
```

> `useMemo`内で副作用のある処理を実行しないでください。副作用のある処理は`useEffect`が担当します。

### useCallback

`useCallback`フックは変更を検知するための引数が変更されていない限り、１つ前の呼び出しで返した関数と参照的に等しい関数を返します。
これは子コンポーネントが参照的に等しいかで更新するかしないかを判断している場合(例: `shouldComponentUpdate`)、子コンポーネントの更新の最適化に役立ちます。

```jsx
const onClick = useCallback(
  () => console.log(a, b),
  [a, b]
);
```

> `useCallback(fn, deps)`は`useMemo(() => fn, deps)`と等価です。

## useRef

関数コンポーネント内でDOMへの参照を取得するには`useRef`フックを使います。
これは[createRef](/guide/v10/refs#createrefs)と似た動作をします。

```jsx
function Foo() {
  // `null`を渡すことによってuseRefを初期化します。
  const input = useRef(null);
  const onClick = () => input.current && input.current.focus();

  return (
    <>
      <input ref={input} />
      <button onClick={onClick}>Focus input</button>
    </>
  );
}
```

> `useRef`と`createRef`を混同しないように注意してください。

## useContext

関数コンポーネントで高階(Higher-Order)コンポーネントやラッパーコンポーネントを使わずにコンテキストを扱うには`useContext`を使用します。
`useContext`の第1引数は`createContext`によって生成されたコンテキストオブジェクトである必要があります。

```jsx
const Theme = createContext('light');

function DisplayTheme() {
  const theme = useContext(Theme);
  return <p>Active theme: {theme}</p>;
}

// ...
function App() {
  return (
    <Theme.Provider value="light">
      <OtherComponent>
        <DisplayTheme />
      </OtherComponent>
    </Theme.Provider>
  )
}
```

## 副作用

副作用はモダンなアプリケーションの根幹を成します。
APIからデータをフェッチしたりドキュメントに変更を加えるような副作用を伴う処理を実行したい場合には、`useEffect`を使うことが適切です。
`useEffect`の主な利点の1つはコンポーネントのライフサイクルではなく副作用の内容に意識を向けるようになることです。

### useEffect

その名の通り副作用を伴う処理にはほとんどの場合に`useEffect`を使います。
副作用を伴う処理を記述した後に、必要に応じてクリーンアップ処理を行う関数を返すこともできます。

```jsx
useEffect(() => {
  // ここに副作用を伴う処理を書く
  return () => {
    // 必要ならクリーンアップ処理を行う関数を返す。
  };
}, []);
```

ブラウザのタブに表示されるタイトルを変更する`Title`コンポーネントを作ることから初めてみましょう。

```jsx
function PageTitle(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return <h1>{props.title}</h1>;
}
```

この例では、`props.title`が変更された場合のみコールバック関数は実行されます。
`props.title`が変更されていない時にタイトルを更新しても意味がないため、[変更を検知するための引数](#the-dependency-argument)を使用して、変更がない場合は更新処理をスキップしています。

時には、もっと複雑なユースケースもあります。
マウント時にデータをサブスクラブしアンマウント時にアンサブスクライブするコンポーネントについて考えてみましょう。
これも`useEffect`でできます。
クリーンアップ処理を行うにはコールバックでクリーンアップ処理を実行する関数を返します。

```jsx
// コンポーネントは常にウィンドウの幅で表示されます。
function WindowWidth(props) {
  const [width, setWidth] = useState(0);

  function onResize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <div>Window width: {width}</div>;
}
```

> クリーンアップ関数の指定は任意です。クリーンアップ処理が必要ない場合、`useEffect`に渡したコールバックは何も返す必要はありません。

### useLayoutEffect

使い方は[useEffect](#useeffect)と同じですが、コンポーネントの差分が計算され、ブラウザが描画する機会があれば、すぐにコールバック関数が実行されます。

### useErrorBoundary

`useErrorBoundary`フックを使うと子コンポーネントで発生したエラーを捕獲して、カスタムのエラーを表示することができます。

```jsx
// `error`はエラーが発生した場合は捕獲したエラーになります。エラーが発生しなかった場合は`undefined`になります。
// `resetError`を実行するとエラーは解決したことになります。
// エラーの意味を判断して、エラーから回復するかを決めるのは、あなたのアプリケーション次第です。
const [error, resetError] = useErrorBoundary();
```

エラーが起きた場合に、サーバにエラーを通知することはモニタリングにとても役立ちます。
そのために`useErrorBoundary`の第1引数にコールバック関数を渡すことができます。

```jsx
const [error] = useErrorBoundary(error => callMyApi(error.message));
```

完全な使用例は以下です。

```jsx
const App = props => {
  const [error, resetError] = useErrorBoundary(
    error => callMyApi(error.message)
  );
  
  // エラーメッセージを表示します。
  if (error) {
    return (
      <div>
        <p>{error.message}</p>
        <button onClick={resetError}>Try again</button>
      </div>
    );
  } else {
    return <div>{props.children}</div>
  }
};
```

> クラスコンポーネントでは[componentDidCatch](https://preactjs.com/guide/v10/whats-new/#componentdidcatch)がこのフックに該当します。
> このフックはPreact 10.2.0で導入されました。
