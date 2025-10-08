---
title: API Reference
description: Learn more about all exported functions of the Preact module
---

# API Reference

This page serves as a quick overview over all exported functions.

---

<toc></toc>

---

## preact

The `preact` module provides only essential functionality like creating VDOM elements and rendering components. Additional utilities are provided by the various subpath exports, such as `preact/hooks`, `preact/compat`, `preact/debug`, etc.

### Component

`Component` is a base class that can be extended to create stateful Preact components.

Rather than being instantiated directly, Components are managed by the renderer and created as-needed.

```js
import { Component } from 'preact';

class MyComponent extends Component {
	// (see below)
}
```

#### Component.render(props, state)

All components must provide a `render()` function. The render function is passed the component's current props and state, and should return a Virtual DOM Element (typically a JSX "element"), an Array, or `null`.

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

### render()

`render(virtualDom, containerNode)`

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

The first argument must be a valid Virtual DOM Element, which represents either a component or an element. When passing a Component, it's important to let Preact do the instantiation rather than invoking your component directly, which will break in unexpected ways:

```jsx
const App = () => <div>foo</div>;

// DON'T: Invoking components directly means they won't be counted as a
// VNode and hence not be able to use functionality relating to vnodes.
render(App(), rootElement); // ERROR
render(App, rootElement); // ERROR

// DO: Passing components using h() or JSX allows Preact to render correctly:
render(h(App), rootElement); // success
render(<App />, rootElement); // success
```

### hydrate()

`hydrate(virtualDom, containerNode)`

If you've already pre-rendered or server-side-rendered your application to HTML, Preact can bypass most rendering work when loading in the browser. This can be enabled by switching from `render()` to `hydrate()`, which skips most diffing while still attaching event listeners and setting up your component tree. This works only when used in conjunction with pre-rendering or [Server-Side Rendering](/guide/v10/server-side-rendering).

```jsx
// --repl
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

### h() / createElement()

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

h('div', { id: 'foo' }, h('span', null, 'Hello!'));
// <div id="foo"><span>Hello!</span></div>
```

### toChildArray

`toChildArray(componentChildren)`

This helper function converts a `props.children` value to a flattened Array regardless of its structure or nesting. If `props.children` is already an array, a copy is returned. This function is useful in cases where `props.children` may not be an array, which can happen with certain combinations of static and dynamic expressions in JSX.

For Virtual DOM Elements with a single child, `props.children` is a reference to the child. When there are multiple children, `props.children` is always an Array. The `toChildArray` helper provides a way to consistently handle all cases.

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
	const count = toChildArray(props.children).length;
	return <div>I have {count} children</div>;
}

// props.children is "bar"
render(<Foo>bar</Foo>, container);

// props.children is [<p>A</p>, <p>B</p>]
render(
	<Foo>
		<p>A</p>
		<p>B</p>
	</Foo>,
	container
);
```

### cloneElement

`cloneElement(virtualElement, props, ...children)`

This function allows you to create a shallow copy of a Virtual DOM Element.
It's generally used to add or overwrite `props` of an element:

```jsx
function Linkout(props) {
	// add target="_blank" to the link:
	return cloneElement(props.children, { target: '_blank' });
}
render(
	<Linkout>
		<a href="/">home</a>
	</Linkout>
);
// <a href="/" target="_blank">home</a>
```

### createContext

`createContext(initialState)`

Creates a new Context object which can be used to pass data through the component tree without passing down props through each level.

See the section in the [Context documentation](/guide/v10/context#createcontext).

```jsx
import { createContext } from 'preact';

const MyContext = createContext(defaultValue);
```

### createRef

`createRef(initialValue)`

Creates a new Ref object that acts as a stable, local value that will persist across renders. This can be used to store DOM references, component instances, or any arbitrary value.

See the [References documentation](/guide/v10/refs#createref) for more details.

```jsx
import { createRef, Component } from 'preact';

class MyComponent extends Component {
    inputRef = createRef(null);

