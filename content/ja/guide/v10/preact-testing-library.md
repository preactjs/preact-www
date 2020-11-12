---
name: Preact Testing Libraryを使ったテスト
description: 'Testing Libraryを使用してPreactアプリケーションのテストを容易にする'
---

# Preact Testing Libraryを使ったテスト

[Preact Testing Library](https://github.com/testing-library/preact-testing-library)は`preact/test-utils`の薄いラッパーです。
これは、レンダリングされたDOMにアクセスするためのクエリ関数のセットを提供します。それらは、ページ内の要素を取得するいつもの方法に似ています。
このアプローチのおかげで実装の細かい部分に振り回されないテストを書くことができます。
これによって、テスト対象のコンポーネントがリファクタリングされた場合でも、テストが壊れにくくなり、テストの維持が容易になります。

[Enzyme](/guide/v10/unit-testing-with-enzyme)とは違って、Preact Testing LibraryはDOM環境内でのみ使用することができます。

---

<div><toc></toc></div>

---

## インストール

以下のコマンドでtesting-libraryのPreact用のアダプタをインストールします。

```sh
npm install --save-dev @testing-library/preact
```

> このライブラリを使うにはDOM環境が必要です。[Jest](https://github.com/facebook/jest)を使う場合、それにはデフォルトでDOM環境があります。[Mocha](https://github.com/mochajs/mocha)や[Jasmine](https://github.com/jasmine/jasmine)のような他のテストランナを使う場合は[jsdom](https://github.com/jsdom/jsdom )をインストールして、Node.jsにDOM環境を追加する必要があります。

## 使い方

初期値を表示して、それを更新するボタンを持つ以下のような`Counter`コンポーネントがあるとします。

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount(count + 1);

  return (
    <div>
      Current value: {count}
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

ここでは、`Counter`コンポーネントが初期値を表示することとボタンをクリックすると表示された数値が増加することをテストします。
[Jest](https://github.com/facebook/jest)や[Mocha](https://github.com/mochajs/mocha)などのテストランナを使って、これら2つのシナリオのテストを記述することができます。
ここでは、[Jest](https://github.com/facebook/jest)を使って説明します。

```jsx
import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen } from '@testing-library/preact';

import Counter from '../src/Counter';

describe('Counter', () => {
  test('should display initial count', () => {
    const { container } = render(<Counter initialCount={5}/>);
    expect(container.textContent).toMatch('Current value: 5');
  });

  test('should increment after "Increment" button is clicked', async () => {
    render(<Counter initialCount={5}/>);

    fireEvent.click(screen.getByText('Increment'));
    await waitFor(() => {
      expect(screen.textContent).toMatch('Current value: 6');
    });
  });
});
```

`waitFor()`が実行されていることにお気づきかもしれません。
`waitFor()`は、PreactがDOMをレンダリングして未反映の副作用がすべて完了するまで待ちたい場合に使います。

```jsx
test('should increment counter", async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Increment'));
  // 間違い: この時点で、Preactはレンダリングを完了していないかもしれません。
  expect(screen.textContent).toMatch('Current value: 6');
});
```

`waitFor()`の内部では、コールバック関数が、エラーが`throw`されなくなるかタイムアウト(デフォルトでは1000ms)するまで繰り返し実行されます。
上記の例では、カウンターが増加し新しい値がDOMにレンダリングされているかチェックすることで、更新が完了したことを確認しています。

"getBy"の代わりに非同期処理的にクエリ関数を実行する"findBy"を使ってテストを書くこともできます。
非同期的なクエリ関数の実行は内部で`waitFor()`を使ってリトライし、Promiseを返します。そのPromiseを`await`する必要があります。

```jsx
test('should increment counter", async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Increment'));

  await findByText('Current value: 6'); // 要素が変更されるまで待つ
  
  expect(screen.textContent).toMatch('Current value: 6'); // パス
});
```

## 要素の検索

完全なDOM環境があるので、DOM Nodeを直接検証することができます。
一般的なテストでは、input valueのような属性が存在するかや要素が存在する/しないをチェックします。
これを行うには、DOM内の要素を特定する必要があります。

### テキストコンテンツを使って要素を検索する

Testing Libraryの思想は、"テストがソフトウェアの使用例に沿っているほどテストの信頼性が高まる。"です。

ページ内の要素を検索するおすすめの方法は、ユーザの視点でテキストコンテンツ(text content)を使う方法です。

使用するクエリ関数の選び方のガイドは、Testing Libraryのドキュメントの['Which query should I use'](https://testing-library.com/docs/guide-which-query)のページにあります。
最も単純なクエリ関数は`getByText`です。これは要素の`textContent`を使用して要素を検索します。
他に、ラベル、プレイスホルダ、title属性などを使用して検索する関数もあります。
`getByRole`クエリ関数は最も強力です。それはDOMを抽象化して[アクセシビリティツリー](https://developer.mozilla.org/ja/docs/Glossary/Accessibility_tree)内の要素を検索することを可能にします。アクセシビリティツリーはページがどのように[スクリーンリーダー](https://developer.mozilla.org/ja/docs/Glossary/Screen_reader)に読み込まれるかを示します。
`getByRole`クエリ関数は1つのクエリ関数で[`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)と[`accessible name`](https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_name)を組み合わせることで、多くの一般的なDOMの検索をカバーします。

```jsx
import { render, fireEvent, screen } from '@testing-library/preact';

test('should be able to sign in', async () => {
  render(<MyLoginForm />);
  
  // input要素を`role`と`accessible name`を使って特定します。
  // `accessible name`は、label要素や、aria-label、aria-labelledbyが指定されていても関係なく、安定して検索に使用できます。
  const field = await screen.findByRole('textbox', { name: 'Sign In' });
  
  // フィールドに文字列を入力する。
  fireEvent.change(field, { value: 'user123' });
})
```

もし国際化フレームワークを使用していなくても、次の例と同じ方法で、文字列を別のファイルに切り出すことができます。
テスト中に、翻訳関数を直接使用することができます。

```jsx
test('should be able to sign in', async () => {
  render(<MyLoginForm />);
  
  // 別の言語でアプリをレンダリングしたり、テキストを変更したらどうなりますか？テストが失敗します。
  const field = await screen.findByRole('textbox', { name: 'Sign In' });
  fireEvent.change(field, { value: 'user123' });
})
```

キーとそれに対応した文字列を別ファイルに定義して国際化する`translate()`があるとします。
それを使った処理は以下のようにテストすることができます。

```jsx
test('should be able to sign in', async () => {
  render(<MyLoginForm />);

  const label = translate('signinpage.label', 'en-US');
  // `label`に対するスナップショットが`toMatchInlineSnapshot()`の引数に上書きされます。
  // https://jestjs.io/docs/en/snapshot-testing#inline-snapshots
  expect(label).toMatchInlineSnapshot(`Sign In`);

  const field = await screen.findByRole('textbox', { name: label });
  fireEvent.change(field, { value: 'user123' });
})
```

### Test IDを使って要素を検索する

Test ID(`data-testid`)はDOM要素の属性です。これは、検索対象のコンテンツが曖昧な場合や予測不可能な場合、クエリをDOM構造のような実装の詳細から分離するために使用できます。
この方法は他の方法で要素を検索できない場合に使用すると良いでしょう。

```jsx
function Foo({ onClick }) {
  return (
    <button onClick={onClick} data-testid="foo">
      click here
    </button>
  );
}

// テキストが変更されない限り動作します。
fireEvent.click(screen.getByText('click here'));

// テキストが変更されても動作します。
fireEvent.click(screen.getByTestId('foo'));
```

## テストをデバッグする

現在のDOMの状態をデバッグするには`debug()`関数を使います。これはDOMを整形して出力します。

```jsx
const { debug } = render(<App />);

// DOMを整形して出力します。
debug();
```

## カスタムコンテキストプロバイダ(Custom Context Provider)の設定

コンテキスト(Context)を使ってステートを共有しているコンポーネントを使わざるを得ないことはよくあります。
ProviderはRouterやステート、たまにアプリケーション全体に影響を与えるテーマ等を扱います。
これをテストケース毎に繰り返し設定することは面倒です。だから、以下のように`@testing-library/preact`の`render`関数をラップしたカスタム`render`関数を使用することをおすすめします。

```jsx
// helpers.js
import { render as originalRender } from '@testing-library/preact';
import { createMemoryHistory } from 'history';
import { FooContext } from './foo';

const history = createMemoryHistory();

export function render(vnode) {
  return originalRender(
    <FooContext.Provider value="foo">
      <Router history={memoryHistory}>
        {vnode}
      </Router>
    </FooContext.Provider>
  );
}

// いつも通り使いましょう。見て、Providerなしです。
render(<MyComponent />)
```

## フックをテストする

Testing Libraryプロジェクトは[フック](/guide/v10/hooks)を単体でテストするためのモジュールも提供しています。
それは[@testing-library/preact-hooks](https://github.com/testing-library/preact-hooks-testing-library)です。
これを使うにはTesting Libraryとは別にインストールする必要があります。

```bash
npm install --save-dev @testing-library/preact-hooks
```

複数のコンポーネントでカウンターの機能を再利用するために、それをフックにして切り出します。
そして、それをテストするとします。

```jsx
import { useState, useCallback } from 'preact/hooks';

const useCounter = () => {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount(c => c + 1), []);
  return { count, increment };
}
```

前回と同じようにやり方は似ています。カウンターが増加するか検証します。
そこで、何とかしてフックを実行する必要があります。
これには`renderHook()`関数を使います。これは、フックを呼び出すコンポーネントを内部で自動的に生成します。
`renderHook()`関数は、フックの最新の値を、戻り値の`result.current`として返します。テストではこの値を検証します。

```jsx
import { renderHook, act } from '@testing-library/preact-hooks';
import useCounter from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());

  // カウンターの初期値が0か確認します。
  expect(result.current.count).toBe(0);

  // フックのコールバック関数を実行してカウンターを更新します。
  act(() => {
    result.current.increment();
  });

  // 新しい状態を反映したフックの戻り値を確認します。
  expect(result.current.count).toBe(1);
});
```

@testing-library/preact-hooks のより詳しい情報は https://github.com/testing-library/preact-hooks-testing-library を参照してください。
