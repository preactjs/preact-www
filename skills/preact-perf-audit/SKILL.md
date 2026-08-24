---
name: preact-perf-audit
version: 1.0.0
description: Audit a Preact app for bundle size and rendering performance — duplicate frameworks, missing code splitting, avoidable re-renders. Use when asked to "why is my bundle so big", "audit Preact performance", or "make this app faster".
allowed-tools: Read, Edit, Grep, Glob, Bash
---

# Preact performance audit

Report findings before changing anything. An audit that silently rewrites code
is not an audit.

## 1. Is Preact actually what is shipping?

The most expensive bug in a Preact app is shipping React alongside it.

```sh
npm ls react react-dom 2>/dev/null
grep -rl "react-dom" dist/ build/ 2>/dev/null | head
```

If a dependency resolves the real React, the alias is incomplete — fix that
first; nothing else on this list is worth as much.

## 2. Measure

```sh
npm run build
du -sh dist/ && ls -lhS dist/assets/*.js 2>/dev/null | head -10
```

Attribute the largest chunks before optimising. A 300kB chunk that is one date
library is a different problem from a 300kB chunk of application code.

## 3. Bundle checks

```sh
# Whole-library imports that defeat tree shaking
grep -rn "^import \* as\|from 'lodash'\|from 'moment'" src/
# Static imports of heavy, rarely-used UI
grep -rn "import .*\(Editor\|Chart\|Modal\|Map\)" src/ --include=*.jsx --include=*.tsx
```

Route-level splitting is usually the single biggest win:

```js
import { lazy } from 'preact-iso';
const Settings = lazy(() => import('./routes/settings.jsx'));
```

## 4. Rendering checks

Preact is fast by default; most render problems are one of these three.

```sh
# New object/array/function identities in props — breaks memo downstream
grep -rn "={{\|={\[\|={() =>" src/ --include=*.jsx --include=*.tsx | head -20
# Context holding a fresh object every render — re-renders every consumer
grep -rn "\.Provider value={{" src/
# Expensive work in render rather than useMemo
grep -rn "\.filter(.*)\.map(\|\.sort(" src/ --include=*.jsx --include=*.tsx | head
```

Only the context one is reliably a bug. Inline props matter only when the child
is memoised; say so rather than reporting every hit.

Then measure with the Preact devtools profiler before and after. Do not claim a
speedup you have not measured.

## 5. Consider signals

If a small, frequently-changing value re-renders a large subtree, `@preact/signals`
can cut that to a text-node update. See the `preact-signals` skill.

## Report

Ordered by impact, each with the measurement that justifies it:

1. Finding, evidence (size or profile), suggested fix, estimated saving.

Say explicitly which findings you did not act on and why.
