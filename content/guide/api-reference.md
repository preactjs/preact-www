---
name: API Reference
permalink: '/guide/api-reference'
---

# API Reference

## `Component`

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

```js
class Link extends Component {
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
	render(props, state) {
		props === this.props
		state === this.state
	}
}
```

## `render()`

```js
render(
	component,
	containerNode,
	[replaceNode]
)
```

Render a Preact component into the `containerNode` DOM node. Returns a reference to the rendered DOM node.

If the optional `replaceNode` DOM node is provided, Preact will replace `replaceNode` with the rendered component. Otherwise, Preact will append the rendered component to `containerNode`.

## `h()`

```js
h(
	nodeName,
	attributes,
	[children]
)
```

Returns a Preact component with the given `attributes`.

The optional `children` value can be any of the following:

- A string
- A Preact component
- An array of strings or Preact components

```js
h('div', { id: 'foo' }, 'Hello!')
// <div id="foo">Hello!</div>

h('div', { id: 'foo' }, ['Hello', 'Preact!'])
// <div id="foo">Hello Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', {}, 'Hello!')
)
// <div id="foo"><span>Hello!</span></div>
```
