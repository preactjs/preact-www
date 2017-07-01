---
name: API Reference
permalink: '/guide/api-reference'
---

# API Reference

## `Preact.Component`

`Component` is a base class that you will usually subclass to create stateful Preact components.

### `Component.render(props, state)`

The `render()` function is required for all components. It can inspect the props and state of the component, and should return a Preact element or `null`.

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

### Lifecycle methods

> _**Tip:** If you've used HTML5 Custom Elements, this is similar to the `attachedCallback` and `detachedCallback` lifecycle methods._

Preact invokes the following lifecycle methods if they are defined for a Component:

| Lifecycle method            | When it gets called                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | before the component gets mounted to the DOM     |
| `componentDidMount`         | after the component gets mounted to the DOM      |
| `componentWillUnmount`      | prior to removal from the DOM                    |
| `componentWillReceiveProps` | before new props get accepted                    |
| `shouldComponentUpdate`     | before `render()`. Return `false` to skip render |
| `componentWillUpdate`       | before `render()`                                |
| `componentDidUpdate`        | after `render()`                                 |

All of the lifecycle methods and their parameters are shown in the following example component:

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

Render a Preact component into the `containerNode` DOM node. Returns a reference to the rendered DOM node.

If the optional `replaceNode` DOM node is provided and is a child of `containerNode`, Preact will update or replace that element using its diffing algorithm. Otherwise, Preact will append the rendered element to `containerNode`.

```js
import { render } from 'preact';

// These examples show how render() behaves in a page with the following markup:
// <div id="container">
//   <h1>My App</h1>
// </div>

const container = document.getElementById('container');

render(MyComponent, container);
// Append MyComponent to container
//
// <div id="container">
//   <h1>My App</h1>
//   <MyComponent />
// </div>

const existingNode = container.querySelector('h1');

render(MyComponent, container, existingNode);
// Diff MyComponent against <h1>My App</h1>
//
// <div id="container">
//   <MyComponent />
// </div>
```

## `Preact.h()` / `Preact.createElement()`

`h(nodeName, attributes, [...children])`

Returns a Preact Virtual DOM element with the given `attributes`.

All remaining arguments are collected into a `children` Array, and be any of the following:

- Scalar values (string, number, boolean, null, undefined, etc)
- More Virtual DOM elements
- Infinitely nested Arrays of the above

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
