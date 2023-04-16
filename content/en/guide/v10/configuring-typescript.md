---
name: Configuring TypeScript
description: "Preact has built-in TypeScript support. Learn how to configure it!"
---

# TypeScript

Preact ships TypeScript type definitions, which are used by the library itself!

When you use Preact in a TypeScript-aware editor (like VSCode), you can benefit from the added type information even while writing regular JavaScript. If you want to add type information to your own applications, you can use [JSDoc annotations](https://fettblog.eu/typescript-jsdoc-superpowers/), or write TypeScript and transpile to regular JavaScript. These docs will focus on the latter.

---

<div><toc></toc></div>

---

## Configuring TypeScript

TypeScript includes a full-fledged JSX compiler that you can use instead of Babel. Add the following configuration to your `tsconfig.json` to transpile JSX to Preact-compatible JavaScript:

```json
// TypeScript >= 4.1.1
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    //...
  }
}
```
```json
// TypeScript < 4.1.1
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

In your `.babelrc`:

```javascript
{
  presets: [
    "@babel/env",
    ["@babel/typescript", { jsxPragma: "h" }],
  ],
  plugins: [
    ["@babel/transform-react-jsx", { pragma: "h" }]
  ],
}
```

Rename your `.jsx` files to `.tsx` for TypeScript to correctly parse your JSX.

## Configuring with `preact/compat`

If you're using `preact/compat` in your application to get access to the wider React ecosystem,
you may need to disable type checking declaration files (`.d.ts`) and/or add path aliases to ensure
your React-based libraries are consuming Preact's types instead:

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    ...
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react-dom": ["./node_modules/preact/compat/"]
    }
  }
}
```
