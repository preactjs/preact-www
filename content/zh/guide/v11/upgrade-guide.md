---
title: 从 Preact 10.x 升级
description: 将现有的 Preact 10.x 应用升级到 Preact 11 的指南
---

# 从 Preact 10.x 升级

Preact 11 的目标是在尽量减少破坏性的前提下从 Preact 10.x 升级，因此我们可以提高所支持的浏览器版本并清除一些遗留代码。对大多数用户而言，此次升级应当简单快速，只有少数更改可能需要关注。

本文档旨在引导你将现有的 Preact 10.x 应用迁移到 Preact 11，涵盖可能存在的破坏性更改以及确保平滑迁移的步骤。

---

<toc></toc>

---

## 为应用做准备

### 支持的浏览器版本

Preact 11.x 默认在以下浏览器上工作，无需额外的 polyfill：

- Chrome >= 40
- Safari >= 9
- Firefox >= 36
- Edge >= 12

如果你需要支持更老的浏览器，则需要自行引入 polyfill。

### 支持的 TypeScript 版本

11.x 版本线将把 TypeScript 的最低支持版本提高到 v5.1。如果你现在使用的是较旧的 TypeScript，请在升级到 Preact 11 之前先升级 TypeScript。

提高最低 TypeScript 版本可以利用 TS 团队在 JSX 类型方面的重要改进，从而修复一些长期存在且较难在库内部解决的类型问题。

### ESM 打包产物使用 `.mjs` 后缀

Preact 11.x 会将所有 ESM 包以 `.mjs` 扩展名分发，移除 10.x 中的 `.module.js` 副本。这有助于修正部分工具链遇到的问题，并简化分发包。

CJS 与 UMD 包将继续提供，且保持不变。

## 新特性

### Hydration 2.0

Preact 11 在 hydration（服务器端渲染后的客户端恢复）方面带来显著改进，特别是在处理挂起（suspending）组件时。相比 Preact X 需要在每个异步边界总是返回恰好 1 个 DOM 节点的限制，Preact 11 允许返回 0 个或 2 个及以上 DOM 节点，从而支持更灵活的组件设计。

下面的示例在 Preact 11 中现在是合法的：

```jsx
function X() {
  // 一些懒加载操作，例如初始化分析工具
  return null;
}

const LazyOperation = lazy(() => /* import X */);
```

```jsx
function Y() {
  // 渲染后 `<Fragment>` 会被移除，留下两个 `<p>` DOM 元素
  return (
    <Fragment>
      <p>Foo</p>
      <p>Bar</p>
    </Fragment>
  );
}

const SuspendingMultipleChildren = lazy(() => /* import Y */);
```

