---
title: 组件
description: '组件是所有 Preact 应用的核心，了解学习如何构建并组合使用它打造来界面。'
---

# 组件

组件为渲染结果添加状态，更是 Preact 的基石和构建复杂界面的基础。

我们将在此教程中展示 Preact 中的两种组件。

---

<div><toc></toc></div>

---

## 函数组件

函数组件是第一个参数为 `props` 的普通函数，其名称**必须**以大写字母开头才能在 JSX 中使用。

```jsx
// --repl
import { render } from 'preact';

// --repl-before
function MyComponent(props) {
  return <div>我的名字叫{props.name}。</div>;
}

// 用法
const App = <MyComponent name="张三" />;

// 渲染结果：<div>我的名字叫张三。</div>
render(App, document.body);
```

> 请注意，在先前的版本中我们将其称之为`“无状态组件”`，但有了[钩子组件](/guide/v10/hooks)后就不是了。

## 类组件

类组件可以拥有状态及生命周期方法，后者是当组件添加到 DOM 或销毁时调用的特殊方法。

下面是一个显示当前时间的简单类组件 `<Clock>`：

```jsx
// --repl
import { Component, render } from 'preact';

// --repl-before
class Clock extends Component {

  constructor() {
    super();
    this.state = { time: Date.now() };
  }

  // 生命周期：在组件创建时调用
  componentDidMount() {
    // 每秒钟更新一次时间
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // 生命周期：在组件销毁时调用
  componentWillUnmount() {
    // 在无法渲染时停止时钟
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}
// --repl-after
render(<Clock />, document.getElementById('app'));
```

### 生命周期方法

为了让时钟能每秒钟更新一次事件，我们需要知道 `<Clock>` 什么时候会被挂载到 DOM 上。如果您用过 HTML5 自定义元素的话，您就会发现这和 `attachedCallback` 与 `detachedCallback` 生命周期方法很像。Preact 会自动为组件调用下列列表中存在的生命周期方法 ：

| 生命周期方法            | 被调用时间                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount()`        | **(已弃用)** 组件将被挂载到 DOM 前调用
| `componentDidMount()`         | 组件被挂载到 DOM 后调用
| `componentWillUnmount()`      | 组件将从 DOM 移除前调用
| `componentWillReceiveProps(nextProps, nextState)` | **(已弃用)** 在传递进新属性前调用
| `getDerivedStateFromProps(nextProps)` | 在 `shouldComponentUpdate` 前调用，请小心使用！
| `shouldComponentUpdate(nextProps, nextState)` | 在 `render()` 前调用，返回 `false` 来跳过渲染
| `componentWillUpdate(nextProps, nextState)` | **(已弃用)** 在 `render()` 前调用
| `getSnapshotBeforeUpdate(prevProps, prevState)` | 在 `render()` 前调用，返回值将传递进 `componentDidUpdate`
| `componentDidUpdate(prevProps, prevState, snapshot)` | 在 `render()` 后调用

这是它们之间关系的可视概览（源自 Dan Abramov 发布的[推文](https://web.archive.org/web/20191118010106/https://twitter.com/dan_abramov/status/981712092611989509)）：

![Diagram of component lifecycle methods](/guide/components-lifecycle-diagram.png)

### 错误边界

错误边界是至少实现了 `componentDidCatch()` 和 `getDerivedStateFromError()` 两者之一的组件。这些特殊方法允许捕获渲染过程中发生的任何错误，通常用于提供更好的错误信息或默认内容并保存日志信息。需要注意的是，错误边界不能捕获所有的错误，事件处理程序和异步代码（如 `fetch()` 调用）需要单独处理。

当捕获到错误时，我们可以使用这些方法对错误做出响应并展示错误信息或默认内容。

```jsx
// --repl
import { Component, render } from 'preact';
// --repl-before
class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = { errored: false };
  }

  static getDerivedStateFromError(error) {
    return { errored: true };
  }

  componentDidCatch(error, errorInfo) {
    errorReportingService(error, errorInfo);
  }

  render(props, state) {
    if (state.errored) {
      return <p>Something went badly wrong</p>;
    }
    return props.children;
  }
}
// --repl-after
render(<ErrorBoundary />, document.getElementById('app'));
```

## 片段 (Fragment)

`Fragment` 允许一次返回多个元素，解决了 JSX 每个“代码块”只能有一个根元素的限制。你将会经常在列表、表格、flexbox 等中间元素会影响样式的情况遇到它。

```jsx
// --repl
import { Fragment, render } from 'preact';

function TodoItems() {
  return (
    <Fragment>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </Fragment>
  )
}

const App = (
  <ul>
    <TodoItems />
    <li>D</li>
  </ul>
);

render(App, container);
// 渲染结果：
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```

请注意，大部分现代转译器支持 `Fragments` 的简写语法，这种语法更为常见：

```jsx
// 如下代码
const Foo = <Fragment>foo</Fragment>;
// ...与下列代码等同：
const Bar = <>foo</>;
```

您也可以从组件中返回数组：

```jsx
function Columns() {
  return [
    <td>Hello</td>,
    <td>World</td>
  ];
}
```

若要在循环中创建 `Fragments`，别忘了为其添加键：

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // 没有键值的话，Preact 需要猜测哪些元素在重渲染时存在变化。
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```
