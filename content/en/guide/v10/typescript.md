---
name: TypeScript
description: "Preact has built-in TypeScript support. Learn how to make use of it!"
---

# TypeScript

Preact ships TypeScript type definitions, which are used by the library itself! 

When you use Preact in a TypeScript-aware editor (like VSCode), you can benefit from the added type information while writing regular JavaScript.

---

<div><toc></toc></div>

---

## TypeScript configuration

TypeScript includes a ful-fledged JSX compiler which you can use instead of Babel. Add the following configuration to your `tsconfig.json` to transpile JSX to Preact-compatible JavaScript:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    //...
  }
}
```

If you use TypeScript within a Babel toolchain, set `jsx` to `preserve` and let Babel handle the transpilation. You still need to specify `jsxFactory` and `jsxFragmentFactory` to get the correct types.

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    //...
  }
}
```

Rename your `jsx` files to `tsx` for TypeScript to correctly parse your JSX.

## Typing components



### Function components

### Class components

### Typing children

## Typing hooks

## Typing events
