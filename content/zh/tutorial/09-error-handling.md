---
title: 错误处理
prev: /tutorial/08-keys
next: /tutorial/10-links
solvable: true
---

# 错误处理

JavaScript是一种灵活的解释型语言，这意味着在运行时遇到错误是可能的（甚至很容易）。无论是由于意外情况还是我们编写的代码中的错误，能够监控错误并实现某种形式的恢复或优雅的错误处理都很重要。

在Preact中，我们通过捕获错误并将其保存为状态来实现这一点。这使组件能够拦截意外或失败的渲染，并切换到渲染不同的内容作为后备方案。

### 将错误转化为状态

有两个API可用于捕获错误并将其转化为状态：`componentDidCatch`和`getDerivedStateFromError`。它们在功能上类似，都是可以在类组件上实现的方法：

**componentDidCatch**获取一个`Error`参数，并可以根据具体情况决定如何响应该错误。它可以调用`this.setState()`来渲染一个后备或替代树，这将"捕获"错误并将其标记为已处理。或者，该方法可以简单地在某处记录错误，并允许其继续未处理（崩溃）。

**getDerivedStateFromError**是一个静态方法，它获取一个`Error`参数，并返回一个状态更新对象，该对象通过`setState()`应用于组件。由于此方法总是产生导致其组件重新渲染的状态变化，因此它总是将错误标记为已处理。

以下示例展示了如何使用这两种方法来捕获错误并显示优雅的错误消息，而不是崩溃：

```jsx
import { Component } from 'preact'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error: error.message }
  }

  componentDidCatch(error) {
    console.error(error)
    this.setState({ error: error.message })
  }

  render() {
    if (this.state.error) {
      return <p>哎呀！我们遇到了一个错误：{this.state.error}</p>
    }
    return this.props.children
  }
}
```

上面的组件是Preact应用程序中错误处理实现的一个相对常见的例子，通常被称为_错误边界_。

### 嵌套和错误冒泡

当Preact渲染你的虚拟DOM树时遇到的错误会"冒泡"，很像DOM事件。从遇到错误的组件开始，树中的每个父组件都有机会处理错误。

因此，如果使用`componentDidCatch`实现，错误边界可以嵌套。当组件的`componentDidCatch()`方法_不_调用`setState()`时，错误将继续在虚拟DOM树中冒泡，直到到达一个带有确实调用`setState()`的`componentDidCatch`方法的组件。

## 试一试！

为了测试我们的错误处理知识，让我们向简单的App组件添加错误处理。App内部深处的一个组件在某些情况下可能会抛出错误，我们希望捕获这个错误，这样我们就可以显示一条友好的消息，告诉用户我们遇到了意外错误。

<solution>
  <h4>🎉 恭喜你！</h4>
  <p>你学会了如何处理Preact代码中的错误！</p>
</solution>


```js:setup
useResult(function(result) {
  var options = require('preact').options;

  var oe = options.__e;
  options.__e = function(error, s) {
    if (/objects are not valid/gi.test(error)) {
      throw Error('It looks like you might be trying to render an Error object directly: try storing `error.message` instead of `error` itself.');
    }
    oe.apply(this, arguments);
    setTimeout(function() {
      if (result.output.textContent.match(/error/i)) {
        solutionCtx.setSolved(true);
      }
    }, 10);
  };

  return function () {
    options.__e = oe;
  };
}, []);
```


```jsx:repl-initial
import { render, Component } from 'preact';
import { useState } from 'preact/hooks';

function Clicker() {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    throw new Error('I am erroring');
  }

  return <button onClick={() => setClicked(true)}>Click Me</button>;
}

class App extends Component {
  state = { error: null };

  render() {
    return <Clicker />;
  }
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render, Component } from 'preact';
import { useState } from 'preact/hooks';

function Clicker() {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    throw new Error('I am erroring');
  }

  return <button onClick={() => setClicked(true)}>Click Me</button>;
}

class App extends Component {
  state = { error: null };

  componentDidCatch(error) {
    this.setState({ error: error.message });
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <p>Oh no! There was an error: {error}</p>
    }
    return <Clicker />;
  }
}

render(<App />, document.getElementById("app"));
```
