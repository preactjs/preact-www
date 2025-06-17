---
title: Debugging Preact Apps
description: How to debug Preact applications when something goes wrong
---

# Debugging Preact Apps

Preact ships with a lot of tools to make debugging easier. They're packaged in a single import and can be included by importing `preact/debug`.

These include integration with our own [Preact Devtools] Extension for Chrome and Firefox.

We'll print a warning or an error whenever we detect something wrong like incorrect nesting in `<table>` elements.

---

<toc></toc>

---

## Installation

The [Preact Devtools] can be installed in the extension store of your browser.

- [For Chrome](https://chrome.google.com/webstore/detail/preact-developer-tools/ilcajpmogmhpliinlbcdebhbcanbghmd)
- [For Firefox](https://addons.mozilla.org/en-US/firefox/addon/preact-devtools/)
- [For Edge](https://microsoftedge.microsoft.com/addons/detail/hdkhobcafnfejjieimdkmjaiihkjpmhk)

Once installed we need to import `preact/debug` somewhere to initialize the connection to the extension. Make sure that this import is **the first** import in your whole app.

> `@preact/preset-vite` includes the `preact/debug` package automatically. You can safely skip the setup & strip steps if you're using it!

Here is an example of how your main entry file to your application may look like.

```jsx
// Must be the first import
import 'preact/debug';
import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

### Strip devtools from production

Most bundlers allow you strip out code when they detect that a branch inside an `if`-statement will never be hit. We can use this to only include `preact/debug` during development and save those precious bytes in a production build.

```jsx
// Must be the first import
if (process.env.NODE_ENV === 'development') {
	// Must use require here as import statements are only allowed
	// to exist at top-level.
	require('preact/debug');
}

import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

Make sure to set the `NODE_ENV` variable to the correct value in your build tool.

## Debug Warnings and Errors

Sometimes you may get warnings or errors when Preact detects invalid code. These should be fixed to ensure that your app works flawlessly.

### `undefined` parent passed to `render()`

This means that the code is trying to render your app into nothing instead of a DOM node. It's the difference between:

```jsx
// What Preact received
render(<App />, undefined);

// vs what it expected
render(<App />, actualDomNode);
```

The main reason this error occurs is that the DOM node isn't present when the `render()` function is called. Make sure it exists.

### `undefined` component passed to `createElement()`

Preact will throw this error whenever you pass `undefined` instead of a component. The common cause for this one is mixing up `default` and `named` exports.

```jsx
// app.js
export default function App() {
	return <div>Hello World</div>;
}

// index.js: Wrong, because `app.js` doesn't have a named export
import { App } from './app';
render(<App />, dom);
```

The same error will be thrown when it's the other way around. When you declare a `named` export and are trying to use it as a `default` export. One quick way to check this (in case your editor won't do it already), is to just log out the import:

```jsx
// app.js
export function App() {
	return <div>Hello World</div>;
}

// index.js
import App from './app';

console.log(App);
// Logs: { default: [Function] } instead of the component
```

### Passed a JSX literal as JSX twice

Passing a JSX-Literal or Component into JSX again is invalid and will trigger this error.

```jsx
const Foo = <div>foo</div>;
// Invalid: Foo already contains a JSX-Element
render(<Foo />, dom);
```

To fix this, we can just pass the variable directly:

```jsx
const Foo = <div>foo</div>;
render(Foo, dom);
```

### Improper nesting of table detected

HTML parsers have very strict rules on how tables should be structured, deviating from which will lead to rendering errors that can be hard to debug. To help with this, Preact can detect improper nesting in a number of situations and will print warnings to catch this early. To learn more about how tables should be structured we can highly recommend [the MDN documentation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics).

> **Note:** In this context, "strict" is referring to the _output_ of the HTML parser, not the _input_. Browsers are quite forgiving and try to correct invalid HTML where they can to ensure that pages can still be displayed. However, for VDOM libraries like Preact this can lead to issues as the input content might not match the output once the browser has corrected it which Preact will not be made aware of.
>
> For example, `<tr>` elements must always be a child of `<tbody>`, `<thead>`, or `<tfoot>` elements per the spec, but if you were to write a `<tr>` directly inside of a `<table>`, the browser will attempt to correct this by wrapping it in a `<tbody>` element for you. Preact will therefore expect the DOM structure to be `<table><tr></tr></table>` but the real DOM constructed by the browser would be `<table><tbody><tr></tr></tbody></table>`.

### Invalid `ref`-property

When the `ref` property contains something unexpected we'll throw this error. This includes string-based `refs` that have been deprecated a while ago.

```jsx
// valid
<div ref={e => {/* ... */)}} />

// valid
const ref = createRef();
<div ref={ref} />

// Invalid
<div ref="ref" />
```

### Invalid event handler

Sometimes you'll may accidentally pass a wrong value to an event handler. They must always be a `function` or `null` if you want to remove it. All other types are invalid.

```jsx
// valid
<div onClick={() => console.log("click")} />

// invalid
<div onClick={console.log("click")} />
```

### Hook can only be invoked from render methods

This error occurs when you try to use a hook outside of a component. They are only supported inside a function component.

```jsx
// Invalid, must be used inside a component
const [value, setValue] = useState(0);

// valid
function Foo() {
	const [value, setValue] = useState(0);
	return <button onClick={() => setValue(value + 1)}>{value}</button>;
}
```

### Getting `vnode.[property]` is deprecated

With Preact X we did some breaking changes to our internal `vnode` shape.

| Preact 8.x         | Preact 10.x            |
| ------------------ | ---------------------- |
| `vnode.nodeName`   | `vnode.type`           |
| `vnode.attributes` | `vnode.props`          |
| `vnode.children`   | `vnode.props.children` |

### Found children with the same key

One unique aspect about virtual-dom based libraries is that they have to detect when a children is moved around. However to know which child is which, we need to flag them somehow. _This is only necessary when you're creating children dynamically._

```jsx
// Both children will have the same key "A"
<div>
	{['A', 'A'].map(char => (
		<p key={char}>{char}</p>
	))}
</div>
```

The correct way to do it is to give them unique keys. In most cases the data you're iterating over will have some form of `id`.

```jsx
const persons = [
	{ name: 'John', age: 22 },
	{ name: 'Sarah', age: 24 }
];

// Somewhere later in your component
<div>
	{persons.map(({ name, age }) => {
		return (
			<p key={name}>
				{name}, Age: {age}
			</p>
		);
	})}
</div>;
```

[preact devtools]: https://preactjs.github.io/preact-devtools/
