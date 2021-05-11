---
name: Webコンポーネント
description: 'WebコンポーネントとPreactを連携させる方法'
---

# Webコンポーネント

Preactはサイズが小さくて標準を尊重しているので、Webコンポーネントの構築に最適です。

Webコンポーネント(Web Components)は新しいHTML要素(`<material-card>`や`<tab-bar>`のようなカスタム要素)を構築できるようにする標準仕様です。
Preactはその標準仕様をすべてサポートしています。そして、カスタム要素(Custom Elements)のライフサイクル、プロパティ、イベントをシームレスに使うことができます。

Preactは完全なアプリケーションとページを構成する個々の部品の両方をレンダリングできるようにデザインされているので、Webコンポーネントの構築に適しています。
多くの企業が、Preactでコンポーネントやシステムを構築し、さらにそれをWebコンポーネントとしてラップして、複数の他のプロジェクトや他のフレームワーク内で再利用できるようにしています。

PreactとWebコンポーネントは相互補完的なテクノロジーです。
Webコンポーネントはブラウザを拡張するための低レベルの基盤を提供します。
一方、Preactはそれらの基盤の上に構築された高レベルのコンポーネントモデルを提供します。

---

<div><toc></toc></div>

---

## Webコンポーネントをレンダリングする

WebコンポーネントはPreact内で他のDOM要素と同じように動作し、登録したタグ名でレンダリングできます。

```jsx
customElements.define('x-foo', class extends HTMLElement {
  // ...
});

function Foo() {
  return <x-foo />;
}
```

### プロパティと属性

JSXではプロパティと属性を見分ける方法がありません。
カスタム要素では、属性として表現できない複雑な値を扱う場合は、一般的にカスタムプロパティを使います。
Preactでは、レンダラーが自動的に対象のDOM要素を検査して、プロパティを使用して値をセットするか、属性を使用して値をセットするか、自動で判断するため、カスタムプロパティは問題なく動作します。
カスタム要素にプロパティに対する[セッター](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)が定義されている場合、Preactはそれを検出し、属性の代わりにそのセッターを使用します。

```jsx
customElements.define('context-menu', class extends HTMLElement {
  set position({ x, y }) {
    this.style.cssText = `left:${x}px; top:${y}px;`;
  }
});

function Foo() {
  return <context-menu position={{ x: 10, y: 20 }}> ... </context-menu>;
}
```

`preact-render-to-string` ("SSR")を使って静的なHTMLをレンダリングする場合、上記のようにプロパティにオブジェクトのような複雑な値がセットされると、それらは自動的にシリアライズされません。
これらの値はクライアント上で静的なHTMLがhydrateされた後に適用されます。

## インスタンスメソッドにアクセスする

`ref`を使うとWebコンポーネントのインスタンスにアクセスすることができます。

```jsx
function Foo() {
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.doSomething();
    }
  }, []);

  return <x-foo ref={myRef} />;
}
```

## カスタムイベントをトリガする

Preactでは標準のDOMイベントは小文字に正規化されます。
例えば、`onChange` propと`onchange` propは両方とも同じ"change"イベントリスナとみなされます。
一方、カスタムイベントは大文字小文字を区別します。
例えば、`onTabChange` propと`ontabchange` propは別のイベントリスナとみなされます。
`onTabChange` propは"TabChange"イベントリスナとみなされます。
`ontabchange` propは"tabchange"イベントリスナとみなされます。

```jsx
// Standard DOM event: "click"イベントのイベントリスナです。
<input onClick={() => console.log('click')} />

// Standard DOM event: "click"イベントのイベントリスナです。
<input onclick={() => console.log('click')} />

// Custom Event: "TabChange"イベントのイベントリスナです。
<div onTabChange={() => console.log('tab change')} />

// Custom Event: "tabchange"イベントのイベントリスナです。
<div ontabchange={() => console.log('tab change')} />
```

## Webコンポーネントを作成する

[preact-custom-element](https://github.com/preactjs/preact-custom-element)使用すると任意のPreactコンポーネン卜をWebコンポーネントに変換することができます。
`preact-custom-element`はカスタム要素バージョン1の仕様を満たすとても薄いラッパーです。

```jsx
import register from 'preact-custom-element';

const Greeting = ({ name = 'World' }) => (
  <p>Hello, {name}!</p>
);

register(Greeting, 'x-greeting', ['name']);
//          ^            ^           ^
//          |        HTMLタグ名      |
//    コンポーネント         Observed Attributes
```

> メモ: [カスタム要素の仕様](http://w3c.github.io/webcomponents/spec/custom/#prod-potentialcustomelementname)によると、タグ名にハイフン(`-`)が含まれる必要があります。

上記で作成したタグ名をHTMLで使用します。属性のキーと値は`props`としてコンポーネントに渡されます。

```html
<x-greeting name="Billy Jo"></x-greeting>
```

結果は以下のようになります。

```html
<p>Hello, Billy Jo!</p>
```

### Observed Attributes

Webコンポーネントは属性の値が変わった時にそれを反映するするために、それらを明示的に指定する必要があります。
以下のように、それらの属性を`register()`関数の第3引数に指定します。

```jsx
// `name`属性の変更を監視します。
register(Greeting, 'x-greeting', ['name']);
```

以下のように、`register()`関数の第3引数を指定せずに、コンポーネントの静的な`observedAttributes`プロパティで監視対象の属性を指定することもできます。
同様に、静的な`tagName`プロパティでカスタム要素名を指定することができます。

```jsx
import register from 'preact-custom-element';

// <x-greeting name="Bo"></x-greeting>
class Greeting extends Component {
  // <x-greeting>として登録します。
  static tagName = 'x-greeting';

  // 以下の属性を監視します。
  static observedAttributes = ['name'];

  render({ name }) {
    return <p>Hello, {name}!</p>;
  }
}
register(Greeting);
```

`observedAttributes`が指定されなかった場合、`propTypes`が存在していれば、そのキーから推測されます。

```jsx
// PropTypesを使うやり方
function FullName({ first, last }) {
  return <span>{first} {last}</span>
}

FullName.propTypes = {
  first: Object,   // PropTypesを使用するか、このように型定義されていない(un-typed)プロパティを使用します。
  last: Object
};

register(FullName, 'full-name');
```

### スロット(slots)をpropsとして渡す

`register()`関数には、オプションを渡すための第4引数があります。現在は、指定した要素にShadow DOMツリーを作成するための`shadow`オプションのみサポートされています。`shadow`オプションを有効にすれば、名前付きのスロット要素を使用して、カスタム要素の子要素をShadowツリーの特定の場所に配置することができます。

```jsx
function TextSection({ heading, content }) {
	return (
		<div>
			<h1>{heading}</h1>
			<p>{content}</p>
		</div>
	);
}

register(TextSection, 'text-section', [], { shadow: true });
```

使い方:

```html
<text-section>
  <span slot="heading">Nice heading</span>
  <span slot="content">Great content</span>
</text-section>
```
