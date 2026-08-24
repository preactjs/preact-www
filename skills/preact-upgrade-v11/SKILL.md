---
name: preact-upgrade-v11
version: 1.0.0
description: Upgrade a project from Preact 10 to Preact 11. Applies the breaking changes from the official upgrade guide and verifies the result. Use when asked to "upgrade to Preact 11", "move to v11", or "try the Preact 11 RC".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# Upgrade Preact 10 → 11

Always read the current upgrade guide first. It is maintained alongside the
release and supersedes anything summarised here:

```sh
curl https://preactjs.com/guide/v11/upgrade-guide.md
```

Then confirm which version is actually current, rather than guessing:

```sh
curl -s -X POST https://preactjs.com/api/capabilities/preact/latestRelease \
  -H 'content-type: application/json' -d '{}'
```

## 1. Check the ecosystem before the app

Preact 11 changes internals that addon libraries reach into. Check every
`preact-*` and `@preact/*` dependency for a v11-compatible release before
touching application code:

```sh
grep -o '"\(preact[^"]*\|@preact/[^"]*\)": "[^"]*"' package.json
```

If a dependency has no v11-compatible version, stop and report it. Upgrading
into a broken addon wastes more time than waiting.

## 2. Upgrade

```sh
npm install preact@next preact-render-to-string@next
```

Upgrade `@preact/signals`, `preact-iso` and friends in the same step — mixed
majors are the most common source of confusing breakage.

## 3. Apply the breaking changes

Work from the upgrade guide fetched in step 0. Search for the patterns it calls
out, for example:

```sh
# Internal fields — anything reading these needs the guide's replacement
grep -rn "__k\|__e\|_dom\|_children\|options\.vnode\b" src/
# Deprecated APIs
grep -rn "preact/debug\|preact/compat" src/
```

Do not mechanically rewrite anything the guide does not mention. If you find a
pattern the guide does not cover, report it rather than inventing a migration.

## 4. Verify

```sh
npm run build && npm test
```

Add `import 'preact/debug'` in development if anything renders oddly — it
surfaces hydration mismatches and invalid vnodes with real messages.

## 5. Report

List every change you made, every dependency you bumped, and anything from the
upgrade guide you deliberately skipped and why.
