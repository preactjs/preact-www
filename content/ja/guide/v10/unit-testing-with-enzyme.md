---
name: Enzymeを使った単体テスト
permalink: '/guide/unit-testing-with-enzyme'
description: 'Enzymeを使ってPreactアプリケーションの単体テストを行う。'
---

# Enzymeを使った単体テスト

Airbnbの[Enzyme](https://airbnb.io/enzyme/)はReactのコンポーネントをテストするためのライブラリです。
Enzymeはアダプタを使用することで異なるバージョンのReactとそれに類するライブラリをサポートします。
PreactチームがメンテナンスしているPreact用のアダプタがあるので、Enzymeを使ってPreactのコンポーネントのテストを行うことができます。

Enzymeは[Karma](http://karma-runner.github.io/latest/index.html)を使った通常のブラウザやヘッドレスブラウザでのテスト、
NodeJSでの仮想的なブラウザAPIの実装である[jsdom](https://github.com/jsdom/jsdom)を使ったテストをサポートします。

Enzymeの詳しい使い方とAPIリファレンスは[Enzymeのドキュメント](https://airbnb.io/enzyme/)を見てください。
このガイドの残りの部分はPreact用のEnzymeの設定方法とEnzymeをPreactに対して使う場合とReactに対して使う場合の違いについて説明します。

---

<div><toc></toc></div>

---

## インストール

以下のようにEnzymeとPreactアダプタをインストールします。

```sh
npm install --save-dev enzyme enzyme-adapter-preact-pure
```

## 設定

Preactのアダプタを使うためには、テストのセットアップコードでEnzymeの設定を行う必要があります。

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

configure({ adapter: new Adapter() });
```

各テストランナーでEnzymeを使う方法について知りたい場合は、Enzymeのドキュメントの[Guides](https://airbnb.io/enzyme/docs/guides.html)セクションを見てください。

## 例

以下のように、初期値を表示しそれを更新するボタンがあるシンプルな`Counter`コンポーネントがあるとします。

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function Counter({ initialCount }) {
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

以下のようにMochaやJest等のテストランナーを使って、期待通りに動作するかチェックするテストを書くことができます。

```jsx
import { expect } from 'chai';
import { h } from 'preact';
import { mount } from 'enzyme';

import Counter from '../src/Counter';

describe('Counter', () => {
  it('should display initial count', () => {
    const wrapper = mount(<Counter initialCount={5}/>);
    expect(wrapper.text()).to.include('Current value: 5');
  });

  it('should increment after "Increment" button is clicked', () => {
    const wrapper = mount(<Counter initialCount={5}/>);

    wrapper.find('button').simulate('click');

    expect(wrapper.text()).to.include('Current value: 6');
  });
});
```

サポートしているバージョンや他の例はPreact用アダプタのレポジトリの[examples/](https://github.com/preactjs/enzyme-adapter-preact-pure/blob/master/README.md#example-projects)ディレクトリを見てください。

## Enzymeの仕組み

Enzymeはコンポーネントとその子コンポーネントをレンダリングするために設定されたアダプタライブラリを使います。
アダプタはレンダリング結果を標準化された内部表現("React Standard Tree")に変換します。
それから、Enzymeはアウトプットを検索し更新をトリガするメソッドを持つオブジェクトをラップします。
Enzymeはその内部表現をラップして、状態を取得・更新するためのAPIを使えるようにします。
ラッパオブジェクトのAPIではCSSに似た[selectors](https://airbnb.io/enzyme/docs/api/selector.html)を使用できます。

## フルレンダリング、浅い(shallow)レンダリング、文字列レンダリング

Enzymeは3つのレンダリングモードがあります。

```jsx
import { mount, shallow, render } from 'enzyme';

// コンポーネントツリー全体をレンダリングします。
const wrapper = mount(<MyComponent prop="value"/>);

// MyComponentのDOMノードのみレンダリングします。(子コンポーネントはモックされてプレースホルダでレンダリングします。)
const wrapper = shallow(<MyComponent prop="value"/>);

// コンポーネントツリーをHTMLでレンダリングしてパースしたものを返します。
const wrapper = render(<MyComponent prop="value"/>);
```

 - `mount`関数はブラウザでレンダリングするのと同じ方法でコンポーネント全体をレンダリングします。

 - `shallow`関数はコンポーネントが直接出力するDOM Nodeのみレンダリングします。
   子コンポーネントはそれを表すプレースホルダに置き換えられます。

   このモードの利点は、子コンポーネントの詳細に依存したり、子コンポーネントが依存するものを解決せずに、コンポーネントのテストを書けることです。

   浅い(shallow)レンダリングモードは内部の動作がPreact用のアダプタとReact用のアダプタでは異なります。詳しくは以下の「Reactとの違い」のセクションを見てください。

 - `render`関数(Preactの`render`関数と混同しないでください)はコンポーネントをHTML文字列にレンダリングします。
   これはサーバ上での出力をテストすることや副作用をトリガせずにコンポーネントをレンダリングすることに役立ちます。

## `act`でステートの更新とその副作用をトリガする

前の例では、`.simulate('click')`を使ってボタンをクリックしました。

Enzymeは`simulate`によってステート(state)が更新され、それの副作用がトリガされることを知っています。だから、Enzymeは`simulate`関数が終了する直前でステートを更新して副作用をトリガします。
Enzymeは最初に`mount`や`shallow`を使ってレンダリングする時や`setProps`を使ってコンポーネントを更新する時も同じ処理を行います。

しかし、Enzymeのメソッド以外でイベントが発生した場合、例えばイベントハンドラ(例 ボタンの`onClick` prop)を直接実行した場合、Enzymeは変化に気づきません。
この場合、テストはステートの更新とその副作用のトリガを実行する必要があります。そして、Enzymeにアウトプットであるビューを再生成させる必要があります。

- ステートの更新とその副作用を同期的に実行するために、`preact/test-utils`の`act`関数で更新をトリガするコードをラップして使います。
- `update`メソッドでレンダリングされたアウトプットのEnzymeのビューを更新します。

例えば、以下にカウンターを加算するテストの別バージョンを示します。
`simulate`メソッドを経由する代わりにボタンのonClick propを実行するように変更しました。

```js
import { act } from 'preact/test-utils';
```

```jsx
it('should increment after "Increment" button is clicked', () => {
    const wrapper = mount(<Counter initialCount={5}/>);
    const onClick = wrapper.find('button').props().onClick;

    act(() => {
      // ボタンのクリックハンドラを実行しますが、今回はEnzyme APIを経由する代わりに直接実行します。
      onClick();
    });
    // Enzymeのアウトプットのビューを再生成します。
    wrapper.update();

    expect(wrapper.text()).to.include('Current value: 6');
});
```

## React + Enzymeとの違い

理想はReact + Enzymeで書かれたテストがEnzyme + Preactでも、または逆でも、簡単に動作することです。
これによって、ReactとPreactを切り替える際にテストを書き直さなくてよくなります。

しかし、Preact用のアダプタとReact用のアダプタには注意すべき動作の違いがあります。

- 浅い(shallow)レンダリングは内部で異なる動作をします。
  1階層だけレンダリングすることは両者とも同じですが、React用とは異なり、Preact用のアダプタは実際のDOMノードを作成します。そして通常のライフサイクルメソッドと副作用フックを実行します。
- `simulate`メソッドはPreat用のアダプタでは実際のDOMイベントをディスパッチします。React用のアダプタでは`on<EventName>` propを呼ぶだけです。
- Preactではステート(state)の更新(`setState`を実行した後)はまとめて行われ、非同期で適用されます。
  Reactではステートの更新はコンテキストに応じて直接もしくはまとめて適用されます。
  テストを書きやすくするために、Preact用のアダプタは最初のレンダリングと`setProps`もしくは`simulate`の呼び出しの後に、それぞれステートの更新とその副作用をまとめて反映します。
  ステートの更新またはその副作用がそれ以外の方法で行われた場合、`preact/test-utils`パッケージの`act`を使用して、手動でステートの更新とその副作用の反映をトリガする必要があります。

より詳しい説明は[Preact用のアダプタのREADME](https://github.com/preactjs/enzyme-adapter-preact-pure#differences-compared-to-enzyme--react)を見てください。
