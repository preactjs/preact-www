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

The following examples are all valid in Preact 11:

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
