---
title: API 参考
description: 了解 Preact 模块导出的所有函数
---

# API 参考

此页为您提供所有导出函数的速查表。

---

<toc></toc>

---

## Component

`Component` 是用于创建有状态 Preact 组件的基类。

渲染器会自动管理并按需创建组件，不会直接实例化。

```js
import { Component } from 'preact';

class MyComponent extends Component {
	// (见下)
}
```

### Component.render(props, state)

所有组件必须提供 `render()` 函数，其参数为组件的当前属性 (props) 与状态 (state)，返回值则是虚拟 DOM 元素 (JSX 元素)、Array，或 `null`。

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props 等同于 this.props
		// state 等同于 this.state

		return <h1>Hello, {props.name}!</h1>;
	}
}
```

请参阅[组件文档](/guide/v10/components)来了解其概念及使用方法。

## render()

`render(virtualDom, containerNode)`

将虚拟 DOM 元素渲染为父 DOM 元素的 `containerNode`，无返回值。

```jsx
// --repl
// 渲染前的 DOM 树：
// <div id="container"></div>

import { render } from 'preact';

const Foo = () => <div>foo</div>;

render(<Foo />, document.getElementById('container'));

// 渲染后：
// <div id="container">
//  <div>foo</div>
// </div>
```

首个参数必须为有效的虚拟 DOM 元素，可为组件或是普通元素。当您传入组件时，您需要让 Preact 实例化它，而不是直接调用组件。否则，这会出现问题：

```jsx
const App = () => <div>foo</div>;

// 不要：直接调用组件会破坏钩子和更新顺序：
render(App(), rootElement); // 错误
render(App, rootElement); // 错误

// 要：使用 h() 或 JSX 向 Preact 传入组件才能正确渲染：
render(h(App), rootElement); // 成功
render(<App />, rootElement); // 成功
```

## hydrate()

若您已经通过预渲染或服务端渲染的方式将应用转换为 HTML，Preact 可以在浏览器加载时跳过大部分渲染流程。您可以通过将 `render()` 替换为 `hydrate()` 的方式跳过大部分差异对比流程，而事件监听器和组件树仍能正常使用。此函数仅能与预渲染或[服务端渲染](/guide/v10/server-side-rendering)搭配使用。

```jsx
// --repl
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

## h() / createElement()

`h(type, props, ...children)`

返回属性为 `props` 的虚拟 DOM 元素。虚拟 DOM 属性是您应用 UI 树中的轻量级节点描述，是形似 `{ type, props }` 的对象。

在 `type` 和 `props` 参数之后，其他所有参数均会转化为 `children` 子元素属性。
子元素可以为：

- 标量值 (string、number、boolean、null、undefined 等等)
- 嵌套的虚拟 DOM 元素
- 无限嵌套的上述类型 Array

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Hello!');
// <div id="foo">Hello!</div>

h('div', { id: 'foo' }, 'Hello', null, ['Preact!']);
// <div id="foo">Hello Preact!</div>

h('div', { id: 'foo' }, h('span', null, 'Hello!'));
// <div id="foo"><span>Hello!</span></div>
```

## toChildArray

此辅助函数将 `props.children` 值转化为一维 Array 数组。若 `props.children` 已是数组，此函数将返回其复制值。此函数适合在 `props.children` 里同时存在 JSX 静态和动态表达式时使用。

对于只有一个子元素的虚拟 DOM 元素而言，`props.children` 是其子元素的引用。当有多个子元素存在时，`props.children` 是一个 Array。`toChildArray` 辅助函数能帮您处理所有情况，返回统一的值。

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
	const count = toChildArray(props.children).length;
	return <div>I have {count} children</div>;
}

// props.children 是 "bar"
render(<Foo>bar</Foo>, container);

// props.children 是 [<p>A</p>, <p>B</p>]
render(
	<Foo>
		<p>A</p>
		<p>B</p>
	</Foo>,
	container
);
```

## cloneElement

`cloneElement(virtualElement, props, ...children)`

此函数用于创建虚拟 DOM 元素的浅拷贝，通常在添加或覆盖组件 `props` 属性时使用：

```jsx
function Linkout(props) {
	// 为链接添加 target="_blank"：
	return cloneElement(props.children, { target: '_blank' });
}
render(
	<Linkout>
		<a href="/">home</a>
	</Linkout>
);
// <a href="/" target="_blank">home</a>
```

## createContext

参见[上下文文档一节](/guide/v10/context#createcontext)。

## createRef

提供渲染后引用元素或组件的方式。

参见[引用文档](/guide/v10/refs#createref)以了解详情。

## Fragment

一种可包含子元素的特殊组件，但不渲染为 DOM 元素。片段无需您将多个子元素包裹在 DOM 容器中就能返回多个元素：

```jsx
// --repl
import { Fragment, render } from 'preact';

render(
	<Fragment>
		<div>A</div>
		<div>B</div>
		<div>C</div>
	</Fragment>,
	document.getElementById('container')
);
// 渲染结果：
// <div id="container>
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```
