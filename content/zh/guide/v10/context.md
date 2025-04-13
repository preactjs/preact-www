---
title: 上下文
description: '上下文可让您通过中间组件传递属性。此文档同时提供新版本和老版本 API 的使用方法。'
---

# 上下文

上下文允许你直接传值到组件树下方，无需使用 prop 通过中间组件传递。主题是一个最常用的的用例。简而言之，可以将上下文看作 Preact 中发布订阅模式的更新方式。

使用上下文有两种方式：使用新版的 `createContext` API，或是使用旧版上下文 API。两者区别在于旧版 API 无法在中间组件 `shouldComponentUpdate` 终止渲染时更新子组件。这也是我们强烈建议您使用 `createContext` 的原因。

---

<div><toc></toc></div>

---

## createContext

首先，我们需要通过 `createContext(initialValue)` 函数创建一个可以传递的上下文对象。此函数返回一个用于设置上下文中值的 `Provider` 组件和用于从上下文中取回值的 `Consumer` 组件。

`initialValue` 参数仅在组件树中不存在对应的 `Provider` 组件时使用，这有助于独立地测试组件，它避免了封装 `Provider`。

```jsx
// --repl
import { render, createContext } from 'preact';

const SomeComponent = props => props.children;
// --repl-before
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => {
        return <button {...props} class={'btn ' + theme}>主题按钮</button>;
      }}
    </Theme.Consumer>
  );
}

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </Theme.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById("app"));
```

> 另一种使用 Context 的简单方法是使用 [useContext](/guide/v10/hooks#usecontext) 钩子。

## 旧版上下文 API

处于向后兼容我们仍提供此旧版 API，它已经被 `createContext` API 取代。此 API 在中间组件的 `shouldComponentUpdate` 方法返回 `false` 时会出现阻塞更新问题。若您仍需要此方法，请继续阅读。

组件需要实现 `getChildContext` 才能通过上下文传递自定义变量，你可以在此方法内返回想在上下文中存储的值。然后可以通过函数组件的第二个参数或类组件的 `this.context` 获取存储的值。

```jsx
// --repl
import { render } from 'preact';

const SomeOtherComponent = props => props.children;
// --repl-before
function ThemedButton(props, context) {
  return (
    <button {...props} class={'btn ' + context.theme}>
      主题按钮
    </button>
  );
}

class App extends Component {
  getChildContext() {
    return {
      theme: 'light'
    }
  }

  render() {
    return (
      <div>
        <SomeOtherComponent>
          <ThemedButton />
        </SomeOtherComponent>
      </div>
    );
  }
}
// --repl-after
render(<App />, document.getElementById("app"));
```
