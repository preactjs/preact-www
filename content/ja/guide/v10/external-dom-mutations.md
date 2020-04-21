---
name: Preactのステート管理の範囲外のDOMとの連携
permalink: '/guide/external-dom-mutations'
description: '直接DOMを操作するjQueryやその他のJavaScriptのスニペットとの連携'
---

# Preactのステート管理の範囲外のDOMとの連携

DOMを自由に操作したり、DOMにステートを保持したり、Preactコンポーネントとライブラリが生成したDOMを判別することができないサードパーティライブラリと連携する必要がある場合があります。そのような素晴らしいUIツールキットや再利用可能な部品が多く存在します。

このタイプのライブラリと連携するためには、サードパーティライブラリなどが行うDOMの変更を、Preactが上書きしてしまわないよう、仮想DOMのrendering/diffingアルゴリズムに教えてあげる必要があります

---

<div><toc></toc></div>

---

## テクニック

これはコンポーネントに`false`を返す`shouldComponentUpdate()`メソッドを定義するだけで簡単にできます。

```jsx
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

短く書くと以下のようになります。

```jsx
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

このライフサイクルフックを追加して再レンダリングを抑止することで、コンポーネントが削除されるまでの間、そのDOMが更新されないようにすることができます。
通常のコンポーネントと同様、ルートDOM要素は`this.base`で参照することができます。
それは`render()`が返したルートJSX要素に対応するDOM要素です。

---

## 例

以下はコンポーネントの再レンダリングを"オフ"にする例です。
この場合でも、`render()`は最初のDOM構造を生成するためにコンポーネントを生成し配置する過程で実行されることに注意してください。

```jsx
class Example extends Component {
  shouldComponentUpdate() {
    // 差分による再レンダリングをしません。
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // 必要に応じてpropsが来たときの処理を書きます。
  }

  componentDidMount() {
    // コンポーネントがDOMにマウントされました。自由にDOMを操作することができます。
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // コンポーネントがDOMから削除されます。DOMのクリーンアップ処理をここに書きます。
  }

  render() {
    return <div class="example" />;
  }
}
```


## デモ

[![デモ](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**Webpackbinで動くデモを見る**](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)


## 実際の例

または、[preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js)で、このテクニックの使い方を確認してください。
この例ではDOM内の足場としてコンポーネントを使用します。
そして、コンポーネントの更新を無効にしてinput要素の処理を[tags-input](https://github.com/developit/tags-input)に引き継がせます。
より複雑な例として[preact-richtextarea](https://github.com/developit/preact-richtextarea)があります。これは編集可能な`<iframe>`の再レンダリングを避けるテクニックを使っています。
