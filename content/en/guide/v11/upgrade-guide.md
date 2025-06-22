---
title: Upgrading from Preact 10.x
description: Upgrade your Preact 10.x application to Preact 11
---

# Upgrading from Preact 10.x

This document is intended to guide you through upgrading an existing Preact 10.x application to Preact 11. It covers breaking changes and steps to ensure a smooth transition.

---

<toc></toc>

---

## Getting your applications ready

### Supported Browser Versions

Preact 11 supports the following browsers:

- Chrome >= 40
- Safari >= 9
- Firefox >= 36
- Edge >= 12

### Supported TypeScript Versions

TS v5.1 will be the new minimum supported version for the 11.x release line. If you are on an older version, please upgrade prior to upgrading to Preact 11.

Increasing our minimum TS version allows us to take advantage of some key improvements that the TS team has made for JSX typing, fixing a handful of long-standing & fundamental type issues that we could not address ourselves.

### Remove `replaceNode` parameter from `render()`

The third & optional parameter to `render()` has been removed in Preact 11 as there were numerous bugs and edge cases with the implementation as well as some key use cases that it could not accommodate well.

If this is something you still need, we provide a standalone, Preact 10-compatible implementation [here](https://gist.github.com/developit/f4c67a2ede71dc2fab7f357f39cff28c).

### Refs are forwarded by default

Refs are now forwarded by default, allowing them to be used just like any other prop in function components. You will no longer need `forwardRef` from `preact/compat` to supply this functionality.

```jsx
function MyComponent({ ref }) {
	return <h1 ref={ref}>Hello, world!</h1>;
}

<MyComponent ref={myRef} />;
// Preact 10: myRef.current is an instance of MyComponent
// Preact 11: myRef.current is the <h1> DOM element
```

If you need to continue to use the old behavior, you can use the following snippet to revert to the Preact 10 behavior:

```js
import { options } from 'preact';

const oldVNode = options.vnode;
options.vnode = (vnode) => {
    if (vnode.props.ref) {
        vnode.ref = vnode.props.ref;
        delete vnode.props.ref;
    }

	if oldVNode) oldVNode(vnode);
}
```

### Remove automatic `px` suffixing for style properties

Preact 11 has moved the automatic `px` suffixing for numeric style values from core into `preact/compat`.

```jsx
<h1 style={{ height: 500 }}>Hello World!</h1>
// Preact 10: <h1 style="height:500px">Hello World!</h1>
// Preact 11: <h1 style="height:500">Hello World!</h1>
```
