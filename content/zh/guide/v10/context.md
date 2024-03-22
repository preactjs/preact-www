---
name: 上下文
description: '上下文可让您通过中间组件传递属性。此文档同时提供新版本和老版本 API 的使用方法。'
---

# 上下文

上下文可让您为语法树中的最下子元素直接传递值，无需先使用属性为树中间的每个元素传递。主题系统是最常见的用例之一。您可以将上下文想象为一种使用发布/订阅范式的主题更新方式。

您可以使用两种不同的上下文创建方式：使用新版的 `createContext` API，或是使用旧版的上下文 API。两者区别在于旧版无法在中间组件通过 `shouldComponentUpdate` 取消渲染时更新子元素。这也是我们强烈建议您使用 `createContext` 的原因。

---

<div><toc></toc></div>

---

## createContext

首先，我们需要通过 `createContext(初始值)` 函数创建一个可以传递的上下文对象。此函数返回一个 `Provider` 组件，`Consumer` 组件可通过创建的组件从上下文中取得需要的值。

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

> 另一种简单的方法是使用 [useContext](/guide/v10/hooks/#usecontext) 钩子。

## 旧版上下文 API

我们由于向后兼容原因仍提供此旧版 API。此 API 在中间组件的 `shouldComponentUpdate` 方法返回 `false` 时会出现阻塞更新问题。若您仍需要此方法，请继续阅读。

组件需要实现 `getChildContext` 才能通过上下文传递自定义变量，您可以在此方法内返回您想要在上下文中存储的值。您然后可以在函数组件的第二个参数或类组件的 `this.context` 获取存储的值。

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
