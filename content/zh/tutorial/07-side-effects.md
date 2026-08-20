---
title: 副作用
prev: /tutorial/06-context
next: /tutorial/08-keys
solvable: true
---

# 副作用

副作用是在虚拟DOM树中发生变化时运行的代码片段。它们不遵循接受`props`并返回新虚拟DOM树的标准方法，并且经常伸出树外去改变状态或调用命令式代码，比如调用DOM API。副作用也经常被用作触发数据获取的方式。

### Effects：函数组件中的副作用

在前一章学习refs和`useRef()`钩子时，我们已经看到了一个副作用实际运行的例子。一旦我们的ref被填充了一个指向DOM元素的`current`属性，我们需要一种方法来"触发"与该元素交互的代码。

为了在渲染后触发代码，我们使用了`useEffect()`钩子，这是从函数组件创建副作用的最常见方式：

```jsx
import { useRef, useEffect } from 'preact/hooks';

export default function App() {
  const input = useRef()

  // 这里的回调将在<App>渲染后运行：
  useEffect(() => {
    // 访问关联的DOM元素：
    input.current.focus()
  }, [])

  return <input ref={input} />
}
```

注意作为`useEffect()`第二个参数传递的空数组。当该"依赖项"数组中的任何值从一次渲染到下一次渲染发生变化时，Effect回调就会运行。例如，组件第一次渲染时，所有effect回调都会运行，因为没有之前的"依赖项"数组值可以比较。

我们可以在"依赖项"数组中添加值，根据条件触发effect回调，而不仅仅是在组件首次渲染时。这通常用于响应数据变化运行代码，或者当组件从页面中移除（"卸载"）时。

让我们看一个例子：

```js
import { useEffect, useState } from 'preact/hooks';

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('<App>刚刚第一次被渲染')
  }, [])

  useEffect(() => {
    console.log('count值改变为：', count)
  }, [count])
  //  ^ 每当`count`改变时运行这个，以及在第一次渲染时

  return <button onClick={() => setCount(count+1)}>{count}</button>
}
```

### 生命周期方法：类组件中的副作用

类组件也可以定义副作用，通过实现Preact提供的任何可用[生命周期方法]。以下是一些最常用的生命周期方法：

| 生命周期方法 | 何时运行： |
|:-----------------|:--------------|
| `componentWillMount` | 组件首次渲染之前
| `componentDidMount` | 组件首次渲染之后
| `componentWillReceiveProps` | 组件重新渲染之前
| `componentDidUpdate` | 组件重新渲染之后

在类组件中使用副作用的最常见例子之一是在组件首次渲染时获取数据，然后将该数据存储在状态中。以下示例显示了一个组件，它在首次渲染后从JSON API请求用户信息，然后显示该信息。

```jsx
import { Component } from 'preact';

export default class App extends Component {
  // 这在组件首次渲染后被调用：
  componentDidMount() {
    // 获取JSON用户信息，存储在`state.user`中：
    fetch('/api/user')
      .then(response => response.json())
      .then(user => {
        this.setState({ user })
      })
  }

  render(props, state) {
    const { user } = state;

    // 如果我们还没有收到数据，显示一个加载指示器：
    if (!user) return <div>加载中...</div>

    // 我们有数据！显示我们从API得到的用户名：
    return (
      <div>
        <h2>你好，{user.username}！</h2>
      </div>
    )
  }
}
```

## 试一试！

我们保持这个练习简单：修改右边的代码示例，使其在每次`count`改变时进行日志记录，而不仅仅是在`<App>`首次渲染时。

<solution>
  <h4>🎉 恭喜你！</h4>
  <p>你学会了如何在Preact中使用副作用。</p>
</solution>


```js:setup
useRealm(function (realm) {
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  win.console.log = function(m, s) {
    if (/Count is now/.test(m) && s === 1) {
      solutionCtx.setSolved(true);
    }
    return prevConsoleLog.apply(win.console, arguments);
  };

  return function () {
    win.console.log = prevConsoleLog;
  };
}, []);
```


```jsx:repl-initial
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count is now: ', count)
  }, []);
  // ^^ start here!

  return <button onClick={() => setCount(count+1)}>{count}</button>
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count is now: ', count)
  }, [count]);
  // ^^ start here!

  return <button onClick={() => setCount(count+1)}>{count}</button>
}

render(<App />, document.getElementById("app"));
```

[lifecycle methods]: /guide/v11/components#lifecycle-methods
