---
title: 上下文
description: 上下文允许您通过中间组件传递属性。本文档描述了新旧两种API
---

# 上下文

上下文是一种在组件树中传递数据的方式，无需通过props将其传递给中间的每个组件。简而言之，它允许层次结构中的任何位置的组件订阅一个值并在其变化时收到通知，为Preact带来发布-订阅风格的更新。

在某些情况下，需要将祖父组件（或更高层级）的值传递给子组件，而中间组件往往不需要这个值，这种情况并不少见。这种传递props的过程通常被称为"prop钻取"（prop drilling），它可能会变得繁琐、容易出错，而且非常重复，尤其是随着应用程序的增长，更多的值必须通过更多的层级传递。这是上下文旨在解决的关键问题之一，它提供了一种方式让子组件订阅组件树中更高层级的值，无需通过prop传递就能访问该值。

在Preact中使用上下文有两种方式：通过较新的`createContext` API和传统上下文API。如今，几乎没有理由使用传统API，但为了完整性这里也会进行记录。

---

<toc></toc>

---

## 现代上下文API

### 创建上下文

要创建新的上下文，我们使用`createContext`函数。此函数接受一个初始状态作为参数，并返回一个具有两个组件属性的对象：`Provider`，使上下文对后代可用；以及`Consumer`，用于访问上下文值（主要在类组件中）。

```jsx
import { createContext } from "preact";

export const Theme = createContext("light");
export const User = createContext({ name: "Guest" });
export const Locale = createContext(null);
```

### 设置Provider

创建上下文后，我们必须使用`Provider`组件使其对后代可用。`Provider`必须提供一个`value`属性，表示上下文的初始值。

> 只有在树中消费者上方没有`Provider`的情况下，才会使用从`createContext`设置的初始值。这对于单独测试组件可能很有帮助，因为它避免了在组件周围创建包装`Provider`的需要。

```jsx
import { createContext } from "preact";

export const Theme = createContext("light");

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent />
    </Theme.Provider>
  );
}
```

> **提示：** 您可以在整个应用程序中拥有同一上下文的多个provider，但只会使用离消费者最近的那个。

### 使用上下文

消费上下文有两种方式，主要取决于您喜欢的组件风格：`Consumer`（类组件）和`useContext`钩子（函数组件/钩子）。

<tab-group tabstring="Consumer, useContext">

```jsx
// --repl
import { render, createContext } from "preact";

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext("#673ab8");

function ThemedButton() {
  return (
    <ThemePrimary.Consumer>
      {theme => <button style={{ background: theme }}>主题按钮</button>}
    </ThemePrimary.Consumer>
  );
}

function App() {
  return (
    <ThemePrimary.Provider value="#8f61e1">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </ThemePrimary.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById("app"));
```

```jsx
// --repl
import { render, createContext } from "preact";
import { useContext } from "preact/hooks";

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext("#673ab8");

function ThemedButton() {
  const theme = useContext(ThemePrimary);
  return <button style={{ background: theme }}>主题按钮</button>;
}

function App() {
  return (
    <ThemePrimary.Provider value="#8f61e1">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </ThemePrimary.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById("app"));
```

</tab-group>

### 更新上下文

静态值可能有用，但更多时候，我们希望能够动态更新上下文值。为此，我们利用标准组件状态机制：

```jsx
// --repl
import { render, createContext } from "preact";
import { useContext, useState } from "preact/hooks";

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext(null);

function ThemedButton() {
  const { theme } = useContext(ThemePrimary);
  return <button style={{ background: theme }}>主题按钮</button>;
}

function ThemePicker() {
  const { theme, setTheme } = useContext(ThemePrimary);
  return (
    <input
      type="color"
      value={theme}
      onChange={e => setTheme(e.currentTarget.value)}
    />
  );
}

function App() {
  const [theme, setTheme] = useState("#673ab8");
  return (
    <ThemePrimary.Provider value={{ theme, setTheme }}>
      <SomeComponent>
        <ThemedButton />
        {" - "}
        <ThemePicker />
      </SomeComponent>
    </ThemePrimary.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById("app"));
```

## 传统上下文API

此API被视为传统API，应在新代码中避免使用，它有已知问题，存在仅出于向后兼容性原因。

此API与新API之间的一个关键区别是，当子组件和提供者之间的组件通过`shouldComponentUpdate`中止渲染时，此API无法更新子组件。当这种情况发生时，子组件**将不会**接收到更新的上下文值，这通常会导致撕裂（部分UI使用新值，部分使用旧值）。

要通过上下文传递值，组件需要具有`getChildContext`方法，返回预期的上下文值。然后，后代可以通过函数组件中的第二个参数或类组件中的`this.context`访问上下文。

```jsx
// --repl
import { render } from "preact";

const SomeOtherComponent = props => props.children;
// --repl-before
function ThemedButton(_props, context) {
  return (
    <button style={{ background: context.theme }}>
      主题按钮
    </button>
  );
}

class App extends Component {
  getChildContext() {
    return {
      theme: "#673ab8"
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
