---
name: preact-ssr
version: 1.0.0
description: Set up or debug server-side rendering and prerendering for a Preact app using preact-render-to-string, including hydration mismatches. Use when asked to "add SSR", "prerender my Preact app", "fix hydration errors", or "server render Preact".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# Server-side rendering with Preact

Read the guide first:

```sh
curl https://preactjs.com/guide/v10/server-side-rendering.md
```

## Rendering

```sh
npm install preact-render-to-string
```

```js
import { render } from 'preact-render-to-string';
const html = render(<App />);
```

Variants, and when each is right:

- `render` — synchronous, the default.
- `renderToStringAsync` — when components suspend on data.
- `renderToPipeableStream` / `renderToReadableStream` — streaming, for
  time-to-first-byte on slow data.
- `preact-render-to-string/jsx` — JSX-shaped output, for snapshot tests only.

## Hydration

```js
import { hydrate } from 'preact';
hydrate(<App />, document.getElementById('app'));
```

`hydrate` attaches to existing DOM without re-creating it. It only works if the
client's first render produces the same tree the server produced.

## Diagnosing hydration mismatches

Mismatches almost always come from one of these. Grep for them before reading
anything else:

```sh
# Browser-only globals read during render
grep -rn "window\.\|document\.\|localStorage\|navigator\." src/ --include=*.jsx --include=*.tsx
# Non-deterministic render output
grep -rn "Math.random()\|Date.now()\|new Date()" src/ --include=*.jsx --include=*.tsx
```

The fix is not to delete these — it is to move them out of the first render:

```jsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
return mounted ? <ClientOnlyThing /> : null;
```

Then add `import 'preact/debug'` in development; it reports mismatches with the
offending element rather than silently patching over them.

## Things that bite specifically on the server

- **Module-scope mutable state** is shared across requests. Signals, caches and
  "current user" module variables all leak between users.
- **Relative `fetch()` URLs** have no origin on the server and throw. Pass an
  absolute URL or read from disk.
- **Libraries that touch `document` at import time** break the server bundle.
  Import them lazily inside an effect.
- **`useLayoutEffect`** does not run on the server; anything it measures is
  unavailable during SSR.

## Report

State what you set up or fixed, which mismatches you found, and any component
you had to make client-only — that last one is a real trade-off and the user
should know about it.
