---
name: Getting Started
description: "How to get started with Preact. We'll learn how to setup the tooling (if any) and get going with writing an application."
---

# Getting Started

This guide helps you get up and running to start developing Preact apps.

There are 3 popular options. If you're new to Preact, we recommend starting with [Preact CLI](#best-practices-powered-by-preact-cli).

---

<div><toc></toc></div>

---

## No build tools route

Preact is packaged to be used directly in the browser, and doesn't require any build or tools:

```html
<script type="module">
  import { h, Component, render } from 'https://unpkg.com/preact?module';

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
  import { h, Component, render } from 'https://unpkg.com/preact?module';
  import htm from 'https://unpkg.com/htm?module';

  // Initialize htm with Preact
  const html = htm.bind(h);

  const app = html`<h1>Hello World!</h1>`;
  render(app, document.body);
</script>
```

[🔨 Edit on Glitch](https://glitch.com/~preact-with-htm)

For more information on HTM, check out its [documentation][htm].

## Best practices powered by Preact CLI

[Preact CLI] is an off-the-shelf solution for building Preact applications that is optimized for modern web development. It's built on standard tooling projects like Webpack, Babel and PostCSS. Preact CLI does not require any configuration or prior knowledge to get started, and this simplicity makes it the most popular way to use Preact.

As the name implies, Preact CLI is a **c**ommand-**li**ne tool that can be run in the terminal on your machine. Install it globally by running:

```bash
npm install -g preact-cli
```

After that you'll have a new command in your terminal called `preact`. With it you can create a new application by running the `preact create` command:

```bash
preact create default my-project
```

This will create a new application based on our [default template](https://github.com/preactjs-templates/default). You will be asked for some information about your project, which will then be generated in the directory you specified (`my-project` in this case).

> **Tip:** Any GitHub repository with a `template/` folder can be used as a custom template:
>
> `preact create <username>/<repository> <project-name>`

### Getting ready for development

Now we're ready to start our application. To start a development server, run the following command inside your newly generated project folder (`my-project` from above):

```bash
# Go into the generated project folder
cd my-project

# Start a development server
npm start
```

Once the server has started, it will print a local development URL to open in your browser.
Now you're ready to start coding your app!

### Making a production build

There comes a time when you need to deploy your app somewhere. The CLI ships with a handy `build` command which will generate a highly optimized production build.

```bash
npm run build
```

Upon completion you'll have a new `build/` folder which can be deployed directly to a server.

> For a full list of all available commands check out the [Preact CLI Documentation](https://github.com/preactjs/preact-cli#cli-options).

## Integrating Into An Existing Pipeline

If you already have an existing tooling pipeline set up, it's very likely that this includes a bundler. The most popular choices are [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) or [parcel](https://parceljs.org/). Preact works out of the box with all of them. No changes needed!

### Setting up JSX

To transpile JSX you need a babel plugin that converts it to valid JavaScript code. The one we all use is [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx). Once installed you need to specify the function for JSX that should be used:

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

> [babeljs](https://babeljs.io/) has some of the best documentation out there. We highly recommend checking it out for questions surrounding babel and how to set it up.

### Aliasing React to Preact

At some point you'll probably want to make use of the vast react ecosystem. Libraries and Components originally written for React work seamlessly with our compatibility layer. To make use of it we need to point all `react` and `react-dom` imports to Preact. This step is called aliasing.

#### Aliasing in webpack

To alias any package in webpack you need to add the `resolve.alias` section
to your config. Depending on the configuration you're using this section may
already be present, but missing the aliases for Preact.

```js
const config = { 
   //...snip
  "resolve": { 
    "alias": { 
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
     // Must be below test-utils
    },
  }
}
```

#### Aliasing in parcel

Parcel uses the standard `package.json` file to read configuration options under
an `alias` key.

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat"
  },
}
```

#### Aliasing in jest

Similar to bundlers, [jest](https://jestjs.io/) allows to rewrite module paths. The syntax is a bit
different, than in say webpack, because it's based on regex. Add this to your
jest configuration:

```json
{
  "moduleNameMapper": {
    "^react$": "preact/compat",
    "^react-dom/test-utils$": "preact/test-utils",
    "^react-dom$": "preact/compat"
  }
}
```

[htm]: https://github.com/developit/htm
[Preact CLI]: https://github.com/preactjs/preact-cli
