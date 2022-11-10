---
name: 表单
description: '如何在 Preact 中构建随地可用的表单。'
---

# 表单

Preact 中的表单和 HTML 的一样：渲染一个控件，再为其添加事件监听器。

两者的差别在于大多数情况下 Preact 会为您自动控制 `value`，而不是由 DOM 节点控制。

---

<div><toc></toc></div>

---

## 约束性和非约束性组件

谈到表单控件时，您可能会时常听到约束性和非约束性组件 ((Un)Controlled Component) 的概念。约束性一词指数据流处理的方式。DOM 是双向的数据流，每个表单控件都会为用户管理输入。比如，一个文本框会自动将其值更新为用户输入的值。

Preact 一类的框架通常使用单向数据流，用组件树中更高的元素来管理数据。

```jsx
// 非约束性组件，因为 Preact 没有为其设置数值
<input onInput={myEventHandler} />;

// 约束性组件，因为 Preact 管理其输入数值
<input value={someValue} onInput={myEventHandler} />;
```

您应当**尽量使用约束性组件**。但如果您是在构建独立组件，或包装第三方 UI 库，那么您可以用您的组件提供非 Preact 功能。这种情况下，您更需要非约束性组件。

> 此处要注意的是，将值设为 `undefined` 或 `null` 等同于非约束性组件。

## 构建简单表单

我们来创建一个提交待办事项的简单表单吧。为此，我们需要创建一个 `<form>` 元素，并为其绑定表单提交时会触发的事件监听器，文本框亦然。但请注意，我们不会在类内存储值，而是使用**约束性**输入组件。此例中，这种方式非常适合我们在其他元素中显示文本框的值。

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
    const { value } = e.target;
    this.setState({ value })
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

`<select>` 元素有点复杂，但大致工作原理和其他控件差不多：

```jsx
// --repl
import { render, Component } from "preact";

// --repl-before
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
        <button type="submit">提交</button>
      </form>
    );
  }
}
// --repl-after
render(<MySelect />, document.getElementById("app"));
```

## 复选框和单选按钮

复选框和单选按钮 (`<input type="checkbox|radio">`) 会在非约束性的表单环境中引发混乱。通常情况下，我们需要浏览器帮我们勾选复选框或按钮，或是监听事件并对新传入的值做出反馈。但是，这种情况不适用于 UI 会自动根据状态和属性更新而自动更新的情况。

> **详细解释：**先假设我们需要监听复选框在用户勾选/反选时触发的 “change” 事件。在事件监听器中，我们将 `state` 的值设置为复选框传入的值。这样，组件会被重新渲染，导致复选框再次被赋上状态中的值。但我们刚刚才从 DOM 获取值，再次渲染很明显是多此一举。

所以，我们需要监听用户点击复选框或**相关 `<label>`** 时触发的 `click` 事件，而非 `input` 事件。这样，复选框只会在 `true` 和 `false` 间切换。再次点击复选框或标签时，我们会将状态的布尔值反转，重新渲染，最后将复选框显示的值设置为我们期望的值。

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
