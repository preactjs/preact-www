---
name: API Reference
permalink: '/guide/api-reference'
---

# API 参考

## `Preact.Component`
`Component` 是一个父类，您通常会使用子类继承的方式去创建有状态的 Preact 组件。

### `Component.render(props, state)`

`render()` 方法是所有组件必需的一个方法。它可以接受组件的 porps 和 state作为参数，并且这个方法应该返回一个Preact元素或者返回null。

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props === this.props
		// state === this.state

		return <h1>Hello, {props.name}!</h1>;
	}
}
```
### 生命周期方法

> _** 提示:** 如果你已经用过 HTML5 的自定义标签，你会发现下面的方法跟 `attachedCallback` 和 `detachedCallback` 这些生命周期方法相似._

如果你在 Component 中定义了下面的方法，Preact 将会在生命周期中触发它。

| 生命周期方法                  | 触发时机                                 |
|-----------------------------|-----------------------------------------|
| `componentWillMount`        | 在 component 插入 DOM 前调用              |
| `componentDidMount`         | 在 component 插入 DOM 后调用              |
| `componentWillUnmount`      | 在 component 移除前调用                   |
| `componentWillReceiveProps` | 在 component 获取新的 props 前调用         |
| `shouldComponentUpdate`     | 在 `render()` 返回 `false` 来跳过渲染前调用 |
| `componentWillUpdate`       | 在 `render()`  调用之前                   |
| `componentDidUpdate`        | 在 `render()` 调用之后                    |

下面这个组件例子展示了所有的生命周期方法以及它们对应的参数：

```js
import { Component } from 'preact';

class MyComponent extends Component {
	shouldComponentUpdate(nextProps, nextState) {}
	componentWillReceiveProps(nextProps, nextState) {
		this.props // Previous props
		this.state // Previous state
	}
	componentWillMount() {}
	componentDidMount() {}
	componentDidUpdate() {}
	componentWillUnmount() {
		this.props // Current props
		this.state // Current state
	}
}
```

## `Preact.render()`

`render(component, containerNode, [replaceNode])`

将一个Preact组件渲染到 `containerNode` 这个DOM节点上。 返回一个对渲染的DOM节点的引用。

如果提供了可选的DOM节点参数 `replaceNode` 并且是 `containerNode` 的子节点，Preact将使用它的diffing算法来更新或者替换该元素节点。否则，Preact将把渲染的元素添加到 `containerNode` 上。

```js
import { render } from 'preact';

// 下面这些例子展示了如何在具有以下HTML标记的页面中执行render()
// <div id="container">
//   <h1>My App</h1>
// </div>

const container = document.getElementById('container');

render(MyComponent, container);
// 将 MyComponent 添加到 container 中
//
// <div id="container">
//   <h1>My App</h1>
//   <MyComponent />
// </div>

const existingNode = container.querySelector('h1');

render(MyComponent, container, existingNode);
// 对比 MyComponent 和 <h1>My App</h1> 的不同
//
// <div id="container">
//   <MyComponent />
// </div>
```

## `Preact.h()` / `Preact.createElement()`

`h(nodeName, attributes, [...children])`

返回具有给定 `attributes` 属性的Preact虚拟DOM元素。

所有的剩余参数都会被放置在一个 `children` 数组中， 并且是以下所列的任意一种：

- 纯粹的值（字符串、数字、布尔值、null、undefined等）
- 虚拟DOM元素
- 上面两种的嵌套数组

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Hello!');
// <div id="foo">Hello!</div>

h('div', { id: 'foo' }, 'Hello', null, ['Preact!']);
// <div id="foo">Hello Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Hello!')
);
// <div id="foo"><span>Hello!</span></div>
```
