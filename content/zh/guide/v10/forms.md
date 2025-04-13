---
title: 表单
description: '如何在 Preact 中构建随地可用的表单。'
---

# 表单

Preact 中的表单和 HTML 的一样：渲染一个控件，再为其添加事件监听器。

两者的差别在于大多数情况下 `value` 由 Preact 控制，而不是 DOM 节点。

---

<toc></toc>

---

## 受控组件和非受控组件

谈到表单控件时，你会经常遇到“受控组件”和“非受控组件”。它们描述的是数据流的处理方式。DOM 是双向的数据流，因为每个表单控件都会自行管理用户输入。一个简单的文本框总是会在用户输入时更新它的值。

Preact 一类的框架通常使用单向数据流，组件本身并不管理数据，而是由组件树中更高的组件来管理。

```jsx
// 非受控组件，因为 Preact 没有为其设置数值
<input onInput={myEventHandler} />;

// 受控组件，因为 Preact 管理其输入数值
<input value={someValue} onInput={myEventHandler} />;
```

一般来说，任何时候都应**尽量使用受控组件**。当构建独立组件，或封装第三方 UI 库时，那么您可以用您的组件提供非 Preact 功能。这种情况下，非受控组件更能胜任。

> 此处要注意的是，将值设为 `undefined` 或 `null` 等同于非受控组件。

## 创建简单表单

我们来创建一个提交待办事项的简单表单吧。为此，我们需要创建一个 `<form>` 元素，并为其绑定表单提交时会触发的事件监听器，对文本框也做同样的处理，但注意我们在自己的类中存储值。正如你所想，我们使用的是受控的文本框。在此示例中它非常有用，因为我们需要在其他元素中展示文本框的值。

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class TodoForm extends Component {
  state = { value: '' };

  onSubmit = e => {
    alert("Submitted a todo");
    e.preventDefault();
  }

  onInput = e => {
    this.setState({ e.currentTarget.value })
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" value={value} onInput={this.onInput} />
        <p>您输入了：{value}</p>
        <button type="submit">提交</button>
      </form>
    );
  }
}
// --repl-after
render(<TodoForm />, document.getElementById("app"));
```

## 选择菜单

`<select>` 元素稍微复杂些，但大致工作原理和其他表单控件差不多：

```jsx
// --repl
import { render, Component } from "preact";

// --repl-before
class MySelect extends Component {
  state = { value: '' };

  onChange = e => {
    this.setState({ value: e.currentTarget.value });
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
        <button type="submit">提交</button>
      </form>
    );
  }
}
// --repl-after
render(<MySelect />, document.getElementById("app"));
```

## 复选框和单选按钮

在构建受控表单时，复选框和单选按钮（`<input type="checkbox|radio">`）起初可能会造成困惑。这是因为在非受控环境下，我们通常让浏览器勾选复选框或单选按钮，然后监听变化事件并对事件作出响应。然而这种技术并不能很好地过渡到 UI 自动根据状态和 prop 更新的世界观。

> **试想：** 假设我们在复选框上监听“change”事件，它将在用户选中或取消选中时触发。在事件处理函数中，我们将状态中的一个值设置为复选框中接收到的新值，这会导致组件重新渲染，进而导致复选框的值根据状态重新设置。这是完全多余的，因为我们只是需要 DOM 的一个值，并要求它在值变化时重新渲染

所以，我们无需监听 `input` 事件，而是监听 `click` 事件，它会在用户点击复选框或*相关联*的 `<label>` 时触发。复选框只会在 `true` 和 `false` 间切换，当点击复选框或标签时，只会反转状态中的对应值，触发重新渲染，并将复选框显示的值设置为我们期望的值。

### 复选框示例

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class MyForm extends Component {
  toggle = e => {
      let checked = !this.state.checked;
      this.setState({ checked });
  };

  render(_, { checked }) {
    return (
      <label>
        <input
          type="checkbox"
          checked={checked}
          onClick={this.toggle}
        />
        选中这个复选框
      </label>
    );
  }
}
// --repl-after
render(<MyForm />, document.getElementById("app"));
```