    // ...
}
```

### Fragment

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

### isValidElement

`isValidElement(virtualElement)`

Checks if the provided value is a valid Preact VNode.

```jsx
import { isValidElement, h } from 'preact';

isValidElement(<div />); // true
isValidElement(h('div')); // true

isValidElement('div'); // false
isValidElement(null); // false
```

### options

See the [Option Hooks](/guide/v10/options) documentation for more details.

## preact/hooks

See the [Hooks](/guide/v10/hooks) documentation for more details. Please note that the page includes a number of "Compat-specific hooks" that are not available from `preact/hooks`, only `preact/compat`.

## preact/compat

`preact/compat` is our compatibility layer that allows you to use Preact as a drop-in replacement for React. It provides all of the APIs of `preact` and `preact/hooks`, whilst also providing a few more to match the React API.

### Children

Offered for compatibility, `Children` is a passthrough wrapper around the [`toChildArray`](#tochildarray) function from core. It's quite unnecessary in Preact apps.

#### Children.map

`Children.map(children, fn, [context])`

Iterates over children and returns a new array, same as [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```jsx
function List(props) {
	const children = Children.map(props.children, child => (
		<li>{child}</li>
	));
	return (
		<ul>
			{children}
		</ul>
	);
}
```

> Note: Can be replaced with `toChildArray(props.children).map(...)`.

#### Children.forEach

`Children.forEach(children, fn, [context])`

Iterates over children but does not return a new array, same as [`Array.prototype.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

```jsx
function List(props) {
	const children = [];
	Children.forEach(props.children, child =>
		children.push(<li>{child}</li>)
	);
	return (
		<ul>
			{children}
		</ul>
	);
}
```

> Note: Can be replaced with `toChildArray(props.children).forEach(...)`.

#### Children.count

`Children.count(children)`

Returns the total number children.

```jsx
function MyComponent(props) {
	const children = Children.count(props.children);
	return <div>I have {children.length} children</div>;
}
```

> Note: Can be replaced with `toChildArray(props.children).length`.

#### Children.only

`Children.only(children)`

Throws if the number of children is not exactly one. Otherwise, returns the only child.

```jsx
function List(props) {
	const singleChild = Children.only(props.children);
	return (
		<ul>
			{singleChild}
		</ul>
	);
}
```

#### Children.toArray

`Children.count(children)`

Converts children to a flat array. An alias of [`toChildArray`](#tochildarray).

```jsx
function MyComponent(props) {
	const children = Children.toArray(props.children);
	return <div>I have {children.length} children</div>;
}
```

> Note: Can be replaced with `toChildArray(props.children)`.

### createPortal

`createPortal(virtualDom, containerNode)`

Allows you to render somewhere else in the DOM tree than your component's natural parent.

```html
<html>
	<body>
		<!-- Modals should be rendered here -->
		<div id="modal-root"></div>
		<!-- App is rendered here -->
		<div id="app"></div>
	</body>
</html>
```

```jsx
import { createPortal } from 'preact/compat';
import { MyModal } from './MyModal.jsx';

function App() {
	const container = document.getElementById('modal-root');
	return (
		<div>
			<h1>My App</h1>
			{createPortal(<MyModal />, container)}
		</div>
	);
}
```

### PureComponent

The `PureComponent` class works similar to `Component`. The difference is that `PureComponent` will skip rendering when the new props are equal to the old ones. To do this we compare the old and new props via a shallow comparison where we check each props property for referential equality. This can speed up applications a lot by avoiding unnecessary re-renders. It works by adding a default `shouldComponentUpdate` lifecycle hook.

```jsx
import { render } from 'preact';
import { PureComponent } from 'preact/compat';

class Foo extends PureComponent {
	render(props) {
		console.log('render');
		return <div />;
	}
}

const dom = document.getElementById('root');
render(<Foo value="3" />, dom);
// Logs: "render"

// Render a second time, doesn't log anything
render(<Foo value="3" />, dom);
```

> Note that the advantage of `PureComponent` only pays off when then render is expensive. For simple children trees it can be quicker to just do the `render` compared to the overhead of comparing props.

### memo

`memo` is equivalent to functional components as `PureComponent` is to classes. It uses the same comparison function under the hood, but allows you to specify your own specialized function optimized for your use case.

```jsx
import { memo } from 'preact/compat';

function MyComponent(props) {
	return <div>Hello {props.name}</div>;
}

// Usage with default comparison function
const Memoed = memo(MyComponent);

// Usage with custom comparison function
const Memoed2 = memo(MyComponent, (prevProps, nextProps) => {
	// Only re-render when `name' changes
	return prevProps.name === nextProps.name;
});
```

> The comparison function is different from `shouldComponentUpdate` in that it checks if the two props objects are **equal**, whereas `shouldComponentUpdate` checks if they are different.

### forwardRef

In some cases when writing a component you want to allow the user to get hold of a specific reference further down the tree. With `forwardRef` you can sort-of "forward" the `ref` property:

```jsx
import { createRef, render } from 'preact';
import { forwardRef } from 'preact/compat';

