---
name: Options
description: 'Preact has several option hooks that allow you to attach callbacks to various stages of the diffing process.'
---

# Options

Preact supports a range of callbacks that allow you to hook into different stages of the renderer process. These are frequently use to extend the featureset of Preact itself, or to create specialized testing tools.

All of our addons like `preact/hooks`, `preact/compat` and our devtools extension are based on this. This document is mainly intended for tooling or library authors who wish to extend Preact.

---

<toc></toc>

---

## Setting option hooks

You can set option hooks in Preact by modifying the exported `options` object. Always make sure that you keep calling the previously defined hook if there was any. Otherwise tha callchain will be broken and other code that depends on it will break (like addons for example). Make sure to forward the same arguments, too.

```jsx
import { options } from 'preact';

// Store previous hook
const oldHook = options.vnode;

// Set our own options hook
options.vnode = vnode => {
  console.log("Hey I'm a vnode", vnode);

  // Call previously defined hook if there was any
  if (oldHook) {
    oldHook(vnode);
  }
}
```

## Available Option Hooks

| Hook name | Type Signature | Description |
|---|---|---|
| `vnode` | `(vnode: VNode) => void` | Attach a hook that is invoked whenever a VNode is created. |
| `unmount` | `(vnode: VNode) => void` | Attach a hook that is invoked immediately before a vnode is unmounted. |
| `diffed` | `(vnode: VNode) => void` | Attach a hook that is invoked after a vnode has rendered. |
| `event` | `(event: Event) => void` | Called just before an event is forwarded to the attached event listener. |
| `requestAnimationFrame` | `(callback) => void` | Used to control scheduling of effect based functionality in `preat/hooks`. |
| `debounceRendering` | `(callback: () => void) => void` | Timing function that is used to process updates from the global component queue. By default we use `Promise.resolve()` or `setTimeout` if Promises are not available. |
| `useDebugValue` | `(value: string | number) => void` | Called when the `useDebugValue` hook in `preact/hooks` is called. |
