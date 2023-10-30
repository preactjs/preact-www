---
name: Option Hooks
description: 'Preact has several option hooks that allow you to attach callbacks to various stages of the diffing process.'
---

# Option Hooks

Callbacks for plugins that can change Preact's rendering.

Preact supports a number of different callbacks that can be used to observe or change each stage of the rendering process, commonly referred to as "Option Hooks" (not to be confused with [hooks](https://preactjs.com/guide/v10/hooks)). These are frequently used to extend the feature-set of Preact itself, or to create specialized testing tools. All of our addons like `preact/hooks`, `preact/compat` and our devtools extension are based on these callbacks.

This API is primarily intended for tooling or library authors who wish to extend Preact.

---

<div><toc></toc></div>

---

## Versioning and Support

Option Hooks are shipped in Preact, and as such are semantically versioned. However, they do not have the same deprecation policy, which means major versions can change the API without an extended announcement period leading up to release. This is also true for the structure of internal APIs exposed through Options Hooks, like `VNode` objects.

## Setting Option Hooks

You can set Options Hooks in Preact by modifying the exported `options` object.

When defining a hook, always make sure to call a previously defined hook of that name if there was one. Without this, the callchain will be broken and code that depends on the previously-installed hook will break, resulting in addons like `preact/hooks` or DevTools ceasing to work. Make sure to pass the same arguments to the original hook, too - unless you have a specific reason to change them.

```js
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

None of the currently available hooks excluding `options.event` have return values, so handling return values from the original hook is not necessary.

## Available Option Hooks

#### `options.vnode`

**Signature:** `(vnode: VNode) => void`

The most common Options Hook, `vnode` is invoked whenever a VNode object is created. VNodes are Preact's representation of Virtual DOM elements, commonly thought of as "JSX Elements".

#### `options.unmount`

**Signature:** `(vnode: VNode) => void`

Invoked immediately before a vnode is unmounted, when its DOM representation is still attached.

#### `options.diffed`

**Signature:** `(vnode: VNode) => void`

Invoked immediately after a vnode is rendered, once its DOM representation is constructed or transformed into the correct state.

#### `options.event`

**Signature:** `(event: Event) => any`

Invoked just before a DOM event is handled by its associated Virtual DOM listener. When `options.event` is setted, the event which is event listener argument is replaced return value of `options.event`.

#### `options.requestAnimationFrame`

**Signature:** `(callback: () => void) => void`

Controls the scheduling of effects and effect-based based functionality in `preact/hooks`.

#### `options.debounceRendering`

**Signature:** `(callback: () => void) => void`

A timing "deferral" function that is used to batch processing of updates in the global component rendering queue.

By default, Preact uses a Microtask tick via `Promise.resolve()`, or `setTimeout` when Promise is not available.

#### `options.useDebugValue`

**Signature:** `(value: string | number) => void`

Called when the `useDebugValue` hook in `preact/hooks` is called.