const MyComponent = forwardRef((props, ref) => {
	return <div ref={ref}>Hello world</div>;
});

// Usage: `ref` will hold the reference to the inner `div` instead of
// `MyComponent`
const ref = createRef();
render(<MyComponent ref={ref} />, dom);
```

This component is most useful for library authors.

> **Note:** This is less likely to be useful in Preact v11 as [refs are now forwarded by default](/guide/v11/upgrade-guide#refs-are-forwarded-by-default).

### StrictMode

`<StrictMode><App /></StrictMode>`

Offered strictly for compatibility, `<StrictMode>` is simply an alias of [`Fragment`](#Fragment). It does not provide any additional checks or warnings, all of which are provided by [`preact/debug`](#preactdebug).

```jsx
import { StrictMode } from 'preact/compat';

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root')
);
```

### Suspense

`<Suspense fallback={...}>...</Suspense>`

A component that can be used to "wait" for some asynchronous operation to complete before rendering its children. While waiting, it will render the provided `fallback` content instead.

```jsx
import { Suspense } from 'preact/compat';

function MyComponent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MyLazyComponent />
        </Suspense>
    );
}
```

### lazy

`lazy(loadingFunction)`

Allows you to defer loading of a component until it is actually needed. This is useful for code-splitting and lazy-loading parts of your application.

```jsx
import { lazy } from 'preact/compat';

const MyLazyComponent = lazy(() => import('./MyLazyComponent.jsx'));
```

## preact/debug

`preact/debug` provides some low-level debugging utilities that can be used to help identify issues for those building very specific tooling on top of Preact. It is very, very unlikely that any normal consumer should directly use any of the functions below; instead, you should import `preact/debug` at the root of your application to enable helpful warnings and error messages.

### resetPropWarnings

`resetPropWarnings()`

Resets the internal history of which prop type warnings have already been logged. This is useful when running tests to ensure each test starts with a clean slate.

```jsx
import { resetPropWarnings } from 'preact/debug';
import PropTypes from 'prop-types';

function Foo(props) {
	return <h1>{props.title}</h1>;
}

Foo.propTypes = {
	title: PropTypes.string.isRequired
};

render(<Foo />, document.getElementById('app'));
// Logs: Warning: Failed prop type: The prop `title` is marked as required in `Foo`, but its value is `undefined`.

expect(console.error).toHaveBeenCalledOnce();

resetPropWarnings();

//...

```

### getCurrentVNode

`getCurrentVNode()`

Gets the current VNode being rendered.

```jsx
import { render } from 'preact';
import { getCurrentVNode } from 'preact/debug';

function MyComponent() {
	const currentVNode = getCurrentVNode();
	console.log(currentVNode); // Logs: Object { type: MyComponent(), props: {}, key: undefined, ref: undefined, ... }

	return <h1>Hello World!</h1>
}

render(<MyComponent />, document.getElementById('app'));
```

### getDisplayName

`getDisplayName(vnode)`

Returns a string representation of a Virtual DOM Element's type, useful for debugging and error messages.

```js
import { h } from 'preact';
import { getDisplayName } from 'preact/debug';

