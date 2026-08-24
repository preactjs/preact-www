---
name: preact-debug
version: 1.0.0
description: Diagnose a misbehaving Preact app — components not updating, stale state, hydration mismatches, key warnings, or memory leaks. Use when asked to "debug my Preact app", "why isn't this re-rendering", or "fix this Preact bug".
allowed-tools: Read, Edit, Grep, Glob, Bash
---

# Debug a Preact app

Reference:

```sh
curl https://preactjs.com/guide/v10/debugging.md
```

## Always start here

Add the debug build in development. It converts silent misbehaviour into real
error messages, and it must be the first import:

```js
// index.js — before anything else
import 'preact/debug';
```

It catches invalid vnodes, duplicate keys, hydration mismatches, `undefined`
components, and updates on unmounted components.

Ship `preact/devtools` instead of `preact/debug` in production if you want the
devtools bridge without the assertions.

## Symptom → cause

**Component does not re-render after a state change.** Almost always state
mutated in place rather than replaced:

```sh
grep -rn "\.push(\|\.splice(\|\.sort(\|\[.*\] *=" src/ --include=*.jsx --include=*.tsx | head -20
```

`setItems(items.push(x))` does not work; `setItems([...items, x])` does.

**Stale value inside a callback or effect.** A missing dependency closed over an
old render's value. Check the dependency array actually lists everything the
body reads.

**List reorders lose input state or animate wrong.** Missing or index-based
keys:

```sh
grep -rn "key={i}\|key={index}" src/ --include=*.jsx --include=*.tsx
```

Index keys are correct only for lists that never reorder, insert, or delete.

**Hydration mismatch.** See the `preact-ssr` skill — the cause is render output
differing between server and client.

**Memory grows over time.** An effect that subscribes without returning a
cleanup:

```sh
grep -rn "addEventListener\|setInterval\|subscribe(" src/ --include=*.jsx --include=*.tsx
```

Each of those inside `useEffect` needs a matching teardown in the returned
function.

## Method

Do not fix anything before you can explain the mechanism. Reproduce first,
narrow to the smallest component that still shows it, then state the cause in
one sentence and only then change code. If you cannot reproduce it, say so
rather than applying a speculative fix.

## Report

Give the root cause, the fix, and how you verified it. If you found other
instances of the same pattern while grepping, list them separately — they are
suggestions, not part of the fix.
