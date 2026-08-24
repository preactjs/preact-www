---
name: preact-migrate-from-react
version: 1.0.0
description: Migrate a React application to Preact. Sets up preact/compat aliasing, finds the APIs that do not carry over, and verifies the build. Use when asked to "switch to Preact", "replace React with Preact", or "reduce bundle size by moving off React".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# Migrate a React app to Preact

Preact is a 3kB alternative to React with the same modern API. Most apps move
over by aliasing `react` to `preact/compat`; the work is finding the handful of
places that depend on React internals.

Authoritative reference — fetch before you start, it is the source of truth and
this file is a summary:

```sh
curl https://preactjs.com/guide/v10/switching-to-preact.md
curl https://preactjs.com/guide/v10/differences-to-react.md
```

## 1. Survey before changing anything

Find what the app actually depends on:

```sh
# React APIs that need attention under compat
grep -rn "react-dom/server\|ReactDOM.createPortal\|unstable_\|SECRET_INTERNALS\|react-test-renderer" src/
# Libraries that bundle their own React copy
grep -rn "\"react\"\|\"react-dom\"" package.json */package.json 2>/dev/null
```

Report what you find before editing. A codebase using React internals,
`react-test-renderer`, or React Server Components is not a straightforward
migration — say so rather than starting and getting stuck halfway.

## 2. Install and alias

```sh
npm install preact preact-render-to-string
npm install --save-dev @preact/preset-vite   # Vite only
```

Alias in the bundler, not by rewriting imports — third-party packages import
`react` too, and only an alias catches those.

**Vite** (`@preact/preset-vite` sets the aliases for you):

```js
import preact from '@preact/preset-vite';
export default { plugins: [preact()] };
```

**webpack:**

```js
resolve: {
  alias: {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
    'react/jsx-runtime': 'preact/jsx-runtime',
    'react-dom/test-utils': 'preact/test-utils'
  }
}
```

Keep `react` and `react-dom` in `package.json` only if a dependency requires
them as peers; otherwise remove them so nothing resolves the real thing.

## 3. Fix what compat does not cover

Work through these; each is a real difference, not a lint preference:

- **`class` vs `className`** — both work. No change needed.
- **`onChange`** — Preact uses the native `change` event by default. In compat
  it is mapped to `input`, matching React. Outside compat, use `onInput`.
- **`useLayoutEffect` in SSR** — runs a no-op on the server, as in React.
- **PropTypes** — not validated unless you import `prop-types` yourself.
- **Synthetic events** — Preact uses native events. Code reading
  `e.nativeEvent`, relying on event pooling, or calling `e.persist()` needs
  updating; pooling does not exist, so `e.persist()` is unnecessary.
- **`react-dom/server`** — replace with `preact-render-to-string`.
- **Children helpers** — `Children.map`/`toArray` exist in compat but the
  underlying vnode shape differs; anything inspecting `element.type` or
  `element.props` internals needs review.

## 4. Verify

```sh
npm run build && npm test
```

Then check the alias actually took effect — the most common failure is a
partially-aliased build shipping both frameworks:

```sh
grep -rl "react-dom" dist/ | head
```

Report the before/after bundle size; it is the reason the migration was worth
doing.

## 5. Report

Tell the user:

- Which files changed and why.
- Any dependency that still pulls in real React, and whether it matters.
- Bundle size before and after.
- Anything you found in step 1 that you could not migrate.
