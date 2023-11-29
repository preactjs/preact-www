---
name: API Reference
description: 'Learn more about all exported functions of the Preact module'
---

# API Reference

This page serves as a quick overview over all exported functions.

---

<div><toc></toc></div>

---

## Component

`Component` is a base class that can be extended to create stateful Preact components.

Rather than being instantiated directly, Components are managed by the renderer and created as-needed.

```js
import { Component } from 'preact';

class MyComponent extends Component {
  // (see below)
}
```

### Component.render(props, state)

All components must provide a  `render()` function. The render function is passed the component's current props and state, and should return a Virtual DOM Element (typically a JSX "element"), an Array, or `null`.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props is the same as this.props
		// state is the same as this.state

		return <h1>Hello, {props.name}!</h1>;
	}
}
```

To learn more about components and how they can be used, check out the [Components Documentation](/guide/v10/components).

## render()

`render(virtualDom, containerNode, [replaceNode])`

Render a Virtual DOM Element into a parent DOM element `containerNode`. Does not return anything.

```jsx
// --repl
// DOM tree before render:
// <div id="container"></div>

import { render } from 'preact';

const Foo = () => <div>foo</div>;

render(<Foo />, document.getElementById('container'));

// After render:
// <div id="container">
//  <div>foo</div>
// </div>
```

If the optional `replaceNode` parameter is provided, it must be a child of `containerNode`. Instead of inferring where to start rendering, Preact will update or replace the passed element using its diffing algorithm.

> ⚠️ The `replaceNode`-argument will be removed with Preact `v11`. It introduces too many edge cases and bugs which need to be accounted for in the rest of Preact's source code. We're leaving this section up for historical reasons, but we don't recommend anyone to use the third `replaceNode` argument.

```jsx
// DOM tree before render:
// <div id="container">
//   <div>bar</div>
//   <div id="target">foo</div>
// </div>

import { render } from 'preact';

const Foo = () => <div id="target">BAR</div>;

render(
  <Foo />,
  document.getElementById('container'),
  document.getElementById('target')
);

// After render:
// <div id="container">
//   <div>bar</div>
//   <div id="target">BAR</div>
// </div>
```

The first argument must be a valid Virtual DOM Element, which represents either a component or an element. When passing a Component, it's important to let Preact do the instantiation rather than invoking your component directly, which will break in unexpected ways:

```jsx
const App = () => <div>foo</div>;

// DON'T: Invoking components directly breaks hooks and update ordering:
render(App(), rootElement); // ERROR
render(App, rootElement); // ERROR

// DO: Passing components using h() or JSX allows Preact to render correctly:
render(h(App), rootElement); // success
render(<App />, rootElement); // success
```

## hydrate()

If you've already pre-rendered or server-side-rendered your application to HTML, Preact can bypass most rendering work when loading in the browser. This can be enabled by switching from `render()` to `hydrate()`, which skips most diffing while still attaching event listeners and setting up your component tree. This works only when used in conjunction with [pre-rendering](/guide/v10/cli/pre-rendering) or [Server-Side Rendering](/guide/v10/server-side-rendering).

```jsx
// --repl
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

## h() / createElement()

`h(type, props, ...children)`

Returns a Virtual DOM Element with the given `props`. Virtual DOM Elements are lightweight descriptions of a node in your application's UI hierarchy, essentially an object of the form `{ type, props }`.

After `type` and `props`, any remaining parameters are collected into a `children` property.
Children may be any of the following:

- Scalar values (string, number, boolean, null, undefined, etc)
- Nested Virtual DOM Elements
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

This helper function converts a `props.children` value to a flattened Array regardless of its structure or nesting. If `props.children` is already an array, a copy is returned. This function is useful in cases where `props.children` may not be an array, which can happen with certain combinations of static and dynamic expressions in JSX.

For Virtual DOM Elements with a single child, `props.children` is a reference to the child. When there are multiple children, `props.children` is always an Array. The `toChildArray` helper provides a way to consistently handle all cases.

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>I have {count} children</div>;
}

// props.children is "bar"
render(
  <Foo>bar</Foo>,
  container
);

// props.children is [<p>A</p>, <p>B</p>]
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

This function allows you to create a shallow copy of a Virtual DOM Element.
It's generally used to add or overwrite `props` of an element:

```jsx
function Linkout(props) {
  // add target="_blank" to the link:
  return cloneElement(props.children, { target: '_blank' });
}
render(<Linkout><a href="/">home</a></Linkout>);
// <a href="/" target="_blank">home</a>
```

## createContext

See the section in the [Context documentation](/guide/v10/context#createcontext).

## createRef

Provides a way to reference an element or component once it has been rendered.

See the [References documentation](/guide/v10/refs#createref) for more details.

## Fragment

A special kind of component that can have children, but is not rendered as a DOM element.
Fragments make it possible to return multiple sibling children without needing to wrap them in a DOM container:

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
// Renders:
// <div id="container>
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```
