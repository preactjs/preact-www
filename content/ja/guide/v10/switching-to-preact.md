---
name: ReactからPreactへの移行
permalink: '/guide/switching-to-preact'
description: 'ReactからPreactへの移行するために必要なことをすべて説明します。'
---

# (Reactから)Preactへの移行

`preact/compat`はReactのエコシステムに存在する多くのライブラリをPreactで使用することができるようにする互換レイヤです。既存のReactアプリケーションをPreactに移行する場合はこれを使うことをお勧めします。

`preact/compat`を使うことによってワークフローやコードベースを変更することなく既存のReact/ReactDOMで作られたコードで開発し続けることができます。
`preact/compat`はバンドルサイズを2kB増加させますが、npmにあるほとんどのReact用のモジュールを利用できるようになるという利点があります。
`preact/compat`パッケージは、`react`と`react-dom`と同じような動作するようにPreactコアに調整を加えたものです。

---

<div><toc></toc></div>

---

## compatの設定

`preact/compat`を設定するには`react`と`react-dom`を`preact/compat`にエイリアスする必要があります。
バンドラでエイリアスする方法を詳しく知りたい場合は[はじめに](/guide/v10/getting-started#aliasing-react-to-preact)を読んでください。

## PureComponent

`PureComponent`クラスは`Component`クラスと似た動作をします。
違いは新しい`props`が古い`props`と等しい場合、`PureComponent`はレンダリングをスキップする点です。
この判断は、古い`props`と新しい`props`のそれぞれのプロパティが参照的に等しいかどうか浅い(shallow)比較をすることにより行います。
これによって不要な再レンダリングを避けることができ、アプリケーションは大幅にスピードアップします。
`PureComponent`は`shouldComponentUpdate`のデフォルト実装を提供することにより、これを実現しています。

```jsx
import { render } from 'preact';
import { PureComponent } from 'preact/compat';

class Foo extends PureComponent {
  render(props) {
    console.log("render")
    return <div />
  }
}

const dom = document.getElementById('root');
render(<Foo value="3" />, dom);
// Logs: "render"

// 2回目のレンダリングではログを出力しません。
render(<Foo value="3" />, dom);
```

> `PureComponent`はレンダリングコストが高い場合のみ有効です。シンプルなDOMツリーの場合、`props`を比較するより普通にレンダリングを実行するほうが速い場合もあります。

## memo

`memo`は関数コンポーネント版の`PureComponent`に相当します。
デフォルトでは`PureComponent`と同じ比較を行いますが、個別に比較を行う関数を設定することもできます。

```jsx
import { memo } from 'preact/compat';

function MyComponent(props) {
  return <div>Hello {props.name}</div>
}

// デフォルトの比較を使用します。
const Memoed = memo(MyComponent);

// 比較を行う関数を使用します。
const Memoed2 = memo(MyComponent, (prevProps, nextProps) => {
  // `name`が変わった場合のみ再レンダリングします。
  return prevProps.name === nextProps.name;
})
```

> `memo`に渡す比較関数は再レンダリングをスキップしたい場合は`true`を返します。`shouldComponentUpdate`は再レンダリングをスキップしたい場合は`false`を返します。両者の戻り値が逆なことに注意してください。

## forwardRef

`forwardRef`を使うとコンポーネントの外部からコンポーネント内部の要素を参照することができます。

```jsx
import { createRef, render } from 'preact';
import { forwardRef } from 'preact/compat';

const MyComponent = forwardRef((props, ref) => {
  return <div ref={ref}>Hello world</div>;
})

// refはMyComponentではなくMyComponent内部の`div`への参照を持ちます。
const ref = createRef();
render(<MyComponent ref={ref} />, dom)
```

これはライブラリの開発にとても役立ちます。

## Portals

`createPortal()`を使うとレンダリング時にコンポーネントの外にあるDOM Nodeにレンダリング結果を加えることができます。
加える対象となるDOM Nodeはレンダリング時よりも前に**存在している必要があります**。

```html
<html>
  <body>
    <!-- Appはここにレンダリングされる -->
    <div id="app"></div>
    <!-- Modalsをここにレンダリングする必要がある -->
    <div id="modals"></div>
  </body>
</html>
```

```jsx
import { createPortal } from 'preact/compat';
import MyModal from './MyModal';

function App() {
  const container = document.getElementById('modals');
  return (
    <div>
      I'm app
      {createPortal(<MyModal />, container)}
    </div>
  )
}
```

> Preactはブラウザのイベントシステムを使用しているのでイベントがPortalコンテナを通じて他のツリーにバブルアップしないことを忘れないでください。

## Suspense (実験的な機能)

`Suspense`を使うとSuspenseの下に存在する子コンポーネントがロード中の場合はプレースホルダを表示することができます。
一般的なユースケースとして、レンダリングする前にネットワークからコンポーネントをロードする必要があるcode-splittingを行う場合が挙げられます。

```jsx
import { Suspense, lazy } from `preact/compat`;

const SomeComponent = lazy(() => import('./SomeComponent'));

// 使い方
<Suspense fallback={<div>loading...</div>}>
  <Foo>
    <SomeComponent />
  </Foo>
</Suspense>
```

この例では、`SomeComponent`コンポーネントがロードされてPromiseがresolveするまで、UIに`loading...`というテキストを表示します。

> この機能は実験的な機能でバグがあるかもしれません。テストで試せるようにプレビュー版に含めました。製品版では使用しないことをお勧めします。