关于已知问题的更详细说明以及我们的解决方案，请参阅 [RFC: Hydration 2.0 (preactjs/preact#4442)](https://github.com/preactjs/preact/issues/4442)。

### 钩子参数使用 `Object.is` 进行相等性判断

Preact 11 在钩子（hooks）参数的相等性判断中使用 `Object.is`，更接近 React 的行为。这意味着现在可以将 `NaN` 用作状态值或 `useEffect`/`useMemo`/`useCallback` 的依赖项。

在 Preact 10 中，下面的例子在每次点击按钮时都会触发重新渲染，而在 Preact 11 中则不会：

```jsx
import { useState, useEffect } from 'preact/hooks';

function App() {
	const [count, setCount] = useState(0);

	return <button onClick={() => setCount(NaN)}>Set count to NaN</button>;
}
```

## API 变更

### Ref 默认会被转发

现在 Ref 默认会被转发，可以像普通 prop 一样使用它们。你不再需要通过 `preact/compat` 的 `forwardRef` 来实现这一功能。

```jsx
function MyComponent({ ref }) {
	return <h1 ref={ref}>Hello, world!</h1>;
}

<MyComponent ref={myRef} />;
// Preact 10: myRef.current 是 MyComponent 的实例
// Preact 11: myRef.current 是 <h1> DOM 元素
```

> 注意：当使用 `preact/compat` 时，refs 不会被转发到类组件。React 只将 refs 转发给函数组件，因此我们在 compat 层保持一致。
>
> 对于纯 Preact 的使用者，refs 会被转发到类组件，与函数组件行为一致。

如果你需要继续使用旧行为，可以使用以下代码片段将行为恢复为 Preact 10：

```js
import { options } from 'preact';

const oldVNode = options.vnode;
options.vnode = vnode => {
	if (vnode.props && vnode.props.ref) {
		vnode.ref = vnode.props.ref;
		delete vnode.props.ref;
	}

	if (oldVNode) oldVNode(vnode);
};
```

### 将数值样式自动添加 `px` 的行为移到 `preact/compat`

Preact 11 已将对数值类型样式属性自动添加 `px` 的逻辑从核心库移动到 `preact/compat`。

```jsx
<h1 style={{ height: 500 }}>Hello World!</h1>
// Preact 10: <h1 style="height:500px">Hello World!</h1>
// Preact 11: <h1 style="height:500">Hello World!</h1>
```

### 将 `defaultProps` 支持移动到 `preact/compat`

由于函数组件与 Hook 的普及，`defaultProps` 使用频率下降，因此该支持已移入 `preact/compat`。

### 从 `render()` 中移除 `replaceNode` 参数

`render()` 的第三个（可选）参数在 Preact 11 中被移除，因为该实现存在许多 bug 和边缘情况，且无法很好地满足某些关键用例。

如果你仍然需要此功能，我们提供了一个与 Preact 10 兼容的独立实现：[`preact-root-fragment`](https://github.com/preactjs/preact-root-fragment)。

```html
<div id="root">
	<section id="widgetA"><h1>Widget A</h1></section>
	<section id="widgetB"><h1>Widget B</h1></section>
	<section id="widgetC"><h1>Widget C</h1></section>
</div>
```

```jsx
// Preact 10
import { render } from 'preact';

render(<App />, root, widgetC);

// Preact 11
import { render } from 'preact';
import { createRootFragment } from 'preact-root-fragment';

render(<App />, createRootFragment(root, widgetC));
```

### 移除 `Component.base` 属性

我们将移除 `Component.base`，因为暴露组件所连接的 DOM 总显得有些泄露实现细节。

如果你仍然需要访问该 DOM，可以使用 `this.__v.__e`；其中 `.__v` 是组件关联的 VNode（经过混淆的属性名），`.__e` 则是该 VNode 关联的 DOM 节点。

### 从 `preact/compat` 移除 `SuspenseList`

该功能的实现和服务端支持一直不够清晰和完整，因而我们决定移除它。

### 类型相关变更

#### `useRef` 现在需要初始值

与 React 19 中的更改类似，我们将 `useRef` 的类型签名改为需要提供初始值。提供初始值有助于类型推断并避免一些类型上的问题。

#### `JSX` 命名空间收缩

TypeScript 使用特殊的 `JSX` 命名空间来改变 JSX 的类型和解释方式。在 10 版本中，我们大幅扩展了该命名空间以包含多种有用类型，但其中许多更适合放到 `preact` 命名空间。

从 Preact 11 开始，`JSX` 命名空间将只包含 TypeScript 所需的基本类型（例如 `Element`、`IntrinsicElements` 等），其余类型将迁移到 `preact` 命名空间。这也有助于编辑器和 IDE 在自动导入提示时更好地解析类型。

```ts
// Preact 10
import { JSX } from 'preact';

type MyCustomButtonProps = JSX.ButtonHTMLAttributes & {
	/* ... */
};

// Preact 11
import { ButtonHTMLAttributes } from 'preact';

type MyCustomButtonProps = ButtonHTMLAttributes & {
	/* ... */
};
```
