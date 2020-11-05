---
name: フォーム
description: 'Preactでどこでも動作する素晴らしいフォームを作成する方法'
---

# フォーム

PreactのフォームとHTMLのフォームは、ほとんど同じように動作します。両方ともコントロールをレンダリングしイベントリスナをセットします。

両者の主な違いは、ほとんどの場合で`value`の管理をDOMノードもしくはコンポーネントのどちらが行うかです。

---

<div><toc></toc></div>

---

## ControlledコンポーネントとUncontrolledコンポーネント

フォームコントロールについての文章で"Controlled"コンポーネントと"Uncontrolled"コンポーネントという単語をよく見ます。
 "Controlled"と"Uncontrolled"はフォームコントロールのデータフローの扱い方を表しています。
DOMのすべてのフォームコントロールはユーザの入力を自身で管理するのでDOMは双方向のデータフローになります。
例として、ユーザがテキスト`input`要素にタイプすると、その値は必ず反映されます。

それとは対照的にPreactのようなフレームワークは一般的に単方向のデータフローを採用しています。
Preactでは、ほとんどの場合、フォームコントール(例えばinputテキスト要素)自体では値を管理しません。より上位のコンポーネント(例えばinputテキスト要素を持つコンポーネント)が値を管理します。

Controlledコンポーネントはコンポーネントが入力コントロールの値を管理するコンポーネントです。
Uncontrolledコンポーネントはコンポーネントが入力コントロールの値を管理しないコンポーネントです。

```jsx
// これはControlledコンポーネントです。Preactは入力されたデータを管理します。
<input value={someValue} onInput={myEventHandler} />;

// これはUncontrolledコンポーネントです。Preactはvalueに値をセットしません。DOMが値を管理します。
<input onInput={myEventHandler} />;
```

一般的に常にControlledコンポーネントを使うべきです。
しかし、Uncontrolledコンポーネントは単なるHTMLの断片として使用されるコンポーネントやサードパーティのUIライブラリをラップする場合に使用すると便利です。

> value属性の値を`undefined`もしくは`null`にセットすると`Uncontrolled`になることに注意してください。

## 簡単なフォームの作成

ToDoを送信する簡単なフォームを作成しましょう。
`<form>`要素を作成します。そして、`<form>`要素のonSubmitにイベントハンドラをセットします。
テキストinputフィールドにも同様のことをしますが、値を`setState()`を使ってTodoFormコンポーネントに保存していることに注目してください。
お察しの通り、ここではControlledコンポーネントを使っています。
この例では、入力した値を別の要素に表示する必要があるので、Controlledコンポーネントが適しています。

```jsx
class TodoForm extends Component {
  state = { value: '' };

  onSubmit = e => {
    alert("Submitted a todo");
    e.preventDefault();
  }

  onInput = e => {
    const { value } = e.target;
    this.setState({ value })
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" value={value} onInput={this.onInput} />
        <p>You typed this value: {value}</p>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

## Select要素

`<select>`要素はもう少し複雑ですが、他のフォームコントロールと同じように動作します。

```jsx
class MySelect extends Component {
  state = { value: '' };

  onChange = e => {
    this.setState({ value: e.target.value });
  }

  onSubmit = e => {
    alert("Submitted " + this.state.value);
    e.preventDefault();
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <select value={value} onChange={this.onChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```
