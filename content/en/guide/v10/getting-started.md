---
name: Getting Started
description: "How to get started with Preact. We'll learn how to setup the tooling (if any) and get going with writing an application."
---

# Getting Started

New to Preact? New to Virtual DOM? Check out the [tutorial](/tutorial).

This guide helps you get up and running to start developing Preact apps, using 3 popular options.
If you're new to Preact, we recommend starting with [Vite](#create-a-vite-powered-preact-app).

---

<div><toc></toc></div>

---

## No build tools route

Preact is packaged to be used directly in the browser, and doesn't require any build or tools:

```html
<script type="module">
  import { h, render } from 'https://esm.sh/preact';

  // Create your app
  const app = h('h1', null, 'Hello World!');

  render(app, document.body);
</script>
```

[🔨 Edit on Glitch](https://glitch.com/~preact-no-build-tools)

The primary drawback of developing this way is the lack of JSX, which requires a build step. An ergonomic and performant alternative to JSX is documented in the next section.

### Alternatives to JSX

Writing raw `h` or `createElement` calls can be tedious. JSX has the advantage of looking similar to HTML, which makes it easier to understand for many developers in our experience. JSX requires a build step though, so we highly recommend an alternative called [HTM][htm].

[HTM][htm] is a JSX-like syntax that works in standard JavaScript. Instead of requiring a build step, it uses JavaScript's own [Tagged Templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates) syntax, which was added in 2015 and is supported in [all modern browsers](https://caniuse.com/#feat=template-literals). This is an increasingly popular way to write Preact apps, since there are fewer moving parts to understand than a traditional front-end build tooling setup.

```html
<script type="module">
  import { h, render } from 'https://esm.sh/preact';
  import htm from 'https://esm.sh/htm';

  // Initialize htm with Preact
  const html = htm.bind(h);

  function App (props) {
    return html`<h1>Hello ${props.name}!</h1>`;
  }

  render(html`<${App} name="World" />`, document.body);
</script>
```

[🔨 Edit on Glitch](https://glitch.com/~preact-with-htm)

> **Tip:** HTM also provides a convenient single-import Preact version:
>
> `import { html, render } from 'https://esm.sh/htm/preact/standalone'`

For more information on HTM, check out its [documentation][htm].

[htm]: https://github.com/developit/htm

## Create a Vite-Powered Preact App

[Vite](https://vitejs.dev) has become an incredibly popular tool for building applications across many frameworks in the past couple of years, and Preact is no exception. It's built upon popular tooling like ES modules, Rollup, and ESBuild. Vite, through our initializer or their Preact template, requires no configuration or prior knowledge to get started and this simplicity makes it a very popular way to use Preact.

To get up and running with Vite quickly, you can use our initializer `create-preact`. This is an interactive command-line interface (CLI) app that can be run in the terminal on your machine. Using it, you can create a new application by running the following:

```bash
npm init preact
```

This will walk you through creating a new Preact app and gives you some options such as TypeScript, routing (via `preact-iso`), and ESLint support.

> **Tip:** None of these decisions need to be final, you can always add or remove them from your project later if you change your mind.

### Getting ready for development

Now we're ready to start our application. To start a development server, run the following command inside your newly generated project folder:

```bash
# Go into the generated project folder
cd my-preact-app

# Start a development server
npm run dev
```

Once the server has started, it will print a local development URL to open in your browser.
Now you're ready to start coding your app!

### Making a production build

There comes a time when you need to deploy your app somewhere. Vite ships with a handy `build` command which will generate a highly-optimized production build.

```bash
npm run build
```

Upon completion, you'll have a new `dist/` folder which can be deployed directly to a server.

> For a full list of all available commands and their options, check out the [Vite CLI Documentation](https://vitejs.dev/guide/cli.html).

## Integrating Into An Existing Pipeline

If you already have an existing tooling pipeline set up, it's very likely that this includes a bundler. The most popular choices are [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) or [parcel](https://parceljs.org/). Preact works out of the box with all of them, no major changes needed!

### Setting up JSX

To transpile JSX, you need a Babel plugin that converts it to valid JavaScript code. The one we all use is [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx). Once installed, you need to specify the function for JSX that should be used:

```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "h",
      "pragmaFrag": "Fragment",
    }]
  ]
}
```

> [Babel](https://babeljs.io/) has some of the best documentation out there. We highly recommend checking it out for questions surrounding Babel and how to set it up.

### Aliasing React to Preact

At some point, you'll probably want to make use of the vast React ecosystem. Libraries and Components originally written for React work seamlessly with our compatibility layer. To make use of it, we need to point all `react` and `react-dom` imports to Preact. This step is called _aliasing._

> **Note:** If you're using Vite, Preact CLI, or WMR, these aliases are automatically handled for you by default.

#### Aliasing in Webpack

To alias any package in Webpack, you need to add the `resolve.alias` section
to your config. Depending on the configuration you're using, this section may
already be present, but missing the aliases for Preact.

```js
const config = {
   //...snip
  "resolve": {
    "alias": {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",     // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime"
    },
  }
}
```

#### Aliasing in Node

When running in Node, bundler aliases (Webpack, Rollup, etc.) will not work, as can
be seen in NextJS. To fix this, we can use aliases directly in our `package.json`:

```json
{
  "dependencies": {
    "react": "npm:@preact/compat",
    "react-dom": "npm:@preact/compat",
  }
}
```

#### Aliasing in Parcel

Parcel uses the standard `package.json` file to read configuration options under
an `alias` key.

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat",
    "react/jsx-runtime": "preact/jsx-runtime"
  },
}
```

#### Aliasing in Rollup

To alias within Rollup, you'll need to install [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias).
The plugin will need to be placed before your [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)

```js
import alias from '@rollup/plugin-alias';

module.exports = {
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' }
      ]
    })
  ]
};
```

#### Aliasing in Jest

[Jest](https://jestjs.io/) allows the rewriting of module paths similar to bundlers.
These rewrites are configured using regular expressions in your Jest configuration:

```json
{
  "moduleNameMapper": {
    "^react$": "preact/compat",
    "^react-dom/test-utils$": "preact/test-utils",
    "^react-dom$": "preact/compat",
    "^react/jsx-runtime$": "preact/jsx-runtime"
  }
}
```

#### Aliasing in TypeScript

TypeScript, even when used alongside a bundler, has its own process of resolving types.
In order to ensure Preact's types are used in place of React's, you will want to add the
following configuration to your `tsconfig.json` (or `jsconfig.json`):


```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react-dom": ["./node_modules/preact/compat/"]
    }
  }
}
```

Additionally, you may want to enable `skipLibCheck` as we do in the example above. Some
React libraries make use of types that may not be provided by `preact/compat` (though we do
our best to fix these), and as such, these libraries could be the source of TypeScript compilation
errors. By setting `skipLibCheck`, you can tell TS that it doesn't need to do a full check of all
`.d.ts` files (usually these are limited to your libraries in `node_modules`) which will fix these errors.

