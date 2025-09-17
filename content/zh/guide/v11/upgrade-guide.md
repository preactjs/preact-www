---
title: 从Preact 8.x升级
description: Upgrade your Preact 8.x application to Preact X
---

# 从 Preact 8.x 升级

本文档旨在指导您将现有的 Preact 8.x 应用程序升级到 Preact X，分为 3 个主要部分。

Preact X 带来了许多令人兴奋的新特性，如 `Fragments`、`hooks` 以及与 React 生态系统更好的兼容性。我们尽量将任何破坏性变更控制在最小范围内，但无法在不影响我们的功能集的情况下完全消除所有更改.

---

<toc></toc>

---

## 升级依赖

_注意：在本指南中，我们将使用 `npm` 客户端，这些命令应该很容易适用于其他包管理器，如 `yarn`。_

让我们开始吧！首先安装 Preact X：

```bash
npm install preact
```

由于 compat 已移至 core lib，不再需要 `preact-compat` 了。使用以下命令移除它：

```bash
npm remove preact-compat
```

### 更新 preact 相关库

为了保证用户（尤其是企业用户）生态系统的稳定性，我们为与 Preact X 相关的库发布了主要版本更新。如果您使用了 `preact-render-to-string`，需要更新到适用于 X 的版本。

| 库                        | Preact 8.x | Preact X |
| ------------------------- | ---------- | -------- |
| `preact-render-to-string` | 4.x        | 5.x      |
| `preact-router`           | 2.x        | 3.x      |
| `preact-jsx-chai`         | 2.x        | 3.x      |
| `preact-markup`           | 1.x        | 2.x      |

### compat 已移至核心库

为了使第三方 React 库能与 Preact 一起工作，我们提供了一个可通过 `preact/compat` 导入的**兼容性**层。它以前是一个单独的包，但为了使协调更容易，我们已将其移至核心库。因此，您需要将现有的导入或别名声明从 `preact-compat` 更改为 `preact/compat`（注意斜杠）。

请注意不要引入任何拼写错误。一个常见的错误似乎是写成 `compact` 而不是 `compat`。如果您遇到问题，可以将 `compat` 理解为 React 的 `compatibility`（兼容性）层。这就是名称的由来。

### 第三方库

由于破坏性变更的性质，一些现有库可能无法与 X 一起工作。大多数库已经根据我们的测试版计划进行了更新，但您可能会遇到尚未更新的情况。

#### preact-redux

`preact-redux` 是尚未更新的此类库之一。好消息是 `preact/compat` 更符合 React 规范，可以与名为 `react-redux` 的 React 绑定开箱即用。切换到它将解决这个问题。确保您在打包工具中已将 `react` 和 `react-dom` 别名为 `preact/compat`。

1. 移除 `preact-redux`
2. 安装 `react-redux`

#### mobx-preact

由于我们对 React 生态系统的兼容性增强，不再需要这个包。请使用 `mobx-react` 代替。

1. 移除 `mobx-preact`
2. 安装 `mobx-react`

#### styled-components

