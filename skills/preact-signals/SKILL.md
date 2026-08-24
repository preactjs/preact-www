---
name: preact-signals
version: 1.0.0
description: Adopt @preact/signals for state management, or review existing signals usage for correctness. Covers signal, computed, effect, batch and the rendering model. Use when asked to "add signals", "use signals instead of useState", or "review my signals code".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# Signals

Signals are reactive primitives: reading one inside a component subscribes that
component to it, and writing to one re-renders only the components that read it
— often only the text node itself.

Read the guide before making changes:

```sh
curl https://preactjs.com/guide/v10/signals.md
```

## Install

```sh
npm install @preact/signals
```

## The rules that actually matter

**Read `.value` as late as possible.** Passing the signal itself down keeps the
update local; reading `.value` in a parent re-renders the parent.

```jsx
// Re-renders <App/> on every change
<Display count={count.value} />

// Re-renders only the text node
<Display count={count} />
```

**A signal rendered directly is a text node.** `<p>{count}</p>` updates without
re-rendering the component at all. This is the main performance argument for
signals, and it is lost the moment you write `{count.value}`.

**`computed()` is derived state, not a cache.** It must be pure and must not
write to other signals.

**`effect()` is for side effects outside the tree.** Inside components, prefer
`useSignalEffect` so cleanup is tied to unmount.

**Batch related writes.** Multiple writes in one synchronous block should be
wrapped in `batch()` so subscribers run once.

```js
batch(() => {
	first.value = 'Jane';
	last.value = 'Doe';
});
```

**Module-scope signals are global state.** Fine for a client app, wrong for SSR:
a module-scope signal is shared across every request on the server. Create
per-request state inside the component or a context.

## Reviewing existing usage

```sh
# Reads that defeat the point — a .value read in a parent component
grep -rn "\.value" src/ | grep -v "useSignal\|signal(" | head -30
# Effects that should be useSignalEffect
grep -rn "effect(" src/
# Module-scope signals in code that also runs on the server
grep -rn "^const .* = signal(" src/
```

For each hit, decide whether it is a real problem before changing it — a
`.value` read in a leaf component is completely fine.

## Report

Say which reads you moved, which writes you batched, and which module-scope
signals are a hazard under SSR. If the app does not server-render, say that too
so the user knows why you left them alone.
