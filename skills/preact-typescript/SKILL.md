---
name: preact-typescript
version: 1.0.0
description: Configure TypeScript for a Preact project and fix Preact-specific type errors, including JSX types, compat aliasing, and component typing. Use when asked to "set up TypeScript with Preact", "fix these Preact type errors", or "type my Preact components".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# TypeScript with Preact

Reference:

```sh
curl https://preactjs.com/guide/v10/typescript.md
```

## tsconfig

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2022",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true
  }
}
```

If the project uses `preact/compat` so that React-typed libraries resolve, add
the path mapping as well — the bundler alias does not teach TypeScript anything:

```json
{
  "compilerOptions": {
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react-dom": ["./node_modules/preact/compat/"]
    }
  }
}
```

## Typing components

Prefer typing props directly over `FunctionComponent`, which additionally
implies `children`:

```tsx
interface Props {
  label: string;
  onSelect?: (id: string) => void;
}

function Button({ label, onSelect }: Props) { ... }
```

When the component genuinely takes children:

```tsx
import type { ComponentChildren } from 'preact';

interface Props {
  children: ComponentChildren;
}
```

Useful types: `ComponentChildren`, `VNode`, `Ref<T>`, `RefObject<T>`,
`JSX.HTMLAttributes<T>`, `JSX.CSSProperties`.

## Common errors

**"Property 'X' does not exist on type 'JSX.IntrinsicElements'"** — a custom
element. Declare it:

```ts
declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      'my-element': { some: string };
    }
  }
}
```

**Event handler parameter is implicitly `any`** — Preact's handlers are typed
from the element. Type the element, not the event: `(e: JSX.TargetedEvent<HTMLInputElement>)`.

**React types conflicting with Preact types** — usually `@types/react` present
in `node_modules` and picked up globally. Check `types` in tsconfig, and check
whether a dependency pulls it in.

## Verify

```sh
npx tsc --noEmit
```

Report the error count before and after, and list any `any` or `@ts-expect-error`
you had to add — those are debts, not fixes.