Preact 8.x 只能与 `styled-components@3.x` 一起使用。使用 Preact X 后，这个障碍不再存在，我们可以与最新版本的 `styled-components` 一起工作。确保您已正确地[将 react 别名为 preact](/guide/v10/getting-started#将-react-别名为-preact)。

#### preact-portal

`Portal` 组件现在是 `preact/compat` 的一部分。

1. 移除 `preact-portal`
2. 从 `preact/compat` 导入 `createPortal`

## 准备代码

### 使用命名导出

为了更好地支持 tree-shaking，我们不再在 preact 核心中提供 `default` 导出。这种方法的优点是只有您需要的代码才会被包含在您的包中。

```js
// Preact 8.x
import Preact from 'preact';

// Preact X
import * as preact from 'preact';

// 推荐：命名导出（适用于 8.x 和 Preact X）
import { h, Component } from 'preact';
```

_注意：此更改不影响 `preact/compat`。它仍然同时具有命名导出和默认导出，以保持与 react 的兼容性。_

### `render()` 总是比较现有子元素

在 Preact 8.x 中，对 `render()` 的调用总是将元素附加到容器中。

```jsx
// 现有标记：
<body>
	<div>hello</div>
</body>;

render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Preact 8.x 输出：
<body>
	<div>hello</div>
	<p>foo</p>
	<p>bar</p>
</body>;
```

在 Preact 8 中，要比较现有子元素，必须提供一个现有的 DOM 节点。

```jsx
// 现有标记：
<body>
	<div>hello</div>
</body>;

let element;
element = render(<p>foo</p>, document.body);
element = render(<p>bar</p>, document.body, element);

// Preact 8.x 输出：
<body>
	<div>hello</div>
	<p>bar</p>
</body>;
```

在 Preact X 中，`render()` 总是比较容器内的 DOM 子元素。因此，如果您的容器包含不是由 Preact 渲染的 DOM，Preact 将尝试将其与您传递的元素进行比较。这种新行为更接近其他 VDOM 库的行为。

```jsx
// 现有标记：
<body>
	<div>hello</div>
</body>;

render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Preact X 输出：
<body>
	<p>bar</p>
	<div>hello</div>
</body>;
```

如果您需要与 React 的 `render` 方法完全匹配的行为，请使用 `preact/compat` 导出的 `render` 方法。

### `props.children` 不总是 `array` 类型

在 Preact X 中，我们不能保证 `props.children` 总是 `array` 类型。这一变更是为了解决关于 `Fragments` 和返回子元素 `array` 的组件的解析歧义。在大多数情况下，您可能甚至不会注意到它。只有在直接对 `props.children` 使用数组方法的地方需要用 `toChildArray` 包装。这个函数将始终返回一个数组。

```jsx
// Preact 8.x
function Foo(props) {
	// `.length` 是一个数组方法。在 Preact X 中，当 `props.children` 不是
	// 数组时，这行代码将抛出异常
	const count = props.children.length;
	return <div>我有 {count} 个子元素 </div>;
}

// Preact X
import { toChildArray } from 'preact';

function Foo(props) {
	const count = toChildArray(props.children).length;
	return <div>我有 {count} 个子元素 </div>;
}
```

### 不要同步访问 `this.state`

在 Preact X 中，组件的状态不会再同步变更。这意味着在 `setState` 调用后立即读取 `this.state` 将返回之前的值。相反，您应该使用回调函数来修改依赖于先前值的状态。

```jsx
this.state = { counter: 0 };

// Preact 8.x
this.setState({ counter: this.state.counter + 1 });

// Preact X
this.setState(prevState => {
	// 或者在此处返回 `null` 来中止状态更新
	return { counter: prevState.counter + 1 };
});
```

### `dangerouslySetInnerHTML` 将跳过子元素比较

当一个 `vnode` 设置了 `dangerouslySetInnerHTML` 属性时，Preact 将跳过比较 `vnode` 的子元素。

```jsx
<div dangerouslySetInnerHTML="foo">
	<span>我将被跳过</span>
	<p>我也会被跳过</p>
</div>
```

## 库作者注意事项

本节适用于正在维护与 Preact X 一起使用的包的库作者。如果您不是在编写这样的库，可以安全地跳过本节。

### `VNode` 形状已更改

我们重命名/移动了以下属性：

- `attributes` -> `props`
- `nodeName` -> `type`
- `children` -> `props.children`

尽管我们尽力了，但我们总是遇到为 React 编写的第三方库的边缘情况。这种对我们的 `vnode` 形状的更改消除了许多难以发现的错误，并使我们的 `compat` 代码更加整洁。

### 相邻文本节点不再合并

在 Preact 8.x 中，我们有一个将相邻文本节点合并作为优化的功能。这在 X 中不再适用，因为我们不再直接与 dom 进行比较。事实上，我们注意到它在 X 中反而损害了性能，这就是为什么我们移除了它。看下面的例子：

```jsx
// Preact 8.x
console.log(<div>foo{'bar'}</div>);
// 记录一个如下的结构：
//   div
//     text

// Preact X
console.log(<div>foo{'bar'}</div>);
// 记录一个如下的结构：
//   div
//     text
//     text
```
