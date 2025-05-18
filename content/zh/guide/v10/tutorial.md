---
title: 快速教程
description: '书写你的第一个preact应用'
---

# 教程

本指南将引导您构建一个简单的"计时时钟"组件。如果您不熟悉虚拟 DOM，请尝试[完整的 Preact 教程](/tutorial)。

> :information_desk_person: 本指南假设您已完成[入门](/guide/v10/getting-started)文档并成功设置了您的工具。如果没有，请从 [Vite](/guide/v10/getting-started#创建一个由-vite-驱动的-preact-应用) 开始。

---

<toc></toc>

---

## Hello World

在任何 Preact 代码库中，您总会看到两个函数：`h()` 和 `render()`。`h()` 函数用于将 JSX 转换为 Preact 能够理解的结构。但它也可以直接使用，而不涉及任何 JSX：

```jsx
// 使用 JSX
const App = <h1>Hello World!</h1>;

// ...相同内容但不使用 JSX
const App = h('h1', null, 'Hello World');
```

仅仅这样做不会产生任何效果，我们需要一种方法将我们的 Hello-World 应用注入到 DOM 中。为此，我们使用 `render()` 函数。

```jsx
// --repl
import { render } from 'preact';

const App = <h1>Hello World!</h1>;

// 将我们的应用注入到 DOM 中
render(App, document.getElementById('app'));
```

恭喜，您已经构建了您的第一个 Preact 应用！

## 交互式 Hello World

渲染文本是一个开始，但我们希望使我们的应用更具交互性。我们希望在数据变化时更新它。:star2:

我们的最终目标是创建一个应用，用户可以在其中输入一个名称，并在提交表单时显示它。为此，我们需要一个地方来存储我们提交的内容。这就是[组件](/guide/v10/components)发挥作用的地方。

因此，让我们将现有的 App 转换为[组件](/guide/v10/components)：

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return <h1>Hello, world!</h1>;
  }
}

render(<App />, document.getElementById("app"));
```

您会注意到，我们在顶部添加了一个新的 `Component` 导入，并将 `App` 转换为一个类。这本身并不有用，但它是我们接下来要做的事情的前奏。为了让事情变得更加有趣，我们将添加一个带有文本输入和提交按钮的表单。

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <form>
          <input type="text" />
          <button type="submit">更新</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

现在我们在谈论了！它开始看起来像一个真正的应用！不过我们仍然需要使它具有交互性。记住，我们希望将 `"Hello world!"` 更改为 `"Hello, [用户输入]!"`，因此我们需要一种方法来知道当前的输入值。

我们将它存储在组件的一个名为 `state` 的特殊属性中。它之所以特殊，是因为当通过 `setState` 方法更新它时，Preact 不仅会更新状态，还会为此组件安排一个渲染请求。一旦请求被处理，我们的组件将使用更新后的状态重新渲染。

最后，我们需要通过设置 `value` 并为 `input` 事件附加一个事件处理程序，将新状态附加到我们的输入框上。

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  // 初始化我们的状态。目前我们只存储输入值
  state = { value: '' }

  onInput = ev => {
    // 这将安排状态更新。更新后，组件
    // 将自动重新渲染自身。
    this.setState({ value: ev.currentTarget.value });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <form>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">更新</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

在这一点上，从用户的角度来看，应用可能没有太大变化，但我们将在下一步中将所有部分组合在一起。

我们将以与刚才为输入框添加处理程序类似的方式，为 `<form>` 的 `submit` 事件添加一个处理程序。不同之处在于，它写入到我们的 `state` 的另一个名为 `name` 的属性中。然后我们替换我们的标题，并在那里插入我们的 `state.name` 值。

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  // 在初始状态中添加 `name`
  state = { value: '', name: 'world' }

  onInput = ev => {
    this.setState({ value: ev.currentTarget.value });
  }

  // 添加一个提交处理程序，用最新的输入值更新 `name`
  onSubmit = ev => {
    // 阻止默认浏览器行为（即不要在这里提交表单）
    ev.preventDefault();

    this.setState({ name: this.state.value });
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.state.name}!</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.value} onInput={this.onInput} />
          <button type="submit">更新</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
```

好了！我们完成了！现在我们可以输入一个自定义名称，点击"更新"，我们的新名称就会出现在我们的标题中。

## 时钟组件

我们已经编写了第一个组件，现在让我们多练习一下。这次我们构建一个时钟。

```jsx
// --repl
import { h, render, Component } from 'preact';

class Clock extends Component {
  render() {
    let time = new Date().toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.getElementById("app"));
```

好的，这相当容易！问题是，时间不会改变。它在我们渲染时钟组件的那一刻被冻结了。

因此，我们希望在组件被添加到 DOM 时启动一个 1 秒的定时器，并在它被移除时停止。我们将在 `componentDidMount` 中创建定时器并存储对它的引用，并在 `componentWillUnmount` 中停止定时器。在每个定时器滴答声上，我们将用新的时间值更新组件的 `state` 对象。这样做将自动重新渲染组件。

```jsx
// --repl
import { h, render, Component } from 'preact';

class Clock extends Component {
  state = { time: Date.now() };

  // 在我们的组件创建时调用
  componentDidMount() {
    // 每秒更新时间
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // 在我们的组件即将被销毁之前调用
  componentWillUnmount() {
    // 无法渲染时停止
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.getElementById("app"));
```

我们又做到了！现在我们有了[一个滴答作响的时钟](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)！