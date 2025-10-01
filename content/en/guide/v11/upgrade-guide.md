---
title: Upgrading from Preact 10.x
description: Upgrade your Preact 10.x application to Preact 11
---

# Upgrading from Preact 10.x

Preact 11 aims to be a minimally breaking upgrade from Preact 10.x, allowing us to increase our targeted browser versions and clear out some legacy code. For most users, this upgrade should be straightforward and quick, with only a few changes that may require attention.

This document is intended to guide you through upgrading an existing Preact 10.x application to Preact 11. It covers breaking changes and steps to ensure a smooth transition.

---

<toc></toc>

---

## Getting your applications ready

### Supported Browser Versions

Preact 11.x will support the following browsers without any additional polyfills:

- Chrome >= 40
- Safari >= 9
- Firefox >= 36
- Edge >= 12

If you need to support older browser versions, you will need to use polyfills.

### Supported TypeScript Versions

TS v5.1 will be the new minimum supported version for the 11.x release line. If you are on an older version, please upgrade prior to upgrading to Preact 11.

Increasing our minimum TS version allows us to take advantage of some key improvements that the TS team has made for JSX typing, fixing a handful of long-standing & fundamental type issues that we could not address ourselves.

### ESM Bundles are distributed as `.mjs`

Preact 11.x will distribute all ESM bundles with the `.mjs` extension, dropping the `.module.js` copies that 10.x provided. This should correct some tooling issues that some users have experienced as well as simplify the distribution bundles.

The CJS & UMD bundles will continue to be provided and are unchanged.

## What's new

### Hydration 2.0

Preact 11 introduces some significant improvements to the hydration process, particularly around suspending components. Whereas Preact X had limitations that required users to always return exactly 1 DOM node per async boundary, Preact 11 allows for 0 or 2+ DOM nodes, enabling more flexible component designs.

The following examples are now valid in Preact 11:

```jsx
function X() {
  // Some lazy operation, such as initializing analytics
  return null;
};

const LazyOperation = lazy(() => /* import X */);
```

```jsx
function Y() {
  // `<Fragment>` disappears upon rendering, leaving two `<p>` DOM elements
  return (
    <Fragment>
      <p>Foo</p>
      <p>Bar</p>
    </Fragment>
  );
};

const SuspendingMultipleChildren = lazy(() => /* import Y */);
```

For a more comprehensive write up of the known problems and how we have addressed them, please see [RFC: Hydration 2.0 (preactjs/preact#4442)](https://github.com/preactjs/preact/issues/4442)

### `Object.is` for equality checks in hook arguments

Preact 11 uses `Object.is` for equality checks in hook arguments, more closely aligning with the behavior of React. Namely, this now supports use of `NaN` as a state value or `useEffect`/`useMemo`/`useCallback` dependency.

In Preact 10, the following example would rerender every time the button was clicked, whereas in Preact 11, it will not:

```jsx
import { useState, useEffect } from 'preact/hooks';

function App() {
	const [count, setCount] = useState(0);

	return <button onClick={() => setCount(NaN)}>Set count to NaN</button>;
}
```

## API Changes

### Refs are forwarded by default

Refs are now forwarded by default, allowing them to be used just like any other prop. You will no longer need to use `forwardRef` from `preact/compat` to supply this functionality.

```jsx
function MyComponent({ ref }) {
	return <h1 ref={ref}>Hello, world!</h1>;
}

<MyComponent ref={myRef} />;
// Preact 10: myRef.current is an instance of MyComponent
// Preact 11: myRef.current is the <h1> DOM element
```

> **Note**: When using `preact/compat`, refs will not be forwarded to class components. React only forwards refs to function components and so we match that behavior for anyone using the compat layer.
>
> For consumers of pure Preact, **refs will be forwarded** to class components, same as function components.

If you need to continue to use the old behavior, you can use the following snippet to revert to the Preact 10 behavior:

```js
import { options } from 'preact';

const oldVNode = options.vnode;
options.vnode = (vnode) => {
    if (vnode.props.ref) {
        vnode.ref = vnode.props.ref;
        delete vnode.props.ref;
    }

	if (oldVNode) oldVNode(vnode);
}
```

### Move automatic `px` suffixing for style properties into `preact/compat`

Preact 11 has moved the automatic `px` suffixing for numeric style values from core into `preact/compat`.

```jsx
<h1 style={{ height: 500 }}>Hello World!</h1>
// Preact 10: <h1 style="height:500px">Hello World!</h1>
// Preact 11: <h1 style="height:500">Hello World!</h1>
```

### Move `defaultProps` support into `preact/compat`

This has been moved into `preact/compat` as it's less commonly used today due to the rise of functional components and hooks.

### Remove `replaceNode` parameter from `render()`

The third & optional parameter to `render()` has been removed in Preact 11 as there were numerous bugs and edge cases with the implementation as well as some key use cases that it could not accommodate well.

If this is something you still need, we provide a standalone, Preact 10 compatible implementation via the [`preact-root-fragment`](https://github.com/preactjs/preact-root-fragment) package.

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

### Remove `Component.base` property

We're removing `Component.base` as it has always felt leaky to surface the DOM that is connected to the Component.

If you still have a need for this you can access the DOM with `this.__v.__e`; `.__v` is a mangled property that refers to the VNode associated with the component, and `.__e` is the DOM node associated with that VNode.

### Remove `SuspenseList` from `preact/compat`

The implementation and server-side support has always been a bit unclear and incomplete, so we are choosing to remove it.

### Types

#### `useRef` requires an initial value

Similar to the change made in React 19, we've changed the `useRef` type signature to require an initial value. Providing an initial value simplifies some of the type inference and helps users avoid some typing issues.

#### Reduction in `JSX` namespace

TypeScript uses the special `JSX` namespace to alter how JSX is typed and interpreted. In v10, we greatly expanded this namespace to include a variety of useful types, but many of these are better implemented in the `preact` namespace instead.

Starting in Preact 11, the `JSX` namespace will therefore only contain the types that TS requires, such as `Element`, `IntrinsicElements`, etc., and the rest will be moved to the `preact` namespace. This should also aid editors and IDEs when resolving types for auto-import suggestions.

```ts
 // Preact 10
import { JSX } from 'preact';

type MyCustomButtonProps = JSX.ButtonHTMLAttributes & { ... }

// Preact 11
import { ButtonHTMLAttributes } from 'preact';

type MyCustomButtonProps = ButtonHTMLAttributes & { ... }
```
