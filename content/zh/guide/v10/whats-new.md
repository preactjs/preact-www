---
title: Preact X 中的新鲜功能
description: 'Preact X 中的新功能与更改'
---

# Preact X 中的新鲜功能

Preact X 是 Preact 8.x 的一大跃进，我们重新构思了每一行代码，添加了一系列新功能。当然，我们也为支持更多第三方库提供了更多兼容支持。

总而言之，Preact X 还是那款微小、快速、五脏俱全的库。说到大小，Preact X 提供了新功能并优化了渲染，但大小却和 `8.x` 版本一样！

---

<toc></toc>

---

## 片段 (Fragment)

`Fragments` 是 Preact X 的一大更新，也是我们重构 Preact 架构的主要动机之一。这是一种用于在父元素行内渲染子元素的特殊组件，免去了再次包装 DOM 元素的麻烦。除此之外，您还可以使用片段来返回 `render` 的多个节点。

[片段文档 →](/guide/v10/components#片段-fragment)

```jsx
// --repl
function Foo() {
  return (
    <>
      <div>A</div>
      <div>B</div>
    </>
  )
}
```

## componentDidCatch

我们总希望应用不会报错，但事与愿违。有了 `componentDidCatch`，您现在可以捕获并处理生命周期方法 (如 `render`) 中出现的错误，甚至包括来自组件树最下方的错误。您可以用它在出错时显示错误信息，或是将错误日志发送到外部服务。

[生命周期文档 →](/guide/v10/components#componentdidcatch)

```jsx
// --repl
class Catcher extends Component {
  state = { errored: false }

  componentDidCatch(error) {
    this.setState({ errored: true });
  }

  render(props, state) {
    if (state.errored) {
      return <p>Something went badly wrong</p>;
    }
    return props.children;
  }
}
```

## 钩子

钩子是共享多个组件状态的全新方式，也是类组件 API 的替代方案。在 Preact 中，您可以通过导入 `preact/hooks` 附加组件来使用。

[钩子文档 →](/guide/v10/hooks)

```jsx
// --repl
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);

  return (
    <div>
      计数：{value}
      <button onClick={increment}>增加</button>
    </div>
  );
}
```

## createContext

`createContext` API 是 `getChildContext()` 的新版实现。虽然您在值不会更改的情况下完全可以使用后者，但是在生产者与消费者组件之间要是有组件在 `shouldComponentUpdate` 中返回 `false`，那就另当别论了。此 API 是真正为解决语法树更新传递问题而实现的发布/订阅范式的解决方案。

[createContext 文档 →](/guide/v10/context#createcontext)

```jsx
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => <div>当前主题：{theme}</div>}
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
```

## CSS 自定义属性

现在您可以使用 CSS 最新的[变量功能](https://developer.mozilla.org/zh-CN/docs/Web/CSS/--*)为网页添加样式。

```jsx
function Foo(props) {
  return <div style={{ '--theme-color': 'blue' }}>{props.children}</div>;
}
```

## 兼容层加入核心

虽然我们总是为 Preact 不断添加新功能，但我们对 `preact-compat` 包却鲜有关注——直到现在。之前，该软件包的源码一直都位于一个独立仓库中，难以配合 Preact 和兼容层的大型改动。现在，我们将此软件包加入 Preact 包内，这样您无需安装任何东西就能使用 React 的库。

此兼容层现已更名为 [preact/compat](/guide/v10/differences-to-react#features-exclusive-to-preactcompat)，添加了如 `forwardRef` 和 `memo` 在内的新功能与许多兼容性优化。

```js
// Preact 8.x
import React from "preact-compat";

// Preact X
import React from "preact/compat";
```

## 许多兼容性修复

我们的补丁数量众多。总之，Preact 对 React 生态的兼容性得到了显著提升。我们还在测试流程中引入了一些热门的包进行测试，确保 Preact 完整兼容。

如果您在 Preact 8 中遇到了不兼容的 React 包，您可以更新到 Preact X 再安装试试，它十有八九都能正常工作 ;)
