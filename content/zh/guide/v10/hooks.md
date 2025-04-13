---
title: 钩子
description: 'Preact 中的钩子可让你组合行为和在不同组件中重用逻辑。'
---

# 钩子

钩子 API 是一个新概念，它可让你组合状态和副作用。利用钩子还可以在组件之间重用有状态的逻辑。

如果你已经使用过一段时间的 Preact，可能熟悉“渲染 prop”和“高阶组件”等解决上述难题的模式。这些解决方案使代码变得更难以理解和抽象。钩子 API 可以整洁地提取状态和副作用的逻辑，并简化了依赖此逻辑的组件的单元测试。

钩子可用于任何组件，并可以避免类组件依赖的 `this` 关键字的许多缺陷。钩子依赖于闭包，而不是从组件实例上访问属性。这使得它们的值是有界的，并消除了在处理异步状态时可能出现的旧数据问题。

有两种引入钩子的方式：`preact/hooks` 或 `preact/compat`。

---

<div><toc></toc></div>

---

## 介绍

理解钩子最简单的方式就是将其与等价的类组件比较。

我们将用一个简单的计数器组件作为示例，它渲染一个数字和一个将数字加一的按钮。

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class Counter extends Component {
  state = {
    value: 0
  };

  increment = () => {
    this.setState(prev => ({ value: prev.value +1 }));
  };

  render(props, state) {
    return (
      <div>
        <p>Counter: {state.value}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

下面这是一个使用钩子构建的等价函数式组件：

```jsx
// --repl
import { useState, useCallback } from "preact/hooks";
import { render } from "preact";
// --repl-before
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);

  return (
    <div>
      <p>Counter: {value}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

在这一点上它们看起来很相似，但我们可以进一步简化钩子的版本。

让我们将计数器的逻辑提取到自定义钩子中，使其可以在不同组件中轻松重用：

```jsx
// --repl
import { useState, useCallback } from "preact/hooks";
import { render } from "preact";
// --repl-before
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);
  return { value, increment };
}

// 第一个计数器
function CounterA() {
  const { value, increment } = useCounter();
  return (
    <div>
      <p>Counter A: {value}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// 第二个渲染不同数值的计数器
function CounterB() {
  const { value, increment } = useCounter();
  return (
    <div>
      <h1>Counter B: {value}</h1>
      <p>I'm a nice counter</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
// --repl-after
render(
  <div>
    <CounterA />
    <CounterB />
  </div>,
  document.getElementById("app")
);
```

注意 `CounterA` 和 `CounterB` 之间是完全独立的。它们都使用了 `useCounter()` 这个自定义钩子，但它们各自拥有钩子相关联的状态实例。

> 这看起来是否有点奇怪？你并不孤单！
>
> 有许多人都花了一段时间才适应这种方法。

## 依赖参数

许多钩子都接受一个用于限制钩子更新时机的参数。Preact 会检查依赖数组中的每一个并查看自上次钩子调用之后该值是否发生了变化。如果没有指定依赖参数则钩子将始终会执行。

In our `useCounter()` implementation above, we passed an array of dependencies to `useCallback()`:

在上面 `useCounter()` 的实现中，我们向 `useCallback()` 传递了一个依赖数组：

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);  // <-- 依赖数组 
  return { value, increment };
}
```

这里传递 `value` 使得每当 `value` 改变时 `useCallback` 会返回一个新的函数。
这对于避免“旧闭包”是非常有必要的，因为回调函数将会永远引用它创建后第一次渲染时的 `value` 变量，导致 `increment` 只会把值设置为 `1`。

> 这使得每当 `value` 改变时创建一个新的 `increment` 回调函数。
> 出于性能考虑，通常使用[回调](#usestate)更新状态值要比使用依赖保留当前值更好。

## 有状态钩子

此处我们将了解如何将有状态的逻辑引入函数式组件。

在引入钩子之前，需要状态的地方都需要类组件。

### useState

这个钩子接受一个作为状态的初始值的参数。调用此钩子会返回包含两个变量的数组，第一个是当前状态，第二个是状态的设置器。

我们的设置器和传统状态的设置器很类似。它接受一个值或者参数是当前状态的函数。

当调用设置器且状态与原先不同时，就会从使用 useState 的组件开始重渲染。

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';

const Counter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  // 也可以传递一个回调给设置器
  const decrement = () => setCount((currentCount) => currentCount - 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

> 当初始状态比较重时，最好是传递函数给设置器而不是传递值。

### useReducer

`useReducer` 钩子与 [redux](https://redux.js.org/) 很相似。比起 [useState](#usestate)，当你有复杂的下一个状态取决于上一个的复杂逻辑时，它更易用。

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useReducer } from 'preact/hooks';

const initialState = 0;
const reducer = (state, action) => {
  switch (action) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return 0;
    default: throw new Error('Unexpected action');
  }
};

function Counter() {
  // 返回当前状态和一个用于触发 action 的 dispatch 函数
  const [count, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      {count}
      <button onClick={() => dispatch('increment')}>+1</button>
      <button onClick={() => dispatch('decrement')}>-1</button>
      <button onClick={() => dispatch('reset')}>reset</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

## 记忆化

在 UI 编程中，有时计算状态或结果成本很高。记忆化可以缓存并在输入相同时重用计算结果。

### useMemo

通过 `useMemo` 钩子可以记忆计算结果并且只在它的依赖改变时重新计算。

```jsx
const memoized = useMemo(
  () => expensive(a, b),
  // 只在依赖中的任何一项改变时重新运行这个高成本的函数
  [a, b]
);
```

> 不要在 `useMemo` 中运行任何有作用的代码，副作用应该放在 `useEffect` 中。

### useCallback

`useCallback` 钩子可用于确保依赖没有改变时返回的函数保持相同的引用。这可用于当子组件依赖引用相等性时（如 `shouldComponentUpdate`）优化子组件的更新。

```jsx
const onClick = useCallback(
  () => console.log(a, b),
  [a, b]
);
```

> 有趣的事实：`useCallback(fn, deps)` 与 `useMemo(() => fn, deps)` 等价。

## useRef

可以使用 `useRef` 钩子在函数式组件中获取 DOM 节点的引用。它与 [createRef](/guide/v10/refs#createref) 相似。

```jsx
// --repl
import { useRef } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function Foo() {
  // 使用 `null` 初始化 useRef
  const input = useRef(null);
  const onClick = () => input.current && input.current.focus();

  return (
    <>
      <input ref={input} />
      <button onClick={onClick}>Focus input</button>
    </>
  );
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

> 注意不要混淆 `useRef` 和 `createRef`。

## useContext

可以使用 `useContext` 钩子在函数式组件中访问上下文，这不需要任何高阶组件或封装。第一个参数必须是 `createContext` 创建的上下文对象。

```jsx
// --repl
import { render, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const OtherComponent = props => props.children;
// --repl-before
const Theme = createContext('light');

function DisplayTheme() {
  const theme = useContext(Theme);
  return <p>Active theme: {theme}</p>;
}

// ...然后
function App() {
  return (
    <Theme.Provider value="light">
      <OtherComponent>
        <DisplayTheme />
      </OtherComponent>
    </Theme.Provider>
  )
}
// --repl-after
render(<App />, document.getElementById("app"));
```

## 副作用 

副作用是许多现代应用的核心。不管你是想从 API 获取数据还是在文档中触发作用，你会发现 `useEffect` 几乎满足所有需求。这正是钩子 API 的主要优势，它重塑你的思维，让你从作用思考，而不是组件的生命周期。

### useEffect

顾名思义，`useEffect` 是触发各类副作用的主要方式。如果需要，你还可以返回一个用于清理作用的函数。

```jsx
useEffect(() => {
  // 触发作用
  return () => {
    // 可选项：清理用代码
  };
}, []);
```

让我们以一个反映文档标题的 `Title` 组件开始，我们可以在浏览器的地址栏上看到它。

```jsx
function PageTitle(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return <h1>{props.title}</h1>;
}
```

`useEffect` 的第一个参数是一个触发作用的无参回调。在这个示例中我们只想在 title 改变时触发它，当它保持不变的时候更新是没有意义的。这是使用第二个参数指定[依赖数组](#依赖参数)的原因。

但有时我们可能会遇到更复杂的场景。试想一个组件需要在挂载时订阅一些数据，并在卸载时取消订阅，这也可以使用 `useEffect` 做到。要执行清理代码，只需在回调中返回一个函数。

```jsx
// --repl
import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
// 组件会持续显示当前窗口宽度
function WindowWidth(props) {
  const [width, setWidth] = useState(0);

  function onResize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <p>Window width: {width}</p>;
}
// --repl-after
render(<WindowWidth />, document.getElementById("app"));
```

> 清理函数是可选的。如果你无需执行清理，就不需要在 `useEffect` 的回调中返回任何东西。

### useLayoutEffect

它的签名与 [useEffect](#useeffect) 等同，但会在组件执行 diff 算法和浏览器有机会绘制时触发。

### useErrorBoundary

当子组件抛出错误时，你可以使用此钩子捕获错误并显示自定义的错误 UI。

```jsx
// error = 捕获到的错误，当没有发生错误时是 `undefined`
// resetError = 调用这个函数以标记此错误已经解决。
//   至于这意味着什么以及是否可能从错误中恢复取决于你的应用。
const [error, resetError] = useErrorBoundary();
```

出于监控的目的，报告服务的所有错误很有用。我们可以给 `useErrorBoundary` 可选的第一个参数传递一个回调。

```jsx
const [error] = useErrorBoundary(error => callMyApi(error.message));
```

完整的使用示例大概是这样的：

```jsx
const App = props => {
  const [error, resetError] = useErrorBoundary(
    error => callMyApi(error.message)
  );
  
  // 显示精美的错误信息
  if (error) {
    return (
      <div>
        <p>{error.message}</p>
        <button onClick={resetError}>Try again</button>
      </div>
    );
  } else {
    return <div>{props.children}</div>
  }
};
```

> 如果你曾使用过类组件的 API，这个钩子本质上是 [componentDidCatch](/guide/v10/whats-new/#componentdidcatch) 生命周期方法的替代。
> 这个钩子在 Preact 10.2.0 中引入。

## 工具钩子

### useId

这个钩子会为每个调用生成唯一的 ID，并确保[在服务端](/guide/v10/server-side-rendering))和客户端的一致性。一致 ID 的常见用例是表单，`<label>` 元素使用 [`for`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#attr-for)) 属性与 `<input>` 元素关联，`useId` 钩子并不局限于表单，它可以在任何你需要唯一 ID 的时候使用。

> 要保证钩子一致，你需要同时在服务端和客户端使用 Preact。

完整的使用示例大概是这样的：

```jsx
const App = props => {
  const mainId = useId();
  const inputId = useId();

  useLayoutEffect(() => {
    document.getElementById(inputId).focus()
  }, [])
  
  // 显示精美的错误信息。
  return (
    <main id={mainId}>
      <input id={inputId}>
    </main>
  )
};
```

> 这个钩子在 Preact 10.11.0 中引入，且需要 preact-render-to-string 5.2.4。
