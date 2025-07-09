---
title: What's new in Preact 11
description: New features and changes in Preact 11
---

# What's new in Preact 11

TODO: There's not a heck of a lot to write here, do we even need this page?

---

<toc></toc>

---

## Hydration 2.0

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

## `Object.is` for equality checks

Preact 11 uses `Object.is` for equality checks in hook arguments, more closely aligning with the behavior of React. Namely, this now supports use of `NaN` as a state value or `useEffect`/`useMemo`/`useCallback` dependency.

In Preact 10, the following example would rerender every time the button was clicked, whereas in Preact 11, it will not:

```jsx
import { useState, useEffect } from 'preact/hooks';

function App() {
	const [count, setCount] = useState(0);

	return <button onClick={() => setCount(NaN)}>Set count to NaN</button>;
}
```