getDisplayName(h('div')); // "div"
getDisplayName(h(MyComponent)); // "MyComponent"
getDisplayName(h(() => <div />)); // "<empty string>"
```

### getOwnerStack

`getOwnerStack(vnode)`

Return the component stack that was captured up to this point.

```jsx
import { render, options } from 'preact';
import { getOwnerStack } from 'preact/debug';

const oldVNode = options.diffed;
options.diffed = (vnode) => {
	if (vnode.type === 'h1') {
		console.log(getOwnerStack(vnode));
		// Logs:
		//
		// in h1 (at /path/to/file.jsx:17)
		// in MyComponent (at /path/to/file.jsx:20)
	}
	if (oldVNode) oldVNode(vnode);
};

function MyComponent() {
	return <h1>Hello World!</h1>;
}

render(<MyComponent />, document.getElementById('app'));
```

### captureOwnerStack

`captureOwnerStack()`

Return the component stack that was captured up to this point. Combination of [`getCurrentVNode()`](#getcurrentvnode) and [`getOwnerStack()`](#getownerstack).

```jsx
import { render } from 'preact';
import { getCurrentVNode } from 'preact/debug';

function MyComponent() {
	const currentVNode = getCurrentVNode();
	console.log(currentVNode);
	// Logs:
	//
	// in MyComponent
	// in App (at /path/to/file.jsx:15)

	return <h1>Hello World!</h1>
}

function App() {
	return <MyComponent />;
}

render(<App />, document.getElementById('app'));
```

## preact/devtools

### addHookName

`addHookName(value, name)`

Display a custom label for a hook in the devtools. This may be useful when you have multiple hooks of the same type in a single component and want to be able to distinguish them.

```jsx
import { addHookName } from 'preact/devtools';
import { useState } from 'preact/hooks';

function useCount(init) {
	return addHookName(useState(init), 'count');
}

function App() {
	const [count, setCount] = useCount(0);
	return (
		<button onClick={() => setCount(c => c + 1)}>
			{count}
		</button>;
	);
}
```

## preact/jsx-runtime

A collection of functions that can be used by JSX transpilers, such as [Babel's "automatic runtime" transform](https://babeljs.io/docs/babel-plugin-transform-react-jsx#react-automatic-runtime) or [Deno's "precompile" transform](https://docs.deno.com/runtime/reference/jsx/#jsx-precompile-transform). Not necessarily meant for direct use.

### jsx

`jsx(type, props, [key], [isStaticChildren], [__source], [__self])`

Returns a Virtual DOM Element with the given `props`. Similar to `h()` but implements Babel's "automatic runtime" API.

```js
import { jsx } from 'preact/jsx-runtime';

jsx('div', { id: 'foo', children: 'Hello!' });
// <div id="foo">Hello!</div>
```

### jsxs

Alias of [`jsx`](#jsx), provided for compatibility.

### jsxDev

Alias of [`jsx`](#jsx), provided for compatibility.

### Fragment

Re-export of [`Fragment`](#fragment) from core.

### jsxTemplate

`jsxTemplate(templates, ...exprs)`

Create a template vnode. Used by Deno's "precompile" transform.

### jsxAttr

`jsxAttr(name, value)`

Serialize an HTML attribute to a string. Used by Deno's "precompile" transform.

### jsxEscape

`jsxEscape(value)`

Escape a dynamic child passed to [`jsxTemplate`](#jsxtemplate). Used by Deno's "precompile" transform.

## preact/test-utils

A collection of utilities to facilitate testing Preact components. Usually these are used by a testing library like [`enzyme`](/guide/v10/unit-testing-with-enzyme) or [`@testing-library/preact`](/guide/v10/preact-testing-library) rather than directly by users.

### setupRerender

`setupRerender()`

Setup a rerender function that will drain the queue of pending renders

### act

`act(callback)`

Run a test function and flush all effects and rerenders after invoking it.

### teardown

`teardown()`

Teardown test environment and reset Preact's internal state
