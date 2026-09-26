---
title: Preact 11
date: 2026-09-30
authors:
  - Jovi De Croock
---

# Preact 11

Two years ago we wrote [Preact X, a story of stability](/blog/preact-x). The short version: most of what we
had planned for Preact 11 turned out to be shippable in Preact X without breaking anyone, so we shipped it there.
What was left were the changes that genuinely needed a major: dropping IE11, moving `ref` into props, removing the
automatic `px` suffix, and cleaning out code that only existed to support runtimes nobody targets anymore.

Today we are releasing Preact 11. It is a deliberately "boring" major. If you are on Preact 10 and use function
components with hooks, there is a good chance the upgrade is a version bump and a codemod run. The
[upgrade guide](/guide/v11/upgrade-guide) lists every change, and the rest of this post covers what you get.

## What's new

### Hydration 2.0 and streamed SSR

Preact X required every suspending boundary to hydrate exactly one DOM node. That rule was easy to trip over: a
lazy component that returns `null`, or a fragment with two siblings, would cause the rest of the tree to run into
hydration mismatches as we only reserved a single DOM-node per suspended sub-tree.

```jsx
// Both of these are valid Preact 11 lazy targets.
function Analytics() {
  return null;
}

function Pair() {
  return (
    <>
      <p>Foo</p>
      <p>Bar</p>
    </>
  );
}
```

Hydration also coordinates with streamed server output. `preact-render-to-string` 6.7 emits stable comment markers
around suspended boundaries, and the client resumes hydration against whatever DOM has streamed in.
[RFC: Hydration 2.0](https://github.com/preactjs/preact/issues/4442) and
[RFC: Streaming SSR Hydration Coordination](https://github.com/preactjs/preact/issues/5034).

### Minimal-move child diffing

Reordering a keyed list now computes a longest increasing subsequence and moves only the nodes that are out of
place. Fewer DOM moves means less layout work and fewer `animationstart` and `focus` surprises.
Where the browser supports it, those moves go through [`moveBefore`](https://developer.mozilla.org/docs/Web/API/Element/moveBefore)
so iframes, videos, and focus state survive a reorder.

### `ref` is a prop

Function components receive `ref` in props. `forwardRef` still exists in `preact/compat` but you do not need it
anymore (Caveat: class components won't forward refs automatically in compat).

```jsx
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

### `createPortal` in core

Portals no longer require `preact/compat`. Import `createPortal` from `preact` directly; the compat export
remains for existing code.

### Newer React APIs in `preact/compat`

- `use()` for promises and context
- `useEffectEvent()`
- `useSyncExternalStore()` accepts `getServerSnapshot`
- `Children.map()` and `Children.forEach()` accept a context argument
- `preact/debug` exports `captureOwnerStack()` and `setupComponentStack()`

### `preact/compat` is tree-shakeable per feature

`preact/compat` used to install every one of its runtime hooks the moment you imported anything from it, which
meant `import { memo } from 'preact/compat'` pulled in Suspense's error handling and the render tracking that
`useSyncExternalStore` needs. In Preact 11 those installs happen when the feature is first referenced, and the
module is annotated so bundlers can drop what you never import. Apps that reach for one or two compat helpers
ship noticeably less; apps that alias `react` to `preact/compat` are unchanged.

Measured with esbuild, brotli:

| import from `preact/compat` | Preact 10.29 | Preact 11 |
|---|---|---|
| `memo` only | 6408 B | 5919 B |
| `Suspense` + `lazy` | 6395 B | 6382 B |
| everything | 8703 B | 8604 B |

### Smaller, ESM-only package

Preact 11 ships as ES modules only. The `.module.js`, CommonJS, and UMD builds are gone, which halves the
package on disk and removes a class of dual-package bugs. Node 22 and other runtimes with `require(esm)` can keep
using `require('preact')`.

| bundle (brotli) | 10.29.8 | 11.0.0 |
|---|---|---|
| `preact` | 4416 B | 4461 B |
| `preact/hooks` | 1413 B | 1423 B |
| `preact/compat` | 3764 B | 3545 B |
| `preact/jsx-runtime` | 890 B | 767 B |
| unpacked tarball | 1.8 MB | 840 KB |

Core is within a few bytes of Preact X despite the new hydration and diffing. We spent a lot of the release
cycle keeping it that way.

### Smaller things worth knowing

- Hook dependencies and state compare with `Object.is`, so `NaN` no longer re-renders forever.
- Context consumers no longer double-render when a provider updates.
- `useEffect` cleanups of unmounted components run after paint, matching React. See below.
- TypeScript 5.1 is the minimum, and most types moved from the `JSX` namespace to the `preact` namespace, which
  makes auto-import actually work.
- `useRef` requires an initial value in its types, like React 19.

## What you need to change

The full list is in the [upgrade guide](/guide/v11/upgrade-guide). The parts most apps hit:

1. **`useEffect` cleanup timing.** Cleanups for unmounted components no longer run synchronously during
   unmount. Tests that assert right after an unmount need to flush effects first; code that must run before
   the DOM mutation commits should use `useLayoutEffect`.
2. **No automatic `px`.** `style={{ height: 500 }}` renders `height:500` in core. `preact/compat` keeps the
   suffix.
3. **`ref` reaches your function components as a prop.** If you relied on `ref` pointing at a class instance
   through a wrapper, check it.
4. **`render(vnode, parent, replaceNode)`** is gone; use
   [`preact-root-fragment`](https://github.com/preactjs/preact-root-fragment).
5. **`defaultProps` on function components** moved to `preact/compat`.
6. **ESM-only.** CommonJS consumers on older Node versions and UMD `<script>` users need to switch.

## The ecosystem is already there

We did not want a repeat of Preact 8, where a chunk of the community stayed behind for years. Every
first-party package has accepted Preact 11 prereleases since the betas:

- [`@preact/signals`](https://github.com/preactjs/signals) 2.11
- [`preact-render-to-string`](https://github.com/preactjs/preact-render-to-string) 6.7 (required for streamed hydration)
- [`preact-iso`](https://github.com/preactjs/preact-iso) 2.12
- [`prefresh`](https://github.com/preactjs/prefresh) 1.5
- `@preact/preset-vite` and `create-preact`

Outside our own repos, [ReactLynx](https://lynxjs.org) has moved its bundled Preact to 11 and runs its
cross-platform UI on the same reconciler you get from npm.

Thank you to everyone who ran the betas and release candidates, opened issues, and sent PRs.

```sh
npm install preact@11
```
