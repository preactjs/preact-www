---
name: Getting Started
description: "How to get started with Preact. We'll learn how to setup the tooling (if any) and get going with writing an application."
---

# Getting Started

This guide helps you get up and running to start developing Preact apps. There are 3 popular ways to do so.

If you're just starting out we highly recommend going with [preact-cli](#best-practices-powered-with-preact-cli).

---

<toc></toc>

---

## No build tools route

Preact has always been readily packaged to be used right in the browser. This doesn't require any build tools at all.

```js
import { h, Component, render } from 'https://unpkg.com/preact?module';

// Create your app
const app = h('div', null, 'Hello World!');

// Inject your application into the an element with the id `app`.
// Make sure that such an element exists in the dom ;)
render(app, document.getElementById('app'));
```

The only difference is that you cannot use JSX, because JSX needs to be transpiled. We got you covered with an alternative in the next section. So keep reading.

### Alternatives to JSX

Writing raw `h` or `createElement` calls all the time is much less fun than using something JSX-like. JSX has the advantage of looking similar to HTML, which makes it easier to understand for many developers in our experience. It requires a built-step though, so we highly recommend an alternative called [htm].

In a nutshell [htm] can be best described as: JSX-like syntax in plain JavaScript without a need for a transpiler. Instead of using a custom syntax it relies on native tagged template strings which were added to JavaScript a while back.

```js
import { h, Component, render } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';

// Initialize htm with Preact
const html = htm.bind(h);

const app = html`<div>Hello World!</div>`
render(app, document.getElementById('app'));
```

It's a very popular way of writing Preact apps and we highly recommend checking out htm's [README][htm] file if you're interested in going with this route.

## Best practices powered with `preact-cli`

The `preact-cli` project is a ready made solution to bundle Preact applications with the optimal bundler configuration that's best for modern web application. It's built on standard tooling projects like `webpack`, `babel` and `postcss`. Because of the simplicity this is the most popular way to use Preact among our users.

As the name implies, `preact-cli` is a **c**ommand-**li**ne tool that can be run in the terminal on your machine. Install it globally by running:

```bash
npm install -g preact-cli
```

After that you'll have a new command in your terminal called `preact`. With it you can create a new application by executing the following command:

```bash
preact create default my-project
```

The above command pulls the template from `preactjs-templates/default`, prompts for some information, and generates the project at `./my-project/`.

> Tip: Any Github repo with a `'template'` folder can be used as a custom template: `preact create <username>/<repository> <project-name>`

### Getting ready for development

Now we're ready to start our application. To fire up the development server run the following command inside the freshly generated project folder (`my-project` in this example):

```bash
# Go into the generated project folder
cd my-project/

# Start the devserver
npm run dev
```

Once the server is up you can access your app at the URL that was printed in the console. Now you're ready to develop your app!

### Making a production build

There comes a time when you need to deploy your app somewhere. The CLI ships with a handy `build` command which will generate a highly optimized build.

```bash
npm run build
```

Upon completion you'll have a new `build/` folder which can be deployed directly to a server.

> For a full list of all available commands check out the list in preact-cli's [README file](https://github.com/preactjs/preact-cli#cli-options).

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

> [babeljs](https://babeljs.io/) has one of the best documentation out there. We highly recommend checking it out for questions surrounding babel and how to set it up.

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
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat"
  }
}
```

[htm]: https://github.com/developit/htm

