---
name: API Reference
description: 'Learn more about all exported functions of the Preact module'
---

# API Reference

This page serves as a quick overview over all exported functions.

---

<toc></toc>

---

## Preact.Component

`Component` is a base class that you will usually subclass to create stateful Preact components.

### Component.render(props, state)

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

To learn more about components and how they can be used, head over to the [Components](/guide/v10/components) page.

## render()

`render(component, containerNode, [replaceNode])`

Render a Preact component into the `containerNode` DOM node. Does not return anything.

If the optional `replaceNode` DOM node is provided and is a child of `containerNode`, Preact will update or replace that element using its diffing algorithm.

```jsx
import { render } from 'preact';

const Foo = () => <div>foo</div>;

// DOM before render:
// <div id="container"></div>
render(<Foo />, document.getElementById('container'));
// After render:
// <div id="container">
//  <div>foo</div>
// </div>

// DOM before render:
// <div id="container">
//   <div>bar</div>
//   <div id="target"></div>
// </div>
render(
  <Foo />,
  document.getElementById('container'),
  document.getElementById('target')
);
// After render:
// <div id="container">
//   <div>bar</div>
//   <div id="target">
//     <div>foo</div>
//   </div>
// </div>
```

The first argument must be a valid virtual-dom node that represents either a component or an HTML-Element.

```jsx
const App = () => <div>foo</div>;

// WRONG: First parameter must be passed through h() or
// createElement() either directly or indirectly via JSX
render(App(), rootElement);

// WRONG: For the same reasons as above
render(App, rootElement);

// CORRECT: Passing App through h()
render(h(App), rootElement);

// CORRECT: Passing App indirectly through h() via JSX
render(<App />, rootElement)
```

## hydrate()

When you have a prerendered DOM, there is no need to re-render it again. With hydrate most of the diffing phase will be skipped with event listeners being the exception. It's mainly used in conjuncton with [Server-Side Rendering](/guide/v10/server-side-rendering).

```jsx
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

## h() / createElement()

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

## toChildArray

This helper function will always convert children to an array. If it's already an array it will be a noop essentially. This function is needed because children are not guaranteed to be an array.

If an element only has a single child it will receive it directly. Only when there are more than one children you can be sure that you'll receive an array. With `toChildArray` you can ensure that this is always the case.

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>I have {count} children</div>;
}

// children is not an array
render(<Foo>bar</Foo>, container);

// Children is an array
render((
  <Foo>
    <p>A</p>
    <p>B</p>
  </Foo>,
  container
);
```

## cloneElement

This function allows you to shallow clone a component and to render the clone somewhere else.

## createContext

See the section in the [Context documentation](/guide/v10/context#createcontext).

## createRef

See the section in the [References documentation](/guide/v10/refs#createref).

## Fragment

A special kind of component that doesn't render anything into the DOM. They allow a component to return multiple sibling children without needing to wrap them in a container div.

```jsx
import { Fragment, render } from 'preact';

render((
  <Fragment>
    <div>A</div>
    <div>B</div>
    <div>C</div>
  </Fragment>
), container);
// Renders:
// <div id="container>
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```
